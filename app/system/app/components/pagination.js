import { $, on, append, empty } from 'uikit-util';

export default {
    template: '<ul class="uk-pagination uk-flex-center"></ul>',

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
            page: this.value,
            selectedPage: 0
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

    watch: {
        value(newPage) {
            this.page = newPage;
        },
        page(newPage) {
            this.$session.set(this.key, newPage);
            this.render();
        },
        pages(newPages) {
            this.render();
        }
    },

    methods: {
        setSelectedPage() {
            let selectedPage = this.page || 0;
            this.selectedPage = selectedPage < 0 ? 0 : (selectedPage >= this.pages ? this.pages - 1 : selectedPage);
        },

        render() {
            this.setSelectedPage();
            const intervalRange = 2;
            const edgeItems = 1;
            const interval = {
                low: this.selectedPage - intervalRange >= 0 ? this.selectedPage - intervalRange : 0,
                high: this.selectedPage + intervalRange < this.pages ? this.selectedPage + intervalRange : this.pages - 1
            };
            const showEllipsis = {
                low: interval.low > edgeItems,
                high: interval.high < this.pages - edgeItems - 1
            }

            empty($(this.$el));

            for(let i = 0; i < edgeItems; i++) {
                if(i < interval.low) {
                    this.addPage(i);
                }
            }
            if(showEllipsis.low) {
                this.addEllipsis();
            }
            for(let i = interval.low; i <= interval.high; i++) {
                this.addPage(i);
            }
            if(showEllipsis.high) {
                this.addEllipsis();
            }
            for(let i = this.pages - edgeItems; i < this.pages; i++) {
                if(interval.high < i) {
                    this.addPage(i);
                }
            }
        },

        addPage(pageNumber, text) {
            const vm = this;
            if(pageNumber == this.selectedPage) {
                append(this.$el, `<li class="uk-active"><span>${pageNumber + 1}</span></li>`);
            } else {
                let node = append(this.$el, `<li><a href="#">${pageNumber + 1}</a></li>`);
                on(node, 'click', (e) => {
                    e.preventDefault();
                    vm.$emit('input', pageNumber);
                });
            }
        },

        addEllipsis() {
            append(this.$el, '<li class="uk-disabled"><span>...</span></li>');
        }
    }
};
