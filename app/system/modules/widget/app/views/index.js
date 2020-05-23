const WidgetIndex = {
    el: '#widgets',

    mixins: [window.Widgets],

    data() {
        return _.merge({
            position: this.$session.get('widget.position'),
            searchString: this.$session.get('widget.filter', {}).search || '',
            selected: [],
            config: {
                positions: [],
                filter: this.$session.get('widget.filter', {})
            },
            unassignedWidgets: [],
            type: {}
        }, window.$data)
    },

    mounted() {
        this.load();
    },

    computed: {
        positions() {
            return this.config.positions.concat(this.unassigned);
        },

        unassigned() {
            return { name: '_unassigned', label: this.$trans('Unassigned'), assigned: _.map(this.unassignedWidgets, 'id'), widgets: this.unassignedWidgets };
        },

        empty() {
            return !this.position && !this.get('assigned').length;
        },

        nodes() {
            const nodes = _(this.config.nodes).groupBy('menu').value();
            let options = [];
            _.forEach(this.config.menus, (menu, name) => {
                const opts = nodes[name];

                if (!opts) {
                    return;
                }

                options.push({
                    label: menu.label,
                    options: _.map(opts, (node) => {
                        return { text: node.title, value: node.id };
                    })
                });
            });
            return options;
        }
    },

    methods: {
        get(filter) {
            const filters = {
                selected(widget) {
                    return this.selected.indexOf(widget.id) !== -1;
                },

                assigned(widget) {
                    return this.positions.some((position) => {
                        return position.assigned.indexOf(widget.id) !== -1;
                    });
                },

                unassigned(widget) {
                    return !this.positions.some((position) => {
                        return position.assigned.indexOf(widget.id) !== -1;
                    });
                }
            };

            return filters[filter] ? this.widgets.filter(filters[filter], this) : this.widgets;
        },

        load() {
            return this.resource.query().then(function (res) {
                this.config.positions = res.data.positions;
                this.unassignedWidgets = res.data.unassigned;
            });
        },

        active(position) {
            return this.position === position || (position && this.position && this.position.name == position.name);
        },

        select(position) {
            if (position) {
                this.selected = [];
            }

            this.position = position;
            if (position) {
                this.$session.set('widget.position', position);
            } else {
                this.$session.remove('widget.position');
            }
        },

        assign(position, ids) {
            return this.resource.save({id: 'assign'}, {position: position, ids: ids}).then(function () {
                this.load();
                this.selected = [];
            });
        },

        move(position, ids) {
            position = _.find(this.positions, ['name', position]);

            this.assign(position.name, position.assigned.concat(ids)).then(function () {
                this.$notify(this.$transChoice('{1} %count% Widget moved|]1,Inf[ %count% Widgets moved', ids.length, {count: ids.length}));
            });
        },

        copy() {
            this.resource.save({ id: 'copy' }, { ids: this.selected }).then(function (res) {
                this.load().then();
                this.selected = [];
                this.$notify('Widget(s) copied.');
            });
        },

        remove() {
            this.resource.delete({ id: 'bulk' }, { ids: this.selected }).then(function () {
                this.load();
                this.$notify('Widget(s) removed.');
                this.selected = [];
            });
        },

        status(status) {
            const widgets = this.get('selected');

            widgets.forEach((widget) => {
                widget.status = status;
            });

            this.resource.save({ id: 'bulk' }, { widgets: widgets }).then(function () {
                this.load();
                this.selected = [];
                this.$notify('Widget(s) saved.');
            });
        },

        toggleStatus(widget) {
            widget.status = widget.status ? 0 : 1;

            this.resource.save({ id: widget.id }, { widget: widget }).then(function () {
                this.load();
                this.$notify('Widget saved.');
            });
        },

        infilter(widget) {
            if (this.config.filter.search) {
                return widget.title.toLowerCase().indexOf(this.config.filter.search.toLowerCase()) != -1;
            }

            if (this.config.filter.node && widget.nodes.length) {
                return widget.nodes.some((node) => {
                    return node === this.config.filter.node;
                }, this);
            }

            return true;
        },

        emptyafterfilter(widgets) {
            widgets = widgets || this.config.positions.reduce((result, position) => {
                return result.concat(position.widgets);
            }, []);

            return !widgets.some((widget) => {
                return this.infilter(widget);
            }, this);
        },

        getPageFilter(widget) {
            if (!widget.nodes.length) {
                return this.$trans('All');
            } else if (widget.nodes.length > 1) {
                return this.$trans('Selected');
            } else {
                return (_.find(this.config.nodes, ['id', widget.nodes[0]]) || {}).title;
            }
        },

        isSelected(id) {
            return this.selected.indexOf(id) !== -1;
        },

        show(position) {
            if (!this.position) {
                return position.name != '_unassigned' ? position.widgets.length : 0;
            }
            return this.active(position);
        },

        getType(widget) {
            const type = _.find(this.types, {name: widget.type});
            if (!type) {
                return undefined;
            }
            return type.label || type.name;
        },
    },

    watch: {
        searchString: _.throttle(function() {
            this.$set(this.config.filter, 'search', this.searchString);
        }, 300),
        'config.filter': {
            handler(filter) {
                this.$session.set('widget.filter', filter);
            },
            deep: true
        }
    },

    filters: {
        assigned(ids) {
            return ids.map(function (id) {
                return _.find(this.widgets, ['id', id]);
            }, this).filter(function (widget) {
                return widget !== undefined;
            });
        }
    },

    directives: {
        sortable: {
            bind(el, binding, vnode) {
                var vm = vnode.context;

                // disable sorting on unassigned position
                if(el.getAttribute('data-position') == '_unassigned') {
                    return;
                }

                Vue.nextTick(function () {
                    UIkit.sortable(el, { group: 'position', removeWhitespace: false })
                        .element.off('change.uk.sortable')
                        .on('change.uk.sortable', function (e, sortable, element, action) {
                            if (action == 'added' || action == 'moved') {
                                Vue.nextTick(function() {
                                    vm.assign(sortable.element.context.getAttribute('data-position'), _.map(sortable.serialize(), 'id'));
                                });
                            }
                        });
                });
            }
        }
    }
};

Vue.ready(WidgetIndex);
