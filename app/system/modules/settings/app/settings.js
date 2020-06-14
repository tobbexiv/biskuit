import Locale from './components/locale.vue';
import System from './components/system.vue';

window.Settings = {

    el: '#settings',

    data() {
        return window.$settings;
    },

    mounted() {
        UIkit.tab(this.$refs.tab, { connect: this.$refs.content });
    },

    computed: {
        sections() {
            const sections = [];
            _.forIn(this.$options.components, (component, name) => {
                const { section } = component;
                if (section) {
                    section.name = name;
                    sections.push(section);
                }
            });
            return _.orderBy(sections, 'priority');
        }
    },

    methods: {
        save() {
            this.$trigger('save:settings', this.$data);
            this.$resource('admin/system/settings/save').save({ config: this.config, options: this.options }).then(function () {
                this.$notify('Settings saved.');
            }, function (res) {
                this.$notify(res.data, 'danger');
            });
        },

        getBackendName(frontendName) {
            return frontendName.replace('-', '/');
        }
    },

    components: {
        locale: Locale,
        system: System
    }
};

Vue.ready(window.Settings);
