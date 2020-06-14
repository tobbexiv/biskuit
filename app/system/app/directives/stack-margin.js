export default {
    bind(el) {
        el.dataset.cls = el.classList.contains('uk-grid') ? 'uk-grid-margin':'uk-margin-small-top';
    },

    update(el) {
        const $el = $(el);
        const { cls } = el.dataset;
        Vue.nextTick(() => UIkit.Utils.stackMargin($el.children(), { cls: cls }));
    }
};
