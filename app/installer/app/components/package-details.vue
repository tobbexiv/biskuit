<template>
    <div>
        <div class="uk-modal-header uk-flex uk-flex-middle">
            <img class="uk-margin-right" width="50" height="50" :alt="pkg.title" :src="icon(pkg)" v-if="pkg.extra && pkg.extra.icon">

            <div class="uk-flex-item-1">
                <h2 class="uk-margin-small-bottom">{{ pkg.title }}</h2>
                <ul class="uk-subnav uk-subnav-line uk-margin-bottom-remove">
                    <li class="uk-text-muted" v-if="pkg.authors && pkg.authors[0]">{{ pkg.authors[0].name }}</li>
                    <li class="uk-text-muted">{{ 'Version %version%' | trans({version:pkg.version}) }}</li>
                </ul>
            </div>
        </div>

        <div class="uk-alert uk-alert-danger" v-show="messages.checksum">
            {{ 'The checksum of the uploaded package does not match the one from the marketplace. The file might be manipulated.' | trans }}
        </div>

        <div class="uk-alert" v-show="messages.update">
            {{ 'There is an update available for the package.' | trans }}
        </div>

        <p>{{ pkg.description }}</p>

        <ul class="uk-list">
            <li v-if="pkg.license"><strong>{{ 'License:' | trans }}</strong> {{ pkg.license }}</li>
            <template v-if="pkg.authors && pkg.authors[0]">
            <li v-if="pkg.authors[0].homepage"><strong>{{ 'Homepage:' | trans }}</strong>
                <a :href="pkg.authors[0].homepage" target="_blank">{{ pkg.authors[0].homepage }}</a></li>
            <li v-if="pkg.authors[0].email"><strong>{{ 'Email:' | trans }}</strong>
                <a :href="'mailto:' + pkg.authors[0].email">{{ pkg.authors[0].email }}</a></li>
            </template>
        </ul>

        <img width="1200" height="800" :alt="pkg.title" :src="image(pkg)" v-if="pkg.extra && pkg.extra.image">
    </div>
</template>

<script>
    var Version = require('../lib/version');

    export default {
        props: {
            api: {
                type: String,
                default: ''
            },
            pkg: {
                type: Object,
                default() {
                    return {};
                }
            }
        },

        data() {
            return {
                messages: {}
            };
        },

        watch: {
            pkg: {
                handler() {
                    if (!this.pkg.name) {
                        return;
                    }

                    if (_.isArray(this.pkg.authors)) {
                        this.pkg.author = this.pkg.authors[0];
                    }

                    this.messages = {};
                    this.queryPackage(this.pkg, function (res) {
                        const { data } = res;
                        const queriedPkg = data.versions[version];
                        let version = this.pkg.version;

                        // verify checksum
                        if (queriedPkg && this.pkg.shasum) {
                            this.$set(this.messages, 'checksum', queriedPkg.dist.shasum != this.pkg.shasum);
                        }

                        // check version
                        _.each(data.versions, pkg => {
                            if (Version.compare(pkg.version, version, '>')) {
                                version = pkg.version;
                            }
                        });
                        this.$set(this.messages, 'update', version != this.pkg.version);
                    });
                },
                immediate: true
            }
        },

        methods: {
            icon(pkg) {
                const extra = pkg.extra || {};
                if (!extra.icon) {
                    return this.$url('app/system/assets/images/placeholder-icon.svg');
                } else if (!extra.icon.match(/^(https?:)?\//)) {
                    return pkg.url + '/' + extra.icon;
                }
                return extra.icon;
            },

            image(pkg) {
                const extra = pkg.extra || {};
                if (!extra.image) {
                    return this.$url('app/system/assets/images/placeholder-image.svg');
                } else if (!extra.image.match(/^(https?:)?\//)) {
                    return pkg.url + '/' + extra.image;
                }
                return extra.image;
            },

            queryPackage(pkg, success) {
                return this.$http.get(this.api + '/api/package/{+name}', {
                    params: { name: _.isObject(pkg) ? pkg.name : pkg }
                }).then(success, this.error);
            }
        }
    }
</script>
