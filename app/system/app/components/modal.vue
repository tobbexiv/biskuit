<template>
    <div :class="wrapperClasses">
        <div class="uk-modal-dialog" :class="dialogClasses" v-if="opened">
            <validation-observer v-slot="validationObserver" slim>
                <div class="uk-modal-header" v-if="hasSlot('header')">
                    <slot name="header" v-bind:validationObserver="validationObserver"></slot>
                </div>
                <div class="uk-modal-body" v-if="hasSlot('default')">
                    <slot v-bind:validationObserver="validationObserver"></slot>
                </div>
                <div class="uk-modal-footer uk-text-right" v-if="hasSlot('footer')">
                    <slot name="footer" v-bind:validationObserver="validationObserver"></slot>
                </div>
            </validation-observer>
        </div>
    </div>
</template>

<script>
    import { on } from 'uikit-util';

    export default {
        data() {
            return {
                opened: false
            };
        },

        props: {
            large: Boolean,
            lightbox: Boolean,
            closed: Function,
            modifier: { type: String, default: '' },
            options: {
                type: Object, default: () => {}
            }
        },

        mounted() {
            const vm = this;

            document.querySelector('body').appendChild(this.$el);
            this.modal = UIkit.modal(this.$el, _.extend({ stack: true }, this.options));

            on(this.modal.$el, 'hidden', () => {
                vm.opened = false;
                if (vm.closed) {
                    vm.closed();
                }
            });
        },

        computed: {
            wrapperClasses() {
                let classes = this.modifier.split(' ');

                if (this.large) {
                    classes.push('uk-modal-container');
                }

                return classes;
            },

            dialogClasses() {
                let classes = [];

                if (this.lightbox) {
                    classes.push('uk-width-auto');
                }

                return classes;
            }
        },

        methods: {
            open() {
                this.opened = true;
                this.modal.show();
            },
            close() {
                this.modal.hide();
            },
            hasSlot(name) {
                const notScoped = this.$slots[name];
                const nodes = this.$scopedSlots && this.$scopedSlots[name] && this.$scopedSlots[name]();
                const scoped = nodes && nodes.length;
                return notScoped || scoped;
           }
        }
    }
</script>
