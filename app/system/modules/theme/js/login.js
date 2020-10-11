(function($, on, addClass, find) {
    on(document, 'DOMContentLoaded', function() {
        var messages = $('.bk-system-messages');
        if(messages && messages.children.length) {
            var login = $('.js-login');
            addClass(login, 'uk-animation-shake');
            find('input[type=password]', login).focus();
        }
    });
})(UIkit.util.$, UIkit.util.on, UIkit.util.addClass, UIkit.util.find);
