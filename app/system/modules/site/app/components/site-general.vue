<template>
    <div>
        <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
            <div data-uk-margin>
                <h2 class="uk-margin-remove">{{ 'General' | trans }}</h2>
            </div>
            <div data-uk-margin>
                <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
            </div>
        </div>

        <div class="uk-form uk-form-horizontal">
            <v-validated-input
                id="form-title"
                name="title"
                rules="required"
                label="Title"
                :error-messages="{ required: 'Site title cannot be blank.' }"
                :options="{ elementClass: 'uk-form-width-large' }"
                v-model="config.title">
            </v-validated-input>

            <div class="uk-margin">
                <label for="form-logo" class="uk-form-label">{{ 'Logo' | trans }}</label>
                <div class="uk-form-controls uk-form-width-large">
                    <input-image v-model="config.view.logo"></input-image>
                </div>
            </div>

            <div class="uk-margin">
                <label for="form-favicon" class="uk-form-label">{{ 'Favicon' | trans }}</label>
                <div class="uk-form-controls uk-form-width-large">
                    <input-image v-model="config.icons.favicon"></input-image>
                </div>
            </div>

            <div class="uk-margin">
                <label for="form-appicon" class="uk-form-label">{{ 'Appicon' | trans }}</label>
                <div class="uk-form-controls uk-form-width-large">
                    <input-image v-model="config.icons.appicon"></input-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        section: {
            label: 'General',
            icon: 'pk-icon-large-settings',
            priority: 10
        },

        props: ['value'],

        data() {
            return {
                config: this.value
            };
        },

        watch: {
            value(newConfig) {
                this.config = newConfig;
            },

            config(newConfig) {
                this.$emit('input', newConfig);
            }
        }
    }
</script>
