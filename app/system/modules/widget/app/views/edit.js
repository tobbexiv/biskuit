const EditWidget = {
    el: '#widget-edit',

    mixins: [window.Widgets],

    data() {
        return _.merge({
            sections: [],
            active: 0
        }, window.$data);
    },

    created() {
        const type = _.kebabCase(this.widget.type);
        let sections = [];
        let active;

        _.forIn(this.getComponents(), (component, name) => {
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
        const tab = UIkit.tab(this.$refs.tab, {connect: this.$refs.content});
        const vm = this;
        tab.on('change.uk.tab', (tab, current) => {
            vm.active = current.index();
        });
        this.$watch('active', (active) => {
            tab.switcher.show(active);
        });
        this.$state('active');

        // set position from get param
        if (!this.widget.id) {
            var match = new RegExp('[?&]position=([^&]*)').exec(location.search);
            this.widget.position = (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || '';
        }
    },

    methods: {
        getComponents() {
            return this.$options.mixins[0].components;
        },

        save() {
            this.$trigger('widget:save', { widget: this.widget });
            this.$resource('api/site/widget{/id}').save({id: this.widget.id}, {widget: this.widget}).then(function (res) {
                const { data } = res;
                this.$trigger('widget:saved', { id: this.widget.id });
                if (!this.widget.id) {
                    window.history.replaceState({}, '', this.$url.route('admin/site/widget/edit', { id: data.widget.id }));
                }
                this.widget = data.widget;
                this.$notify('Widget saved.');
            }, function (res) {
                this.$notify(res.data, 'danger');
            });
        },

        cancel() {
            this.$trigger('widget:cancel');
        }
    }
};

Vue.ready(EditWidget);
