const toNumber = (value, binding) => {
    return binding.number ? Number(value) : value;
};

const state(el, checked) {
    if (checked === undefined) {
        el.indeterminate = true;
    } else {
        el.checked = checked;
        el.indeterminate = false;
    }
};

const selected = (update, el, binding, vnode) => {
    let keypath = binding.arg
    let selected = [];
    let values = []
    let value;

    $(binding.selector, this.$el).each(function () {

        value = toNumber($(this).val(), binding);
        values.push(value);

        if ($(this).prop('checked')) {
            selected.push(value);
        }
    });

    if (update) {
        update = this.vm.$get(keypath).filter(function (value) {
            return values.indexOf(value) === -1;
        });

        Vue.set(this.vm, keypath, update.concat(selected));
    }

    if (selected.length === 0) {
        return false;
    } else if (selected.length == values.length) {
        return true;
    } else {
        return undefined;
    }
};

export default {
    update(subSelector) {
        const { group } = el.dataset;
        var self = this, keypath = this.arg, group = this.params.group ? this.params.group + ' ' : '', selector = group + subSelector;

        this.selector = selector;
        this.$el = this.vm.$el;
        this.checked = false;
        this.number = this.el.getAttribute('number') !== null;

        $(this.el).on('change.check-all', function () {
            $(selector, self.$el).prop('checked', $(this).prop('checked'));
            self.selected(true);
        });

        this.handler = [
            function () {
                self.selected(true);
                self.state();
            },
            function (e) {
                if (!$(e.target).is(':input, a') && !window.getSelection().toString()) {
                    $(this).find(subSelector).trigger('click');
                }
            }
        ];

        $(this.$el).on('change.check-all', selector, this.handler[0]);
        $(this.$el).on('click.check-all', group + '.check-item', this.handler[1]);

        this.unbindWatcher = this.vm.$watch(keypath, function (selected) {

            $(subSelector, this.$el).prop('checked', function () {
                return selected.indexOf(self.toNumber($(this).val(), binding)) !== -1;
            });

            self.selected();
            self.state();
        });
    },

    unbind(el) {
        var self = this;

        $(el).off('.check-all');

        if (binding.handler) {
            this.handler.forEach(function (handler) {
                $(self.$el).off('.check-all', handler);
            });
        }

        if (this.unbindWatcher) {
            this.unbindWatcher();
        }
    }
};
