import Settings from '../components/node-settings.vue';
import LinkSettings from '../components/node-link.vue';

window.Site = {
    el: '#site-edit',

    data() {
        return _.merge({
            sections: [],
            active: 0
        }, window.$data);
    },

    created() {
        const type = _.kebabCase(this.type.id);
        let sections = [];
        let active;

        _.forIn(this.$options.components, (component, name) => {
            if (component.section) {
                sections.push(_.extend({
                    name: name,
                    priority: 0
                }, component.section));
            }
        });

        sections = _.sortBy(sections.filter(function (section) {
            active = section.name.match('(.+)\\.(.+)');
            if (active === null) {
                return !_.find(sections, { name: type + '.' + section.name });
            }
            return active[1] == type;
        }, this), ['priority']);

        this.sections = sections;
    },

    mounted() {
        const vm = this;
        this.Nodes = this.$resource('api/site/node{/id}');
        this.tab = UIkit.tab(this.$refs.tab, {connect: this.$refs.content});
        this.tab.on('change.uk.tab', (tab, current) => {
            vm.active = current.index();
        });

        this.$watch('active', (active) => {
            this.tab.switcher.show(active);
        });

        this.$state('active');
    },

    computed: {
        path() {
            return (this.node.path ? this.node.path.split('/').slice(0, -1).join('/') : '') + '/' + (this.node.slug || '');
        }
    },

    methods: {
        save() {
            let data = { node: this.node };
            this.$trigger('node:save', data);
            this.Nodes.save({id: this.node.id}, data).then(function (res) {
                    let { data } = res;
                    if (!this.node.id) {
                        window.history.replaceState({}, '', this.$url.route('admin/site/page/edit', {id: data.node.id}));
                    }
                    this.node = data.node;
                    this.$notify(this.$trans('%type% saved.', { type: this.type.label }));
                }, function (res) {
                    this.$notify(res.data, 'danger');
                }
            );
        }
    },

    components: {
        'template-settings': {
            template: require('../templates/settings.html')
        },
        'settings': Settings,
        'link.settings': LinkSettings
    }
};

Vue.ready(window.Site);
