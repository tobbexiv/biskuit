import PackageLibrary from '../lib/package';
import PackageDetails from './package-details.vue';
import PackageUpload from './package-upload.vue';

export default {
    mixins: [PackageLibrary],

    data() {
        return _.extend({
            pkg: {},
            view: false,
            updates: null,
            search: this.$session.get(this.$options.name + '.search', ''),
            status: ''
        }, window.$data);
    },

    mounted() {
        this.load();
    },

    watch: {
        search(search) {
            this.$session.set(this.$options.name + '.search', search);
        }
    },

    computed: {
        filteredPackages() {
            const search = this.search;
            return _.filter(this.packages, pkg => { return pkg.title.toLowerCase().indexOf(search) > -1 });
        },

        nothingFound() {
            return this.filteredPackages.length === 0;
        }
    },

    methods: {
        load() {
            this.status = 'loading';
            if (this.packages) {
                this.queryUpdates(this.packages).then(function (res) {
                    const { data } = res;
                    this.updates = data.packages.length ? _.keyBy(data.packages, 'name') : null;
                    this.status = '';
                }, function () {
                    this.status = 'error';
                });
            }
        },

        icon(pkg) {
            if (pkg.extra && pkg.extra.icon) {
                return pkg.url + '/' + pkg.extra.icon;
            } else {
                return this.$url('app/system/assets/images/placeholder-icon.svg');
            }
        },

        image(pkg) {
            if (pkg.extra && pkg.extra.image) {
                return pkg.url + '/' + pkg.extra.image;
            } else {
                return this.$url('app/system/assets/images/placeholder-800x600.svg');
            }
        },

        details(pkg) {
            this.pkg = pkg;
            this.$refs.details.open();
        },

        settings(pkg) {
            if (!pkg.settings) {
                return;
            }

            let view;
            _.forIn(this.$options.components, (component, name) => {
                let options = component.options || {};
                if (options.settings && pkg.settings === name) {
                    view = name;
                }
            });

            if (view) {
                this.pkg = pkg;
                this.view = view;
                this.$refs.settings.open();
            } else {
                window.location = pkg.settings;
            }
        }
    },

    components: {
        'package-upload': PackageUpload,
        'package-details': PackageDetails
    }
};
