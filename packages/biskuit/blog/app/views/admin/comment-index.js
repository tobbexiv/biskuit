const CommentIndex = {
    name: 'comment',

    el: '#comments',

    data() {
        return _.merge({
            posts: [],
            searchString: this.$session.get('comments.filter', {}).search || '',
            config: {
                filter: this.$session.get('comments.filter', {})
            },
            comments: false,
            pages: 0,
            count: '',
            selected: [],
            user: window.$biskuit.user,
            replyComment: { },
            editComment: {}
        }, window.$data);
    },

    mounted() {
        this.Comments = this.$resource('api/blog/comment{/id}');
        this.load();
        UIkit.init(this.$el);
    },

    watch: {
        searchString: _.throttle(function() {
            this.$set(this.config.filter, 'search', this.searchString);
        }, 300),
        'config.page': 'load',
        'config.filter': {
            handler(filter) {
                if (this.config.page) {
                    this.config.page = 0;
                } else {
                    this.load();
                }
                this.$session.set('comments.filter', filter);
            },
            deep: true
        }
    },

    computed: {
        statusOptions() {
            const options = _.map(this.$data.statuses, (status, id) => {
                return { text: status, value: id };
            });
            return [{ label: this.$trans('Filter by'), options: options }];
        }
    },

    methods: {
        getPost(postId) {
            return _.filter(this.posts, ['id', postId])
        },

        active(comment) {
            return this.selected.indexOf(comment.id) != -1;
        },

        submit() {
            this.save(this.editComment.id ? this.editComment : this.replyComment);
        },

        save(comment) {
            return this.Comments.save({id: comment.id}, {comment: comment}).then(function () {
                this.load();
                this.$notify('Comment saved.');
            }, function (res) {
                this.$notify(res.data, 'danger');
            });
        },

        status(status) {
            let comments = this.getSelected();
            comments.forEach(function (comment) {
                comment.status = status;
            });
            this.Comments.save({id: 'bulk'}, {comments: comments}).then(function () {
                this.load();
                this.$notify('Comments saved.');
            });
        },

        remove() {
            this.Comments.delete({id: 'bulk'}, {ids: this.selected}).then(function () {
                this.load();
                this.$notify('Comments deleted.');
            });
        },

        load() {
            this.cancel();

            this.Comments.query({filter: this.config.filter, post: this.config.post && this.config.post.id || 0, page: this.config.page, limit: this.config.limit}).then(function (res) {
                const { data } = res;

                this.posts = data.posts;
                this.comments = _.orderBy(data.comments, 'created', 'desc');
                this.pages = data.pages;
                this.count = data.count;
                this.selected = [];
            });
        },

        getSelected() {
            const vm = this;
            return this.comments.filter((comment) => {
                return vm.selected.indexOf(comment.id) !== -1;
            });
        },

        getStatusText(comment) {
            return this.statuses[comment.status];
        },

        cancel() {
            this.replyComment = {};
            this.editComment = {};
        },

        reply(comment) {
            this.cancel();
            this.replyComment = { parent_id: comment.id, post_id: comment.post_id, author: this.user.name, email: this.user.email };
        },

        edit(comment) {
            this.cancel();
            this.editComment = _.merge({}, comment);
        },

        toggleStatus(comment) {
            comment.status = comment.status === 1 ? 0 : 1;
            this.save(comment);
        }
    }
};

Vue.ready(CommentIndex);
