<template>
    <div>
        <a class="uk-placeholder uk-text-center uk-display-block uk-margin-remove" v-if="!source" @click.prevent="pick">
            <img width="60" height="60" :alt="$trans('Placeholder Image')" :src="$url('app/system/assets/images/placeholder-image.svg')">
            <p class="uk-text-muted uk-margin-small-top">{{ 'Select Image' | trans }}</p>
        </a>

        <div :class="'uk-inline uk-overlay uk-visible-toggle ' + cls" v-else>
            <img :src="source.indexOf('blob:') !== 0  ? $url(source) : source">

            <div class="uk-overlay-default  uk-invisible-hover uk-position-cover">
                <a class="uk-position-cover" :title="$trans('Select')" uk-tooltip="delay: 500" @click.prevent="pick"></a>
                <div class="uk-position-center">
                    <a class="uk-icon-link" uk-icon="icon: trash; ratio: 2" :title="$trans('Delete')" uk-tooltip="delay: 500" @click.prevent="remove"></a>
                </div>
            </div>
        </div>

        <v-modal ref="modal" large>
            <panel-finder :root="storage" :modal="true"></panel-finder>

            <template #footer>
                <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                <button class="uk-button uk-button-primary" @click.prevent="select" :disabled="lastSelection == ''">{{ 'Select' | trans }}</button>
            </template>
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
                this.lastSelection = params.selected && params.selected.length ? params.selected[0] : '';
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
                'app/system/modules/finder/app/bundle/panel-finder.js'
            ]
        }).then(function () {
            resolve(InputImage);
        })
    });
</script>
