<template>
    <div class="uk-margin">
        <div>
            <label for="form-link-file" class="uk-form-label">{{ 'File' | trans }}</label>
            <v-validated-input
                id="form-link-file"
                name="form-link-file"
                :rules="{ required: false/*isRequired*/ }"
                :error-messages="{ required: 'Link cannot be blank.' }"
                :options="{
                        wrapperClass: 'uk-form-controls',
                        innerWrapperClass: 'pk-form-link uk-width-1-1',
                        icon: {
                            type: 'link',
                            symbol: 'link',
                            label: 'Select',
                            callback: pick
                        }
                    }"
                v-model.lazy="file">
            </v-validated-input>
        </div>

        <v-modal ref="modal" large>
            <div :is="'panel-finder'" :root="storage" :modal="true"></div>

            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                <button class="uk-button uk-button-primary" type="button" :disabled="lastSelection == ''" @click.prevent="select">{{ 'Select' | trans }}</button>
            </div>
        </v-modal>
    </div>
</template>

<script>
    const LinkStorage = {
        link: {
            label: 'Storage'
        },

        props: ['link'],

        data() {
            return _.merge({
                file: '',
                lastSelection: ''
            }, $biskuit);
        },

        created() {
            this.assets = this.$asset({
                js: [
                    'app/assets/uikit/js/components/upload.min.js'
                ]
            });
        },

        watch: {
            file(selected) {
                this.$emit('input', selected);
            }
        },

        methods: {
            pick() {
                this.assets.then(function () {
                    this.$refs.modal.open();
                });
            },

            select() {
                this.file = this.lastSelection;
                this.lastSelection = '';
                this.$refs.modal.close();
            },

            updateSelected(event, params) {
                this.lastSelection = params.selected ? params.selected[0] : '';
            }
        },

        events: {
            'finder:selected': 'updateSelected',
        },
    };

    export default LinkStorage;

    window.Links.default.components['link-storage'] = LinkStorage;
</script>
