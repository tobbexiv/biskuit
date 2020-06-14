<template>
    <div>
        <a class="uk-placeholder uk-text-center uk-display-block uk-margin-remove" v-if="!source" @click.prevent="pick">
            <img width="60" height="60" :alt="$trans('Placeholder Image')" :src="$url('app/system/assets/images/placeholder-image.svg')">
            <p class="uk-text-muted uk-margin-small-top">{{ 'Select Image' | trans }}</p>
        </a>

        <div :class="'uk-overlay uk-overlay-hover uk-visible-hover ' + cls" v-else>
            <img :src="source.indexOf('blob:') !== 0  ? $url(source) : source">
            <div class="uk-overlay-panel uk-overlay-background uk-overlay-fade"></div>
            <a class="uk-position-cover" @click.prevent="pick"></a>

            <div class="uk-panel-badge pk-panel-badge uk-hidden">
                <ul class="uk-subnav pk-subnav-icon">
                    <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove"></a></li>
                </ul>
            </div>

        </div>

        <v-modal ref="modal" large>
            <panel-finder :root="storage" :modal="true"></panel-finder>

            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                <button class="uk-button uk-button-primary" type="button" :disabled="lastSelection == ''" @click.prevent="select">{{ 'Select' | trans }}</button>
            </div>
        </v-modal>
    </div>
</template>

<script>
    const InputImage = {
        props: {
            cls: {default: ''},
            value: {default: ''}
        },

        data() {
            return _.merge({
                source: this.value,
                lastSelection: '',
            }, $biskuit);
        },

        watch: {
            value(src) {
                this.source = src;
            },
            source(src) {
                this.$emit('input', src);
            }
        },

        methods: {
            pick() {
                this.$refs.modal.open();
            },

            select() {
                this.source = this.lastSelection;
                this.lastSelection = '';
                this.$trigger('input-image:selected', { source: this.source });
                this.$refs.modal.close();
            },

            remove() {
                this.source = '';
            },

            updateSelected(event, params) {
                this.lastSelection = params.selected ? params.selected[0] : '';
            }
        },

        events: {
            'finder:selected': 'updateSelected',
        }
    };

    export default InputImage;

    Vue.component('input-image', (resolve, reject) => {
        Vue.asset({
            js: [
                'app/assets/uikit/js/components/upload.min.js',
                'app/system/modules/finder/app/bundle/panel-finder.js'
            ]
        }).then(function () {
            resolve(InputImage);
        })
    });
</script>
