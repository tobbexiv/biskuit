const BlogComments = {
    el: '#comments',

    data() {
        return _.extend({
            post: {},
            tree: {},
            comments: [],
            messages: [],
            count: 0,
            replyForm: false
        }, window.$comments);
    },

    created() {
        this.load();
    },

    methods: {
        load() {
            return this.$http.get('api/blog/comment{/id}', { params: { post: this.config.post } }).then(function (res) {
                var { data } = res;

                this.comments = data.comments;
                this.tree = this.getTree(data.comments);
                this.post = data.posts[0];
                this.count = data.count;

                Vue.nextTick(() => {
                    if(window.location.hash) {
                        const anchor = document.querySelector(window.location.hash);
                        UIkit.scroll().scrollTo(anchor);
                    }
                });
                this.reply();
            });
        },

        getTree(comments) {
            const flattenRecursive = (groupedTree, parentNode) => {
                let nodes = [ parentNode ];
                if(groupedTree[parentNode.id]) {
                    groupedTree[parentNode.id].forEach(node => {
                        nodes = nodes.concat(flattenRecursive(groupedTree, node));
                    });
                }
                return nodes;
            };
            const resolveTreeRecursive = (groupedTree, parentId, depth) => {
                let tree = {};
                if(groupedTree[parentId]) {
                    if(depth < this.config.max_depth) {
                        tree[parentId] = groupedTree[parentId];
                        groupedTree[parentId].forEach(node => {
                            tree = _.merge(tree, resolveTreeRecursive(groupedTree, node.id, depth + 1));
                        });
                    } else {
                        tree[parentId] = _.tail(flattenRecursive(groupedTree, { id: parentId }));
                    }
                }
                return tree;
            };
            return resolveTreeRecursive(_.groupBy(comments, 'parent_id'), '0', 1);
        },

        reply(parent) {
            parent = parent || this;
            if (this.replyForm) {
                this.replyForm.$parent.$refs.reply.removeChild(this.replyForm.$el);
                this.replyForm.$destroy(true);
            }

            const Reply = Vue.extend(this.$options.components['reply'])
            this.replyForm = new Reply({
                data: {
                    config: this.config,
                    parent: parent.comment && parent.comment.id || 0
                },
                parent: parent
            }).$mount();
            parent.$refs.reply.appendChild(this.replyForm.$el);
        }
    },

    components: {
        comment: {
            name: 'Comment',
            props: ['comment', 'tree'],
            template: '#comments-item',

            data() {
                return {
                    config: this.$root.config
                };
            },

            computed: {
                depth() {
                    let depth = 1;
                    let parent = this.$parent;

                    while(parent) {
                        if (parent.$options.name === 'Comment') {
                            depth++;
                        }
                        parent = parent.$parent;
                    }
                    return depth;
                },

                showReplyButton() {
                    return this.config.enabled && this.depth < this.config.max_depth && this.$root.replyForm.$parent !== this;
                },

                permalink() {
                    return '#comment-' + this.comment.id;
                }

            },

            methods: {
                replyTo() {
                    this.$root.reply(this);
                },

                setHash() {
                    window.location.hash = this.permalink;
                },
            }
        },

        reply: {
            template: '#comments-reply',

            data() {
                return {
                    author: '',
                    email: '',
                    content: '',
                    error: false,
                };
            },

            computed: {
                user() {
                    return this.config.user;
                },

                login() {
                    return this.$url('user/login', { redirect: window.location.href });
                }
            },

            methods: {
                save() {
                    let comment = {
                        parent_id: this.parent,
                        post_id: this.config.post,
                        content: this.content
                    };

                    if (!this.user.isAuthenticated) {
                        comment.author = this.author;
                        comment.email = this.email;
                    }

                    this.error = false;
                    this.$resource('api/blog/comment{/id}').save({ id: 0 }, { comment: comment }).then(function (res) {
                        const { data } = res;
                        if (!this.user.skipApproval) {
                            this.$root.messages.push(this.$trans('Thank you! Your comment needs approval before showing up.'));
                        } else {
                            this.$root.load().then(() => {
                                window.location.hash = 'comment-' + data.comment.id;
                            });
                        }
                        this.cancel()
                    }, function (res) {
                        this.error = res.data;
                    });
                },

                cancel() {
                    this.$root.reply();
                }
            }
        }
    }
};

Vue.ready(BlogComments);
