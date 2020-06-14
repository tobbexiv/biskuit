<template>
    <div class="uk-form-row">
        <label for="form-link-blog" class="uk-form-label">{{ 'View' | trans }}</label>
        <div class="uk-form-controls">
            <select id="form-link-blog" class="uk-width-1-1" v-model="innerLink">
                <option value="@blog">{{ 'Posts View' | trans }}</option>
                <optgroup :label="$trans('Posts')">
                    <option v-for="p in posts" :value="link(p)" :key="p.id">{{ p.title }}</option>
                </optgroup>
            </select>
        </div>
    </div>
</template>

<script>
    const LinkBlog = {
        link: {
            label: 'Blog'
        },

        data() {
            return {
                innerLink: '',
                posts: []
            }
        },

        created() {
            // TODO: Implement pagination or search
            this.$http.get('api/blog/post', { params: { filter: { limit: 1000 } } }).then(function (res) {
                this.posts = res.data.posts;
            });
        },

        mounted() {
            this.innerLink = '@blog';
        },

        methods: {
            link(post) {
                return '@blog/id?id='+post.id;
            }
        },

        watch: {
            innerLink(link) {
                this.$emit('input', link);
            }
        }
    };

    export default LinkBlog;

    window.Links.default.components['link-blog'] = LinkBlog;
</script>
