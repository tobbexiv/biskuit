<template>
    <div>
        <v-modal ref="modal" :closed="close">
            <template #header>
                <h2 class="uk-modal-title">{{ 'Add Link' | trans }}</h2>
            </template>

            <form class="uk-form-stacked" @submit.prevent="update">
                <div class="uk-margin">
                    <label for="form-link-title" class="uk-form-label">{{ 'Title' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-link-title" class="uk-input uk-width-1-1" type="text" v-model="link.txt">
                    </div>
                </div>

                <div class="uk-margin uk-margin-remove-bottom">
                    <label for="form-link-url" class="uk-form-label">{{ 'Url' | trans }}</label>
                    <div class="uk-form-controls">
                        <input-link id="form-link-url" input-class="uk-width-1-1" v-model="link.link"></input-link>
                    </div>
                </div>
            </form>

            <template #footer>
                <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                <button class="uk-button uk-button-link" @click="update">{{ 'Update' | trans }}</button>
            </template>
        </v-modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                link: {
                    link: '',
                    txt: '',
                    class: ''
                }
            };
        },

        mounted() {
            this.$refs.modal.open();
        },

        methods: {
            close() {
                this.$destroy(true);
            },

            update() {
                this.$refs.modal.close();
                this.$emit('select', this.link);
            }
        }
    };
</script>
