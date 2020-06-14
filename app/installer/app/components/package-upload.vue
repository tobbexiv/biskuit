<template>
    <div>
        <a class="uk-button uk-button-primary uk-form-file">
            <span v-show="!progress">{{ 'Upload' | trans }}</span>
            <span v-show="progress"><i class="uk-icon-spinner uk-icon-spin"></i> {{ progress }}</span>
            <input type="file" name="file" ref="input">
        </a>

        <div class="uk-modal" ref="modal">
            <div class="uk-modal-dialog">
                <package-details :api="api" :pkg="pkg"></package-details>

                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                    <button class="uk-button uk-button-link" @click.prevent="doInstall">{{ 'Install' | trans }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PackageLibrary from '../lib/package';
    import PackageDetails from './package-details.vue';

    export default {
        mixins: [PackageLibrary],

        props: {
            api: {type: String, default: ''},
            packages: Array,
            type: String
        },

        data() {
            return {
                pkg: {},
                upload: null,
                progress: ''
            };
        },

        mounted: function () {
            const type = this.type;
            const settings = {
                action: this.$url.route('admin/system/package/upload'),
                type: 'json',
                param: 'file',
                before(options) {
                    _.merge(options.params, {_csrf: $biskuit.csrf, type: type});
                },
                loadstart: this.onStart,
                progress: this.onProgress,
                allcomplete: this.onComplete
            };
            UIkit.uploadSelect(this.$refs.input, settings);
            this.modal = UIkit.modal(this.$refs.modal);
        },

        methods: {
            onStart() {
                this.progress = '1%';
            },

            onProgress(percent) {
                this.progress = Math.ceil(percent) + '%';
            },

            onComplete(data) {
                const vm = this;
                this.progress = '100%';
                setTimeout(() => {
                    vm.progress = '';
                }, 250);
                if (!data.package) {
                    this.$notify(data, 'danger');
                    return;
                }
                this.upload = data;
                this.pkg = data.package;
                this.modal.show();
            },

            doInstall() {
                this.modal.hide();
                this.install(this.upload.package, this.packages,
                    (output) => {
                        if (output.status === 'success') {
                            setTimeout(() => {
                                location.reload();
                            }, 300);
                        }
                    }, true);
            }

        },

        components: {
            'package-details': PackageDetails
        }
    };
</script>
