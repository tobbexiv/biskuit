const storage = {};

export default {
    bind(el, binding, vnode) {
        const field = binding.arg;
        storage[field] = {
            indicator: $('<i class="uk-icon-justify uk-margin-small-left"></i>'),
            direction: '',
            active: false
        };

        $(el).addClass('pk-table-order uk-visible-hover-inline').on('click.order', () => {
            storage[field].direction = (storage[field].direction == 'asc') ? 'desc':'asc';
            _.set(vnode.context, binding.expression, [field, storage[field].direction].join(' '));
        }).append(storage[field].indicator);
    },

    update(el, binding, vnode) {
        const field = binding.arg;
        const parts = binding.value.split(' ');
        const selectedField = parts[0];
        const selectedDirection = parts[1] || 'asc';

        storage[field].indicator.removeClass('pk-icon-arrow-up pk-icon-arrow-down');
        $(el).removeClass('uk-active');

        if (selectedField == field) {
            storage[field].direction = selectedDirection;
            storage[field].active = true;

            $(el).addClass('uk-active');
            storage[field].indicator.removeClass('uk-invisible').addClass(selectedDirection == 'asc' ? 'pk-icon-arrow-down':'pk-icon-arrow-up');
        } else {
            storage[field].indicator.addClass('pk-icon-arrow-down uk-invisible');
            storage[field].direction = '';
            storage[field].active = false;
        }
    },

    unbind(el, binding, vnode) {
        const field = binding.arg;
        $(el).removeClass('pk-table-order').off('.order');
        storage[field].indicator.remove();
        delete storage[field];
    }
};
