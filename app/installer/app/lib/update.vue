<template>
    <div>
        <v-modal ref="output" :options="options">
            <div class="uk-modal-header uk-flex uk-flex-middle">
                <h2>{{ 'Updating %title% to %version%' | trans({ title:pkg.title, version:updatePkg.version }) }}</h2>
            </div>

            <pre class="pk-pre uk-text-break" v-html="output"></pre>

            <v-loader v-show="status == 'loading'"></v-loader>

            <div class="uk-alert uk-alert-success" v-show="status == 'success'">{{ 'Successfully updated.' | trans }}</div>
            <div class="uk-alert uk-alert-danger" v-show="status == 'error'">{{ 'Error' | trans}}</div>

            <div class="uk-modal-footer uk-text-right" v-show="status != 'loading'">
                <a class="uk-button uk-button-link" @click.prevent="close">{{ 'Close' | trans }}</a>
            </div>
        </v-modal>
    </div>
</template>

<script>
    import Output from './output';

    export default {
        mixins: [ Output ],

        methods: {
            update(pkg, updates, onClose, packagist) {
                const vm = this;
                this.pkg = pkg;
                this.updatePkg = updates[pkg.name];
                this.cb = onClose;

                return this.$http.post('admin/system/package/install', { params: { package: updates[pkg.name], packagist: Boolean(packagist) }, progress() { vm.init() } }).then(function () {
                    if (this.status === 'loading') {
                        this.status = 'error';
                    }

                    if (this.status === 'success') {
                        Vue.delete(updates, pkg.name);
                    }

                    if (pkg.enabled) {
                        this.$parent.enable(pkg).then(null, function () {
                            this.status = 'error';
                        });
                    }

                }, function (msg) {
                    this.$notify(msg.data, 'danger');
                    this.close();
                });
            }
        }
    };
</script>
