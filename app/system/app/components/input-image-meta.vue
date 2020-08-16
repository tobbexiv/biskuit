<template>
    <div>
        <a class="uk-placeholder uk-text-center uk-display-block uk-margin-remove" v-if="!image.src" @click.prevent="pick">
            <img width="60" height="60" :alt="$trans('Placeholder Image')" :src="$url('app/system/assets/images/placeholder-image.svg')">
            <p class="uk-text-muted uk-margin-small-top">{{ 'Add Image' | trans }}</p>
        </a>

        <div :class="'uk-overlay uk-overlay-hover uk-visible-hover ' + cls" v-else>
            <img :src="$url(image.src)">
            <div class="uk-overlay-panel uk-overlay-background uk-overlay-fade"></div>
            <a class="uk-position-cover" @click.prevent="pick"></a>
            <div class="uk-panel-badge pk-panel-badge uk-hidden">
                <ul class="uk-subnav pk-subnav-icon">
                    <li>
                        <a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove"></a>
                    </li>
                </ul>
            </div>
        </div>

        <v-modal ref="modal">
            <form class="uk-form uk-form-stacked" @submit="update">
                <div class="uk-modal-header">
                    <h2>{{ 'Image' | trans }}</h2>
                </div>

                <div class="uk-margin">
                    <input-image v-model="img.src"></input-image>
                </div>

                <div class="uk-margin">
                    <label for="form-src" class="uk-form-label">{{ 'URL' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-src" class="uk-width-1-1" type="text" v-model.lazy="img.src">
                    </div>
                </div>

                <div class="uk-margin">
                    <label for="form-alt" class="uk-form-label">{{ 'Alt' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-alt" class="uk-width-1-1" type="text" v-model="img.alt">
                    </div>
                </div>

                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                    <button class="uk-button uk-button-link" type="button" @click.prevent="update">{{ 'Update' | trans }}</button>
                </div>
            </form>
        </v-modal>
    </div>
</template>

<script>
    const InputImageMeta = {
        props: {
            cls: {
                type: String,
                default: ''
            },
            value: Object
        },

        data() {
            return _.merge({
                image: this.value,
                img: {}
            }, $biskuit);
        },

        created() {
            this.image = this.image || {src: '', alt: ''};
            this.img = _.extend({}, this.image);
        },

        methods: {
            pick() {
                this.img.src = this.image.src;
                this.img.alt = this.image.alt;
                this.$refs.modal.open();
            },

            update() {
                this.image.src = this.img.src;
                this.image.alt = this.img.alt;
                this.$refs.modal.close();
            },

            remove() {
                this.img.src = '';
                this.image.src = '';
            },

            updateAlt(event, params) {
                const path = params.source;
                if(path && !this.img.alt) {
                    const alt = path.split('/').slice(-1)[0].replace(/\.(jpeg|jpg|png|svg|gif)$/i, '').replace(/(_|-)/g, ' ').trim();
                    const first = alt.charAt(0).toUpperCase();
                    this.img.alt = first + alt.substr(1);
                }
            }
        },

        watch: {
            value(newImage) {
                this.image = newImage;
            },

            image(newImage) {
                this.$emit('input', newImage);
            }
        },

        events: {
            'input-image:selected': 'updateAlt',
        }
    };

    export default InputImageMeta;

    Vue.component('input-image-meta', (resolve, reject) => {
        Vue.asset({
            js: [
                'app/assets/uikit/js/components/upload.min.js',
                'app/system/modules/finder/app/bundle/panel-finder.js'
            ]
        }).then(function () {
            resolve(InputImageMeta);
        })
    });
</script>
