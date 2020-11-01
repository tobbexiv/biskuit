const BlogPostIndex = {
    name: 'post',

    el: '#post',

    data() {
        return _.merge({
            posts: false,
            searchString: '',
            config: {
                filter: this.$session.get('posts.filter', { order: 'date desc', limit:25 })
            },
            pages: 0,
            count: '',
            selected: [],
            canEditAll: false
        }, window.$data);
    },

    created() {
        this.resource = this.$resource('api/blog/post{/id}');
        this.searchString = this.config.filter.search || '';
        this.load();
    },

    watch: {
        searchString: _.throttle(function() {
            this.$set(this.config.filter, 'search', this.searchString);
        }, 1000),
        'config.page': 'load',
        'config.filter': {
            handler(filter) {
                if (this.config.page) {
                    this.config.page = 0;
                } else {
                    this.load();
                }
                this.$session.set('posts.filter', filter);
            },
            deep: true
        }
    },

    computed: {
        statusOptions() {
            const options = _.map(this.statuses, function (status, id) {
                return { text: status, value: id };
            });

            return [{ label: this.$trans('Filter by'), options: options }];
        },

        authorOptions() {
            const options = _.map(this.authors, function (author) {
                return { text: author.username, value: author.user_id };
            });

            return [{ label: this.$trans('Filter by'), options: options }];
        }
    },

    methods: {
        active(post) {
            return this.selected.indexOf(post.id) != -1;
        },

        save(post) {
            this.resource.save({ id: post.id }, { post: post }).then(function () {
                this.load();
                this.$notify('Post saved.');
            });
        },

        status(status) {
            const posts = this.getSelected();
            posts.forEach((post) => {
                post.status = status;
            });
            this.resource.save({ id: 'bulk' }, { posts: posts }).then(function () {
                this.load();
                this.$notify('Post(s) saved.');
            });
        },

        remove() {
            this.resource.delete({ id: 'bulk' }, { ids: this.selected }).then(function () {
                this.load();
                this.$notify('Post(s) deleted.');
            });
        },

        toggleStatus(post) {
            post.status = post.status === 2 ? 3 : 2;
            this.save(post);
        },

        copy() {
            if (!this.selected.length) {
                return;
            }

            this.resource.save({ id: 'copy' }, { ids: this.selected }).then(function () {
                this.load();
                this.$notify('Posts copied.');
            });
        },

        load() {
            this.resource.query({ filter: this.config.filter, page: this.config.page }).then(function (res) {
                const { data } = res;
                this.posts = data.posts;
                this.pages = data.pages;
                this.count = data.count;
                this.selected = [];
            });
        },

        getSelected() {
            return this.posts.filter(function(post) {
                return this.selected.indexOf(post.id) !== -1;
            }, this);
        },

        getStatusText(post) {
            return this.statuses[post.status];
        }
    }
};

Vue.ready(BlogPostIndex);
