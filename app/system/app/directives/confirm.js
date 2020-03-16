const handleUpdate = (el, binding, vnode) => {
    const $trans = vnode.context.$trans;
    const buttons = (el.getAttribute('buttons') || '').split(',');

    let options = {
        title: false,
        labels: {
            Ok: buttons[0] || $trans('Ok'),
            Cancel: buttons[1] || $trans('Cancel')
        }
    };

    // vue-confirm="'Title':'Text...?'"
    if (binding.arg) {
        options.title = this.arg;
    }

    // vue-confirm="'Text...?'"
    if (typeof binding.value === 'string') {
        options.text = binding.value;
    }

    // vue-confirm="{title:'Title', text:'Text...?'}"
    if (typeof binding.value === 'object') {
        options = _.extend(binding.options, binding.value);
    }

    let handler = vnode.data.on.click.fns;
    vnode.data.on.click.fns = (e) => {
        UIkit.modal.confirm($trans(options.text), () => {
            handler(e);
        }, options);
    }
};

export default {
    bind(el, binding, vnode) {
        handleUpdate(el, binding, vnode);
    },
    componentUpdated(el, binding, vnode) {
        handleUpdate(el, binding, vnode);
    }
};
