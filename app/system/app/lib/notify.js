export default (Vue) => {
    Vue.prototype.$notify = () => {
        const messages = document.getElementsByClassName('pk-system-messages');
        const UIkit = window.UIkit || {};
        const message = arguments[0] ? this.$trans(arguments[0]) : this.$trans('Unknown error');
        const status = arguments[1] || 'info';

        if (UIkit.notify) {
            Uikit.notify(message, status);
        } else if (messages) {
            messages.empty().append(`<div class="uk-alert uk-alert-${status}"><p>${message}</p></div>`);
        }
    };
};
