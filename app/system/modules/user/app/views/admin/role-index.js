import PermissionsLibrary from '../../lib/permissions';

const Roles = {
    el: '#roles',

    mixins: [
        PermissionsLibrary
    ],

    data: {
        role: {},
        config: window.$config
    },

    mounted() {
        $(this.$el).on('change.uk.sortable', this.reorder);
    },

    computed: {
        current() {
            return _.find(this.roles, ['id', this.config.role]) || this.roles[0];
        },

        orderedRoles() {
            return _.orderBy(this.roles, 'priority');
        }
    },

    methods: {
        edit(role) {
            this.role = $.extend({}, role || {});
            this.$refs.modal.open();
        },

        save() {
            if (!this.role) {
                return;
            }

            this.Roles.save({ id: this.role.id }, { role: this.role }).then(function (res) {
                const { data } = res;

                if (this.role.id) {
                    const role = _.findIndex(this.roles, ['id', this.role.id]);
                    this.roles.splice(role, 1, data.role);

                    this.$notify('Role saved');
                } else {
                    this.roles.push(data.role);
                    this.$notify('Role added');
                }

            }, function (res) {
                this.$notify(res.data, 'danger');
            });

            this.$refs.modal.close();
        },

        remove(role) {
            this.Roles.remove({ id: role.id }).then(function () {
                this.roles.splice(_.findIndex(this.roles, { id: role.id }), 1);
            });
        },

        reorder(e, sortable) {
            const vm = this;
            if (!sortable) {
                return;
            }

            sortable.element.children().each((index, element) => {
                vm.roles[_.findIndex(vm.roles, { id: parseInt(element.id) })].priority = index;
            });

            this.Roles.save({ id: 'bulk' }, { roles: this.roles }).then(function () {
                this.$notify('Roles reordered.');
            }, function (data) {
                this.$notify(data, 'danger');
            });
        }
    }
};

Vue.ready(Roles);
