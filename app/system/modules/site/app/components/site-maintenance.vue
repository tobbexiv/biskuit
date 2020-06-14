<template>
    <div>
        <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
            <div data-uk-margin>
                <h2 class="uk-margin-remove">{{ 'Maintenance' | trans }}</h2>
            </div>
            <div data-uk-margin>
                <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
            </div>
        </div>

        <div class="uk-form uk-form-horizontal">
            <div class="uk-form-row">
                <span class="uk-form-label">{{ 'Offline' | trans }}</span>
                <div class="uk-form-controls uk-form-controls-text">
                    <label><input type="checkbox" value="1" v-model="config.maintenance.enabled"> {{ 'Put the site offline and show the offline message.' | trans }}</label>
                </div>
            </div>

            <div class="uk-form-row">
                <label for="form-offlinemessage" class="uk-form-label">{{ 'Message' | trans }}</label>
                <div class="uk-form-controls">
                    <textarea id="form-offlinemessage" class="uk-form-width-large" :placeholder="$trans('We\'ll be back soon.')" rows="5" v-model="config.maintenance.msg"></textarea>
                </div>
            </div>

            <div class="uk-form-row">
                <label for="form-logo" class="uk-form-label">{{ 'Logo' | trans }}</label>
                <div class="uk-form-controls uk-form-width-large">
                    <input-image v-model="config.maintenance.logo"></input-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        section: {
            label: 'Maintenance',
            icon: 'pk-icon-large-cone',
            priority: 30
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
