import { $, on, addClass, removeClass, append, remove } from 'uikit-util';
import UIkit from 'uikit';

const storage = {};

export default {
    bind(el, binding, vnode) {
        const field = binding.arg;
        storage[field] = {
            indicator: $('<i class="uk-margin-small-left uk-invisible-hover"></i>'),
            direction: '',
            detach: null,
            active: false
        };

        addClass(el, 'bk-order uk-visible-toggle');
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

        removeClass(el, 'uk-active');

        if (selectedField == field) {
            storage[field].direction = selectedDirection;
            storage[field].active = true;

            addClass(el, 'uk-active');
            removeClass(storage[field].indicator, 'uk-invisible-hover')
            UIkit.icon(storage[field].indicator, { icon: selectedDirection == 'asc' ? 'arrow-down' : 'arrow-up' });
        } else {
            UIkit.icon(storage[field].indicator, { icon: 'arrow-down' });
            addClass(storage[field].indicator, 'uk-invisible-hover');
            storage[field].direction = '';
            storage[field].active = false;
        }
    },

    unbind(el, binding, vnode) {
        const field = binding.arg;
        removeClass(el, 'bk-order')
        storage[field].detach();
        remove(storage[field].indicator);
        delete storage[field];
    }
};
