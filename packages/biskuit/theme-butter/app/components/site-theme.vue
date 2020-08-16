<template>
    <div>
        <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
            <div data-uk-margin>
                <h2 class="uk-margin-remove">{{ 'Theme' | trans }}</h2>
            </div>
            <div data-uk-margin>
                <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
            </div>
        </div>

        <div class="uk-form uk-form-horizontal">
            <div class="uk-margin">
                <label class="uk-form-label">{{ 'Logo Contrast' | trans }}</label>
                <div class="uk-form-controls uk-form-width-large">
                    <input-image v-model="config.logo_contrast"></input-image>
                    <p class="uk-form-help-block">{{ 'Select an alternative logo which looks great on images.' | trans }}</p>
                </div>
            </div>

            <div class="uk-margin">
                <label class="uk-form-label">{{ 'Logo Off-canvas' | trans }}</label>
                <div class="uk-form-controls uk-form-width-large">
                    <input-image v-model="config.logo_offcanvas"></input-image>
                    <p class="uk-form-help-block">{{ 'Select an optional logo for the off-canvas menu.' | trans }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const SiteTheme = {
        section: {
            label: 'Theme',
            icon: 'pk-icon-large-brush',
            priority: 15
        },

        data() {
            return _.extend({
                config: {}
            }, window.$theme);
        },

        methods: {
            save() {
                this.$http.post('admin/system/settings/config', { name: this.name, config: this.config }).catch(function (res) {
                    this.$notify(res.data, 'danger');
                });
            }
        },

        events: {
            'site:save-settings': 'save'
        },
    };

    export default SiteTheme;

    window.Site.components['site-theme'] = SiteTheme;
</script>
