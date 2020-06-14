let loadedUrl = '';

const updateHook = (el, binding) => {
    const { value } = binding;
    if(loadedUrl != value) {
        const img = new Image();
        img.onload = () => { el.style['background-image'] = `url('${value}')` };
        img.src = value;
        loadedUrl = value;
    }
};

export default {
    inserted(el, binding) {
        updateHook(el, binding);
    },

    update(el, binding) {
        updateHook(el, binding);
    }
};
