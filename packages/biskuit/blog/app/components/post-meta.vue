<template>
    <div class="uk-form-horizontal">
        <div class="uk-margin">
            <label for="form-meta-title" class="uk-form-label">{{ 'Title' | trans }}</label>
            <div class="uk-form-controls">
                <input id="form-meta-title" class="uk-form-width-large" type="text" v-model="post.data.meta['og:title']">
            </div>
        </div>

        <div class="uk-margin">
            <label for="form-meta-description" class="uk-form-label">{{ 'Description' | trans }}</label>
            <div class="uk-form-controls">
                <textarea id="form-meta-description" class="uk-form-width-large" rows="5" type="text" v-model="post.data.meta['og:description']"></textarea>
            </div>
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
                post: _.merge({
                    data: {
                        meta: {}
                    }
                }, this.value)
            };
        },

        watch: {
            value(newPost) {
                this.post = newPost;
            },
            post: {
                handler(newPost) {
                    this.$emit('input', newPost);
                },
                deep: true
            }
        }
    };

    export default PostMeta;

    window.Post.components['post-meta'] = PostMeta;
</script>
