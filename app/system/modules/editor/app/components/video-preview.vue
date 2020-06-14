<template>
    <div class="uk-panel uk-placeholder uk-placeholder-large uk-text-center uk-visible-hover" v-if="!video.data.src">
        <img width="60" height="60" :alt="$trans('Placeholder Video')" :src="$url('app/system/assets/images/placeholder-video.svg')">
        <p class="uk-text-muted uk-margin-small-top">{{ 'Add Video' | trans }}</p>
        <a class="uk-position-cover" @click.prevent="config"></a>
        <div class="uk-panel-badge pk-panel-badge uk-hidden">
            <ul class="uk-subnav pk-subnav-icon">
                <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove"></a></li>
            </ul>
        </div>
    </div>

    <div class="uk-overlay uk-overlay-hover uk-visible-hover" v-else>
        <img :src="imageSrc" v-if="imageSrc">
        <video class="uk-responsive-width" :src="videoSrc" :width="width" :height="height" v-if="videoSrc"></video>
        <div class="uk-overlay-panel uk-overlay-background uk-overlay-fade"></div>
        <a class="uk-position-cover" @click.prevent="config"></a>
        <div class="uk-panel-badge pk-panel-badge uk-hidden">
            <ul class="uk-subnav pk-subnav-icon">
                <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove"></a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['index'],

        data() {
            return {
                imageSrc: false,
                videoSrc: false,
                width: '',
                height: ''
            };
        },

        watch: {
            'video.data': {
                handler: 'update',
                immediate: true,
                deep: true
            }
        },

        computed: {
            video() {
                return this.$parent.videos.data[this.index] || {};
            }
        },

        methods: {
            config() {
                this.$parent.videos.callback(this.video);
            },

            remove() {
                this.video.replace('');
            },

            update(data) {
                let matches;
                this.imageSrc = false;
                this.videoSrc = false;
                this.width = data.width || 690;
                this.height = data.height || 390;

                const src = data.src === true ? '' : ( data.src || '' );
                if (matches = (src.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/))) {
                    this.imageSrc = '//img.youtube.com/vi/' + matches[1] + '/hqdefault.jpg';
                } else if (src.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)) {
                    this.$http.get('http://vimeo.com/api/oembed.json', { url: src }, { cache: 10 }).then(function (res) {
                        this.imageSrc = res.data.thumbnail_url;
                    });
                } else {
                    this.videoSrc = this.$url(src);
                }
            }
        }
    };
</script>
