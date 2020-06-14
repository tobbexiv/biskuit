<template>

    <div>
        <v-modal ref="output" :options="options">

            <div class="uk-modal-header uk-flex uk-flex-middle">
                <h2>{{ 'Removing %title% %version%' | trans({title:pkg.title,version:pkg.version}) }}</h2>
            </div>

            <pre class="pk-pre uk-text-break" v-html="output"></pre>

            <v-loader v-show="status == 'loading'"></v-loader>

            <div class="uk-alert uk-alert-success" v-show="status == 'success'">{{ 'Successfully removed.' | trans }}</div>
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
            uninstall(pkg, packages) {
                const vm = this;
                this.pkg = pkg;

                return this.$http.post('admin/system/package/uninstall', { params: { name: pkg.name }, progress() { vm.init() } }).then(function () {
                            if (this.status === 'success' && packages) {
                                packages.splice(packages.indexOf(pkg), 1);
                            }
                        }, function (msg) {
                            this.$notify(msg.data, 'danger');
                            this.close();
                        }
                    );
            }
        }
    };
</script>
