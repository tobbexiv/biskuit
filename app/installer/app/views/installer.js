var Installer = {

    el: '#installer',

    data: function () {
        return _.merge({
            key: 0,
            step: 'start',
            status: '',
            message: '',
            config: {
                database: {
                    connections: {
                        mysql: {
                            user: '',
                            host: 'localhost',
                            password: '',
                            dbname: 'biskuit',
                            prefix: 'bk_'
                        },
                        sqlite: {
                            prefix: 'bk_'
                        }
                    },
                    default: ''
                }
            },
            option: {
                'system/site': {
                    title: ''
                },
                system: {
                    admin: { },
                    site: { }
                }
            },
            user: {
                username: 'admin',
                password: '',
                email: ''
            }
        }, window.$installer);
    },

    mounted: function () {

        this.resource = this.$resource('installer/{action}', {}, {post: {method: 'POST'}});
        this.$set(this.config.database, 'default', this.sqlite ? 'sqlite' : 'mysql')

    },

    methods: {

        gotoStep: function (step) {

            if (UIkit.animation) {
                var vm = this;
                var current = this.$refs[this.step];
                var next = this.$refs[step];

                UIkit.Utils.animate(current, 'uk-animation-slide-left uk-animation-reverse').then(function () {
                    current.style.display = 'none';

                    UIkit.Utils.animate(next, 'uk-animation-slide-right').then(function () {
                        vm.step = step;
                    });
                });

            } else {
                this.step = step;
            }

        },

        stepLanguage: function () {

            var vm = this;
            this.$asset({js: [this.$url.route('system/intl/{locale}', {locale: this.locale})]}).then(function () {
                this.$set(this.option.system.admin, 'locale', this.locale);
                this.$set(this.option.system.site, 'locale', this.locale);
                this.$locale = window.$locale;
                this.key = this.key + 1;

                Vue.nextTick(function() {
                    vm.gotoStep('database');
                });
            });

        },

        stepDatabase: function () {
            var config = _.cloneDeep(this.config);

            _.forEach(config.database.connections, function (connection, name) {
                if (name != config.database.default) {
                    delete(config.database.connections[name]);
                } else if (connection.host) {
                    connection.host = connection.host.replace(/:(\d+)$/, function (match, port) {
                        connection.port = port;
                        return '';
                    });
                }
            });

            this.resource.post({action: 'check'}, {config: config, locale: this.locale}).then(function (res) {

                var data = res.data;
                if (!_.isPlainObject(data)) {
                    data = {message: 'Whoops, something went wrong'};
                }

                if (data.status == 'no-tables') {
                    this.gotoStep('site');
                    this.config = config;
                } else {
                    this.status = data.status;
                    this.message = data.message;
                }

            });

        },

        stepSite: function () {

            this.gotoStep('finish');
            this.stepInstall();

        },

        stepInstall: function () {

            this.status = 'install';

            this.resource.post({action: 'install'}, {config: this.config, option: this.option, user: this.user, locale: this.locale}).then(function (res) {

                var data = res.data;

                setTimeout(function () {

                    if (!_.isPlainObject(data)) {
                        data = {message: 'Whoops, something went wrong'};
                    }

                    if (data.status == 'success') {
                        this.status = 'finished';

                        // redirect to login after 3s
                        setTimeout(function () {
                            location.href = this.$url.route('admin');
                        }.bind(this), 3000);

                    } else {
                        this.status = 'failed';
                        this.message = data.message;
                    }


                }.bind(this), 2000);
            });
        }

    }

};

Vue.ready(Installer);
