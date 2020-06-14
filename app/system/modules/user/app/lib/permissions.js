export default {
    data() {
        return window.$data;
    },

    created() {
        this.Roles = this.$resource('api/user/role{/id}');
        this.debounced = [];
    },

    computed: {
        authenticated() {
            return this.roles.filter((role) => {
                return role.authenticated;
            })[0];
        }
    },

    methods: {
        savePermissions(role) {
            if (!_.find(this.debounced, ['id', role.id])) {
                this.debounced.push(role);
            }
            this.saveCb();
        },

        addPermission(role, permission) {
            return !role.administrator ? role.permissions.push(permission) : null;
        },

        hasPermission(role, permission) {
            return -1 !== role.permissions.indexOf(permission);
        },

        isInherited(role, permission) {
            return !role.locked && this.hasPermission(this.authenticated, permission);
        },

        showFakeCheckbox(role, permission) {
            return role.administrator || (this.isInherited(role, permission) && !this.hasPermission(role, permission));
        },

        saveCb: _.debounce(function() {
            this.Roles.save({ id: 'bulk' }, { roles: this.debounced }).then(function () {
                this.$notify('Permissions saved');
            });

            this.debounced = [];
        }, 1000)
    }
};
