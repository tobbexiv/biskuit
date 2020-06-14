import SiteCode from '../components/site-code.vue';
import SiteMeta from '../components/site-meta.vue';
import SiteGeneral from '../components/site-general.vue';
import SiteMaintenance from '../components/site-maintenance.vue';

window.Site = {
    el: '#settings',

    data() {
        return window.$data;
    },

    mounted() {
        UIkit.tab(this.$refs.tab, { connect: this.$refs.content });
    },

    computed: {
        sections() {
            let hash = window.location.hash.replace('#', '');

            let sections = [];
            _.forIn(this.$options.components, function (component, name) {
                let section = component.section;
                if (section) {
                    section.name = name;
                    section.active = name == hash;
                    sections.push(section);
                }
            });
            return _.sortBy(sections, ['priority']);
        }
    },

    methods: {
        save() {
            this.$trigger('site:save-settings', this.config);
            this.$http.post('admin/system/settings/config', { name: 'system/site', config: this.config }).then(function () {
                this.$notify('Settings saved.');
            }, function (res) {
                this.$notify(res.data, 'danger');
            });
        }
    },

    components: {
        'site-code': SiteCode,
        'site-meta': SiteMeta,
        'site-general': SiteGeneral,
        'site-maintenance': SiteMaintenance
    }
};

Vue.ready(window.Site);
