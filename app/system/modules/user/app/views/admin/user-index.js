const UserIndex = {
    name: 'user-index',

    el: '#users',

    data() {
        return _.merge({
            users: false,
            searchString: this.$session.get('user.filter', {}).search || '',
            config: {
                filter: this.$session.get('user.filter', { order: 'username asc' })
            },
            pages: 0,
            count: '',
            selected: []
        }, window.$data);
    },

    created() {
        this.resource = this.$resource('api/user{/id}');
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

                this.$session.set('user.filter', filter);
            },
            deep: true
        }
    },

    computed: {
        statuses() {
            const options = [{text: this.$trans('New'), value: 'new'}].concat(_.map(this.config.statuses, (status, id) => {
                return { text: status, value: id };
            }));
            return [{ label: this.$trans('Filter by'), options }];
        },
        roles() {
            const options = this.config.roles.map((role) => {
                return { text: role.name, value: role.id };
            });
            return [{ label: this.$trans('Filter by'), options }];
        }
    },

    methods: {
        active(user) {
            return this.selected.indexOf(user.id) != -1;
        },

        save(user) {
            this.resource.save({id: user.id}, {user: user}).then(function () {
                this.load();
                this.$notify('User saved.');
            }, function (res) {
                this.load();
                this.$notify(res.data, 'danger');
            });
        },

        status(status) {
            const users = this.getSelected();

            users.forEach((user) => {
                user.status = status;
            });

            this.resource.save({id: 'bulk'}, { users }).then(function () {
                this.load();
                this.$notify('Users saved.');
            }, function (res) {
                this.load();
                this.$notify(res.data, 'danger');
            });
        },

        remove() {
            this.resource.delete({id: 'bulk'}, { ids: this.selected }).then(function () {
                this.load();
                this.$notify('Users deleted.');
            }, function (res) {
                this.load();
                this.$notify(res.data, 'danger');
            });
        },

        toggleStatus(user) {
            user.status = !!user.status ? 0 : 1;
            this.save(user);
        },

        showVerified(user) {
            return this.config.emailVerification && user.data.verified;
        },

        showRoles(user) {
            return _.reduce(user.roles, _.bind(function (roles, id) {
                const role = _.find(this.config.roles, ['id', id]);
                if (id !== 2 && role) {
                    roles.push(role.name);
                }
                return roles;
            }, this), []).join(', ');
        },

        load() {
            this.resource.query({filter: this.config.filter, page: this.config.page}).then( function (res) {
                const { data } = res;

                this.users = data.users;
                this.pages = data.pages;
                this.count = data.count;
                this.selected = [];
            }, function () {
                this.$notify('Loading failed.', 'danger');
            });
        },

        getSelected() {
            return this.users.filter(function (user) {
                return this.selected.indexOf(user.id) !== -1;
            }, this);
        }
    }
};

Vue.ready(UserIndex);
