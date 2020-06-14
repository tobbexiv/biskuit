import PostSettings from '../../components/post-settings.vue';

window.Post = {
    el: '#post',

    data() {
        return {
            data: window.$data,
            post: window.$data.post,
            sections: []
        }
    },

    created() {
        let sections = [];
        _.forIn(this.$options.components, (component, name) => {
            if (component.section) {
                sections.push(_.extend({
                    name: name,
                    priority: 0
                }, component.section));
            }
        });
        this.sections = _.sortBy(sections, ['priority']);

        this.resource = this.$resource('api/blog/post{/id}');
    },

    mounted() {
        this.tab = UIkit.tab(this.$refs.tab, {connect: this.$refs.content});
    },

    methods: {
        save() {
            let data = {
                post: this.post,
                id: this.post.id
            };
            this.$trigger('post:save', data);
            this.resource.save({ id: this.post.id }, data).then(function (res) {
                const { data } = res;
                if (!this.post.id) {
                    window.history.replaceState({}, '', this.$url.route('admin/blog/post/edit', { id: data.post.id }))
                }
                this.post = data.post;
                this.$notify('Post saved.');
            }, function (res) {
                this.$notify(res.data, 'danger');
            });
        }
    },

    components: {
        settings: PostSettings
    }
};

Vue.ready(window.Post);
