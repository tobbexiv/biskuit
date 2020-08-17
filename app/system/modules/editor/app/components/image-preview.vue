<template>
    <div class="uk-panel uk-placeholder uk-placeholder-large uk-text-center uk-visible-toggle" v-if="!image.data.src">
        <img width="60" height="60" :alt="$trans('Placeholder Image')" :src="$url('app/system/assets/images/placeholder-image.svg')">
        <p class="uk-text-muted uk-margin-small-top">{{ 'Add Image' | trans }}</p>
        <a class="uk-position-cover" @click.prevent="config"></a>
        <div class="uk-panel-badge pk-panel-badge uk-hidden">
            <ul class="uk-subnav pk-subnav-icon">
                <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove"></a></li>
            </ul>
        </div>
    </div>

    <div class="uk-overlay uk-overlay-hover uk-visible-toggle" v-else>
        <img :src="$url(image.data.src)" :alt="image.data.alt">
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

        computed: {
            image() {
                return this.$parent.images.data[this.index] || {};
            }
        },

        methods: {
            config() {
                this.$parent.images.callback(this.image);
            },

            remove() {
                this.image.replace('');
            }
        }
    };
</script>
