const SiteIndex = {
    el: '#site',

    data() {
        return _.merge({
            edit: undefined,
            menu: this.$session.get('site.menu', {}),
            menus: [],
            nodes: [],
            tree: false,
            selected: []
        }, window.$data);
    },

    created() {
        this.Menus = this.$resource('api/site/menu{/id}');
        this.Nodes = this.$resource('api/site/node{/id}');

        const vm = this;
        this.load().then(() => {
            vm.menu = _.find(vm.menus, ['id', vm.menu.id]) || vm.menus[0];
        });
    },

    mounted() {
        const vm = this;
        // TODO: Check whether https://github.com/unite-cms/uikit3-nestable can be used to replace if switching to UIkit3
        // Known issue: Child item is not displayed if it is the first child moved to a parent node.
        // Workaround: select another menu. Needs to be solved if still existing after switch to Uikit3.
        UIkit.nestable(this.$refs.nestable, {
            maxDepth: 20,
            group: 'site.nodes'
        }).on('change.uk.nestable', (e, nestable, el, type) => {
            if (type && type !== 'removed') {
                vm.Nodes.save({id: 'updateOrder'}, {
                    menu: vm.menu.id,
                    nodes: nestable.list()
                }).then(vm.load, () => {
                    vm.$notify('Reorder failed.', 'danger');
                });
            }
        });
    },

    methods: {
        load() {
            const vm = this;
            return Vue.Promise.all([
                this.Menus.query(),
                this.Nodes.query()
            ]).then((responses) => {
                vm.menus = responses[0].data;
                vm.nodes = responses[1].data;
                vm.selected = [];

                if (!_.find(vm.menus, ['id', vm.menu.id])) {
                    vm.menu = vm.menus[0];
                }
            }, () => {
                vm.$notify('Loading failed.', 'danger');
            });
        },

        isActive(menu) {
            return this.menu && this.menu.id === menu.id;
        },

        selectMenu(menu) {
            this.selected = [];
            this.menu = menu;
            this.$session.set('site.menu', menu);
        },

        removeMenu(menu) {
            this.Menus.delete({id: menu.id}).finally(this.load);
        },

        editMenu(menu) {
            if (!menu) {
                menu = {
                    id: '',
                    label: ''
                };
            }
            menu.label = menu.label.trim();
            this.edit = _.merge({positions: []}, menu);
            this.$refs.modal.open();
        },

        saveMenu(menu) {
            menu.label = menu.label.trim();
            this.Menus.save({menu: menu}).then(this.load, function(res) {
                this.$notify(res.data, 'danger');
            });
            this.cancel();
        },

        getMenu(position) {
            return _.find(this.menus, (menu) => {
                return _.includes(menu.positions, position);
            });
        },

        cancel() {
            this.$refs.modal.close();
        },

        status(status) {
            const nodes = this.getSelected();
            nodes.forEach((node) => {
                node.status = status;
            });
            this.Nodes.save({id: 'bulk'}, {nodes: nodes}).then(function () {
                this.load();
                this.$notify('Page(s) saved.');
            });
        },

        moveNodes(menu) {
            const nodes = this.getSelected();
            nodes.forEach((node) => {
                node.menu = menu;
            });
            this.Nodes.save({id: 'bulk'}, {nodes: nodes}).then(function () {
                this.load();
                this.$notify(this.$trans('Pages moved to %menu%.', {
                    menu: _.find(this.menus.concat({
                        id: 'trash',
                        label: this.$trans('Trash')
                    }), ['id', menu]).label
                }));
            });
        },

        removeNodes() {
            if (this.menu.id !== 'trash') {
                const nodes = this.getSelected();
                nodes.forEach((node) => {
                    node.status = 0;
                });
                this.moveNodes('trash');
            } else {
                this.Nodes.delete({id: 'bulk'}, {ids: this.selected}).then(function () {
                    this.load();
                    this.$notify('Page(s) deleted.');
                });
            }
        },

        getType(node) {
            return _.find(this.types, ['id', node.type]);
        },

        getSelected() {
            return this.nodes.filter(function (node) {
                return this.isSelected(node);
            }, this);
        },

        isSelected(node, children) {
            if (_.isArray(node)) {
                return _.every(node, _.bind(function (node) {
                    return this.isSelected(node, children);
                }, this));
            }
            return this.selected.indexOf(node.id) !== -1 && (!children || !this.tree[node.id] || this.isSelected(this.tree[node.id], true));
        },

        toggleSelect(node) {
            const index = this.selected.indexOf(node.id);
            if (index == -1) {
                this.selected.push(node.id);
            } else {
                this.selected.splice(index, 1);
            }
        },

        rebuildTree() {
            this.tree = _(this.nodes).filter({menu: this.menu.id}).sortBy('priority').groupBy('parent_id').value();
        }
    },

    computed: {
        showDelete() {
            return this.showMove && _.every(this.getSelected(), _.bind(function (node) {
                    return !(this.getType(node) || {})['protected'];
                }, this));
        },

        showMove() {
            return this.isSelected(this.getSelected(), true);
        },

        unprotectedTypes() {
            return _.orderBy(_.reject(this.types, ['protected', true]), 'label');
        },

        menusWithoutTrash() {
            return _.reject(this.menus, ['id', 'trash']);
        },

        menusWithDivider() {
            return _.reject(this.menus, ['fixed', true]).concat({divider: true}, _.filter(this.menus, ['fixed', true]))
        }
    },

    watch: {
        'menu': {
            handler: 'rebuildTree',
            deep: true
        },
        'nodes': {
            handler: 'rebuildTree',
            deep: true
        }
    },

    filters: {
        label(id) {
            return _.result(_.find(this.menus, ['id', id]), 'label');
        },
    },

    components: {
        node: {
            name: 'node',
            props: ['node', 'tree', 'value'],
            template: '#node',

            data() {
                return {
                    selected: this.value
                };
            },

            watch: {
                value(val) {
                    this.selected = val;
                },
                selected(val) {
                    this.$emit('input', val);
                }
            },

            computed: {
                isFrontpage() {
                    return this.node.url === '/';
                },

                type() {
                    return this.$root.getType(this.node) || {};
                }
            },

            methods: {
                setFrontpage() {
                    this.$root.Nodes.save({id: 'frontpage'}, {id: this.node.id}).then(function () {
                        this.$root.load();
                        this.$notify('Frontpage updated.');
                    });
                },

                toggleStatus() {
                    this.node.status = this.node.status === 1 ? 0 : 1;
                    this.$root.Nodes.save({id: this.node.id}, {node: this.node}).then(function () {
                        this.$root.load();
                        this.$notify('Page saved.');
                    });
                }
            }
        }
    }
};

Vue.ready(SiteIndex);
