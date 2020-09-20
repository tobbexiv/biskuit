import { $, on, addClass, removeClass, append, remove } from 'uikit-util';

const storage = {};

export default {
    bind(el, binding, vnode) {
        const field = binding.arg;
        storage[field] = {
            indicator: $('<i class="uk-icon-justify uk-margin-small-left"></i>'),
            direction: '',
            detach: null,
            active: false
        };

        addClass(el, 'pk-table-order uk-visible-hover-inline');
        storage[field].detach = on(el, 'click', () => {
            storage[field].direction = (storage[field].direction == 'asc') ? 'desc':'asc';
            _.set(vnode.context, binding.expression, [field, storage[field].direction].join(' '));
        });
        append(el, storage[field].indicator);
    },

    update(el, binding, vnode) {
        const field = binding.arg;
        const parts = binding.value.split(' ');
        const selectedField = parts[0];
        const selectedDirection = parts[1] || 'asc';

        removeClass(storage[field].indicator, 'pk-icon-arrow-up pk-icon-arrow-down');
        removeClass(el, 'uk-active');

        if (selectedField == field) {
            storage[field].direction = selectedDirection;
            storage[field].active = true;

            addClass(el, 'uk-active');
            removeClass(storage[field].indicator, 'uk-invisible')
            addClass(storage[field].indicator, selectedDirection == 'asc' ? 'pk-icon-arrow-down':'pk-icon-arrow-up');
        } else {
            addClass(storage[field].indicator, 'pk-icon-arrow-down uk-invisible');
            storage[field].direction = '';
            storage[field].active = false;
        }
    },

    unbind(el, binding, vnode) {
        const field = binding.arg;
        removeClass(el, 'pk-table-order')
        storage[field].detach();
        remove(storage[field].indicator);
        delete storage[field];
    }
};
