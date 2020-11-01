<template>
    <div class="uk-form-horizontal">
        <div class="uk-margin">
            <label for="form-meta-title" class="uk-form-label">{{ 'Title' | trans }}</label>
            <input id="form-meta-title" class="uk-form-width-large uk-input" type="text" v-model="meta['og:title']">
        </div>

        <div class="uk-margin">
            <label for="form-meta-description" class="uk-form-label">{{ 'Description' | trans }}</label>
            <textarea id="form-meta-description" class="uk-form-width-large uk-textarea" rows="5" type="text" v-model="meta['og:description']"></textarea>
        </div>
    </div>
</template>

<script>
    const PostMeta = {
        section: {
            label: 'Meta',
            priority: 100
        },

        props: ['value'],

        data() {
            return {
                meta: this.value.data.meta || {},
                post: this.value
            };
        },

        watch: {
            value(newPost) {
                this.post = newPost;
                if(this.meta != this.post.data.meta) {
                    this.meta = this.post.data.meta || {};
                }
            },
            meta(newMeta) {
                this.post.data.meta = this.meta;
                this.$emit('input', this.post);
            }
        }
    };

    export default PostMeta;

    window.Post.components['post-meta'] = PostMeta;
</script>
