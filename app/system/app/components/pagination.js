export default {
    template: '<ul class="uk-pagination"></ul>',

    props: {
        value: {
            default: 0
        },

        pages: {
            default: 1
        },

        replaceState: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            page: this.value
        };
    },

    created() {
        this.key = this.$parent.$options.name + '.pagination';
        if (this.page === null && this.$session.get(this.key)) {
            this.page = this.$session.get(this.key);
        }
        if (this.replaceState) {
            this.$state('page', this.page);
        }
    },

    mounted() {
        const vm = this;
        /*
        this.pagination = UIkit.pagination(this.$el, { pages: this.pages, currentPage: this.page || 0 });
        this.pagination.on('select.uk.pagination', (e, page) => {
            vm.page = page;
        });
         */
    },

    watch: {
        /*
        value(newPage) {
            this.page = newPage;
        },
        page(newPage) {
            this.pagination.selectPage(newPage || 0);
            this.$session.set(this.key, newPage || 0);
            this.$emit('input', newPage);
        },
        pages(newPages) {
            this.pagination.render(newPages);
        }
         */
    }
};
