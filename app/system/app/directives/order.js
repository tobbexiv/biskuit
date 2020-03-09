export default {
    bind(el, binding) {
        binding.dir       = '';
        binding.active    = false;
        binding.indicator = $('<i class="uk-icon-justify uk-margin-small-left"></i>');

        $(el).addClass('pk-table-order uk-visible-hover-inline').on('click.order', () => {
            binding.dir = (binding.dir == 'asc') ? 'desc':'asc';
            vnode.context.$set(binding.expression, [binding.arg, binding.dir].join(' '));
        }).append(binding.indicator);
    },

    update(el, binding) {
        const parts = binding.value.split(' ');
        const field = parts[0];
        const dir   = parts[1] || 'asc';

        binding.indicator.removeClass('pk-icon-arrow-up pk-icon-arrow-down');
        $(el).removeClass('uk-active');

        if (field == binding.arg) {
            binding.active = true;
            binding.dir    = dir;

            $(this.el).addClass('uk-active');
            binding.indicator.removeClass('uk-invisible').addClass(dir == 'asc' ? 'pk-icon-arrow-down':'pk-icon-arrow-up');
        } else {
            binding.indicator.addClass('pk-icon-arrow-down uk-invisible');
            binding.active = false;
            binding.dir    = '';
        }
    },

    unbind(el, binding) {
        $(el).removeClass('pk-table-order').off('.order');
        binding.indicator.remove();
    }

};
