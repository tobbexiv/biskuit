<template>
    <div>
        <v-modal ref="modal" :closed="close">
            <form class="uk-form uk-form-stacked" @submit.prevent="update">
                <div class="uk-modal-header">
                    <h2>{{ 'Add Image' | trans }}</h2>
                </div>

                <div class="uk-margin">
                    <input-image v-model="image.data.src"></input-image>
                </div>

                <div class="uk-margin">
                    <label for="form-src" class="uk-form-label">{{ 'URL' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-src" class="uk-width-1-1" type="text" v-model.lazy="image.data.src">
                    </div>
                </div>

                <div class="uk-margin">
                    <label for="form-alt" class="uk-form-label">{{ 'Alt' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-alt" class="uk-width-1-1" type="text" v-model="image.data.alt">
                    </div>
                </div>

                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                    <button class="uk-button uk-button-link" type="submit">{{ 'Update' | trans }}</button>
                </div>
            </form>
        </v-modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                image: {
                    data: {
                        src: '',
                        alt: ''
                    }
                }
            };
        },

        mounted() {
            this.$refs.modal.open();
            this.$on('image-selected', function(path) {
                if (path && !this.image.data.alt) {
                    var alt   = path.split('/').slice(-1)[0].replace(/\.(jpeg|jpg|png|svg|gif)$/i, '').replace(/(_|-)/g, ' ').trim(),
                        first = alt.charAt(0).toUpperCase();
                    this.image.data.alt = first + alt.substr(1);
                }
            })
        },

        methods: {
            close() {
                this.$destroy(true);
            },

            update() {
                this.$refs.modal.close();
                this.$emit('select', this.image);
            }
        }
    };
</script>
