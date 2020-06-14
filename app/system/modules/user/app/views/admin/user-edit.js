import UserSettings from '../../components/user-settings.vue';

window.User = {
    el: '#user-edit',

    data() {
        return _.extend({
            sections: []
        }, window.$data);
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
    },

    mounted() {
        this.tab = UIkit.tab(this.$refs.tab, { connect: this.$refs.content });
    },

    methods: {
        save() {
            const data = { user: this.user };
            this.$trigger('user:save', data);
            this.$resource('api/user{/id}').save({ id: this.user.id }, data).then(function (res) {
                    if (!this.user.id) {
                        window.history.replaceState({}, '', this.$url.route('admin/user/edit', { id: res.data.user.id }))
                    }
                    this.user = res.data.user;
                    this.$notify('User saved.');
                }, function (res) {
                    this.$notify(res.data, 'danger');
                }
            );
        }
    },

    components: {
        settings: UserSettings
    }
};

Vue.ready(window.User);
