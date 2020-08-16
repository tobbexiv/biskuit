<template>
    <div>
        <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
            <div data-uk-margin>
                <h2 class="uk-margin-remove">{{ 'Cache' | trans }}</h2>
            </div>
            <div data-uk-margin>
                <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
            </div>
        </div>

        <div class="uk-margin">
            <span class="uk-form-label">{{ 'Cache' | trans }}</span>
            <div class="uk-form-controls uk-form-controls-text">
                <p class="uk-form-controls-condensed" v-for="(cache, key) in caches">
                    <label><input type="radio" :value="key" v-model="config.caches.cache.storage" :disabled="!cache.supported"> {{ cache.name }}</label>
                </p>
            </div>
        </div>

        <div class="uk-margin">
            <span class="uk-form-label">{{ 'Developer' | trans }}</span>
            <div class="uk-form-controls uk-form-controls-text">
                <p class="uk-form-controls-condensed">
                    <label><input type="checkbox" value="1" v-model="config.nocache"> {{ 'Disable cache' | trans }}</label>
                </p>
                <p>
                    <button class="uk-button uk-button-primary" type="button" @click.prevent="open">{{ 'Clear Cache' | trans }}</button>
                </p>
            </div>
        </div>

        <v-modal ref="modal">
            <form class="uk-form-stacked">
                <div class="uk-modal-header">
                    <h2>{{ 'Select Cache to Clear' | trans }}</h2>
                </div>

                <div class="uk-margin">
                    <p class="uk-form-controls-condensed">
                        <label><input type="checkbox" v-model="cache.cache"> {{ 'System Cache' | trans }}</label>
                    </p>
                    <p class="uk-form-controls-condensed">
                        <label><input type="checkbox" v-model="cache.temp"> {{ 'Temporary Files' | trans }}</label>
                    </p>
                </div>

                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                    <button class="uk-button uk-button-link" @click.prevent="clear">{{ 'Clear' | trans }}</button>
                </div>
            </form>
        </v-modal>
    </div>
</template>

<script>
    const Cache = {
        section: {
            label: 'Cache',
            icon: 'pk-icon-large-bolt',
            priority: 30
        },

        props: ['config', 'options'],

        data() {
            return {
                cache: {},
                caches: window.$caches
            };
        },

        methods: {
            open () {
                this.$set(this.cache, 'cache', true);
                this.$refs.modal.open();
            },

            clear() {
                this.$http.post('admin/system/cache/clear', { caches: this.cache }).then(function () {
                    this.$notify('Cache cleared.');
                });
                this.$refs.modal.close();
            }
        }
    };

    export default Cache;

    window.Settings.components['system-cache'] = Cache;
</script>
