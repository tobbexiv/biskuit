<template>
    <div>
        <a class="uk-placeholder uk-text-center uk-display-block uk-margin-remove" v-if="!source" @click.prevent="pick">
            <img width="60" height="60" :alt="$trans('Placeholder Image')" :src="$url('app/system/assets/images/placeholder-video.svg')">
            <p class="uk-text-muted uk-margin-small-top">{{ 'Select Video' | trans }}</p>
        </a>

        <div class="uk-overlay uk-overlay-hover uk-visible-hover" v-else>
            <img :src="image" v-if="image">
            <video class="uk-width-1-1" :src="video" v-if="video"></video>
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
    const InputVideo = {
        props: ['value'],

        data() {
            return _.merge({
                image: undefined,
                video: undefined,
                source: this.value,
                lastSelection: ''
            }, $biskuit);
        },

        watch: {
            value(src) {
                this.source = src;
            },
            source: {
                handler: 'updatePreview',
                immediate: true
            }
        },

        methods: {
            pick() {
                this.$refs.modal.open();
            },

            select() {
                this.source = this.lastSelection;
                this.lastSelection = '';
                this.$emit('input', this.source);
                this.$trigger('input-video:selected', { source: this.source });
                this.$refs.modal.close();
            },

            remove() {
                this.source = '';
            },

            updateSelected(event, params) {
                this.lastSelection = params.selected ? params.selected[0] : '';
            },

            updatePreview(src) {
                let matches;

                this.image = undefined;
                this.video = undefined;

                if (matches = (src.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/))) {
                    this.image = `//img.youtube.com/vi/${matches[1]}/hqdefault.jpg`;
                } else if (src.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)) {
                    this.$http.get('http://vimeo.com/api/oembed.json', {url: src}, {cache: 10}).then((res) => {
                        const { data } = res;
                        this.image = data.thumbnail_url;
                    });
                } else {
                    this.video = this.$url(src);
                }
            }
        },

        events: {
            'finder:selected': 'updateSelected',
        }
    };

    export default InputVideo;

    Vue.component('input-video', (resolve, reject) => {
        Vue.asset({
            js: [
                //'app/assets/uikit/js/components/upload.min.js',
                'app/system/modules/finder/app/bundle/panel-finder.js'
            ]
        }).then(function () {
            resolve(InputVideo);
        })
    });
</script>
