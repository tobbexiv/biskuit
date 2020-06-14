import md5 from 'blueimp-md5';

const mutex = {};

const draw = (name, size, colored, img) => {
    name = name || '';
    size = size || 60;

    const colors = [
        "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
        "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
    ];
    const nameSplit = String(name).toUpperCase().split(' ');
    let initials, charIndex, colorIndex, canvas, context, dataURI;

    if (nameSplit.length == 1) {
        initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
    } else {
        initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }

    if (window.devicePixelRatio) {
        size *= window.devicePixelRatio;
    }

    charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
    colorIndex = charIndex % 20;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    context = canvas.getContext("2d");

    context.fillStyle = colored ? colors[colorIndex - 1] : '#cfd2d7';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = `${Math.round(canvas.width / 2)}px Arial`;
    context.textAlign = 'center';
    context.fillStyle = '#FFF';
    context.fillText(initials, size / 2, size / 1.5);

    if (img) {
        context.drawImage(img, 0, 0, size, size);
    }

    dataURI = canvas.toDataURL();
    canvas = null;

    return dataURI;
};

const setImage = (el, binding, vnode) => {
    const cache = vnode.context.$session;
    const hash = binding.value.indexOf('@') !== -1 ? md5(binding.value.toLowerCase()) : binding.value;
    const name = el.getAttribute('title') || el.getAttribute('alt');
    const { colored } = el.dataset;
    const size = (el.getAttribute('height') || 50) * 2;
    const key = `gravatar.${[hash, size, name].join('.')}`;
    let url = `//gravatar.com/avatar/${hash}?r=g&s=${size}`;

    // load image url from cache if exists
    if (cache.get(key)) {
        el.setAttribute('src', cache.get(key));
        return;
    }

    el.setAttribute('src', draw(name, size, colored));

    if (!mutex[key]) {
        mutex[key] = new Vue.Promise((resolve) => {
            const img = new Image();
            if (img.crossOrigin !== undefined) {
                img.crossOrigin = 'anonymous';
                url += '&d=blank';
                img.onload = () => {
                    cache.set(key, draw(name, size, colored, img));
                    resolve();
                };
            } else {
                // IE Fallback (no CORS support for img):
                url += '&d=404';
                img.onload = () => {
                    resolve(url);
                };
            }
            img.src = url;
        });
    }
    mutex[key].then((url) => {
        el.setAttribute('src', url || cache.get(key));
        return url;
    });
};

export default {
    bind(el, binding, vnode) {
        setImage(el, binding, vnode);
    },
    update(el, binding, vnode) {
        setImage(el, binding, vnode);
    }
};
