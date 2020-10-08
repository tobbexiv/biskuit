Vue.ready(function () {
    var Menu = Vue.extend({
        data: function () {
            return _.extend({
                nav: null,
                item: null,
                subnav: null
            }, window.$biskuit);
        },

        created: function () {
            var menu = _(this.menu).sortBy('priority').groupBy('parent').value(),
                item = _.find(menu.root, 'active');

            this.nav = menu.root;

            if (item) {
                this.item = item;
                this.subnav = menu[item.id];
            }
        }
    });

    // mount menus
    new Menu().$mount('#header');
    new Menu().$mount('#offcanvas');
    new Menu().$mount('#offcanvas-flip');

    /*/ main menu order TODO - re-enable?
    $('#js-appnav').on('stop.uk.sortable', function () {

        var data = {};

        $(this).children().each(function (i) {
            data[$(this).data('id')] = i;
        });

        Vue.http.post('admin/adminmenu', {order: data});
    });*/

    // show system messages
    UIkit.util.toNodes(UIkit.util.$('.pk-system-messages').children).forEach(function (message) {
        var data = message.dataset;

        // remove success message faster
        if (data.status && data.status == 'success') {
            data.timeout = 2000;
        }

        UIkit.notify(UIkit.util.html(message), data);
        UIkit.util.remove(message);
    });

    // UIkit overrides
    UIkit.modal.alert_old = UIkit.modal.alert;
    UIkit.modal.alert = function (message, options) {
        options = _.extend({ stack: true, title: false, labels: UIkit.modal.labels }, options);
        var result = UIkit.modal.alert_old(message, options);
        if(options.title) {
            var body = UIkit.util.$('.uk-modal-body', result.dialog.$el);
            UIkit.util.before(body, '<div class="uk-modal-header"><h2 class="uk-modal-title">' + options.title + '</div>');
        }
        return result;
    };

    UIkit.modal.confirm_old = UIkit.modal.confirm;
    UIkit.modal.confirm = function (message, options) {
        options = _.extend({ stack: true, title: false, labels: UIkit.modal.labels }, options);
        var result = UIkit.modal.confirm_old(message, options);
        if(options.title) {
            var body = UIkit.util.$('.uk-modal-body', result.dialog.$el);
            UIkit.util.before(body, '<div class="uk-modal-header"><h2 class="uk-modal-title">' + options.title + '</div>');
        }
        return result;
    };

    UIkit.modal.prompt_old = UIkit.modal.prompt;
    UIkit.modal.prompt = function (message, value, options) {
        options = _.extend({ stack: true, title: false, labels: UIkit.modal.labels }, options);
        var result = UIkit.modal.prompt_old(message, value, options);
        if(options.title) {
            var body = UIkit.util.$('.uk-modal-body', result.dialog.$el);
            UIkit.util.before(body, '<div class="uk-modal-header"><h2 class="uk-modal-title">' + options.title + '</div>');
        }
        return result;
    };

});
