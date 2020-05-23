export default (Vue) => {
    Vue.prototype.$notify = function() {
        const messages = document.getElementsByClassName('pk-system-messages');
        const UIkit = window.UIkit || {};
        const message = arguments[0] ? this.$trans(arguments[0]) : this.$trans('Unknown error');
        const status = arguments[1] || 'info';

        if (UIkit.notify) { // TODO: UIkit 2 has notify, UIkit 3 has only notification
            UIkit.notify(message, status);
        } else if (UIkit.notification) {
            UIkit.notification(message, status);
        } else if (messages && messages.length) {
            messages.innerHTML = '';
            messages.append(`<div class="uk-alert uk-alert-${status}"><p>${message}</p></div>`);
        }
    };
};
