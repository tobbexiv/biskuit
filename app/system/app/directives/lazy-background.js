export default {
    update(el, binding) {
        const img = new Image();
        const { value } = binding;
        img.onload = () => el.css('background-image', `url('${value}')`);
        img.src = value;
    }
};
