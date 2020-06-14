<template>
    <div class="uk-grid pk-grid-large pk-width-sidebar-large" data-uk-grid-margin>
        <div class="pk-width-content uk-form-horizontal">
            <v-validated-input
                id="form-title"
                name="title"
                rules="required"
                label="Title"
                placeholder="Enter Title"
                :error-messages="{ required: 'Title cannot be blank.' }"
                :options="{ elementClass: 'uk-form-width-large' }"
                v-model="widget.title">
            </v-validated-input>

            <div class="uk-form-row">
                <label class="uk-form-label">{{ 'Login Redirect' | trans }}</label>
                <div class="uk-form-controls">
                    <input-link id="form-redirect-login" input-class="uk-form-width-large" v-model="widget.data.redirect_login"></input-link>
                </div>
            </div>

            <div class="uk-form-row">
                <label class="uk-form-label">{{ 'Logout Redirect' | trans }}</label>
                <div class="uk-form-controls">
                    <input-link id="form-redirect-logout" input-class="uk-form-width-large" v-model="widget.data.redirect_logout"></input-link>
                </div>
            </div>
        </div>
        <div class="pk-width-sidebar">
            <template-settings />
        </div>
    </div>

</template>

<script>
    const WidgetSystemLoginSettings = {
        section: {
            label: 'Settings'
        },

        props: ['config', 'value'],

        data() {
            return {
                widget: this.value
            };
        },

        watch: {
            value(val) {
                this.widget = val;
            },
            widget(val) {
                this.$emit('input', val);
            }
        },

        beforeCreate() {
            this.$options.components = _.merge(this.$options.components, this.$root.getComponents());
        }
    };

    export default WidgetSystemLoginSettings;

    window.Widgets.components['system-login.settings'] = WidgetSystemLoginSettings;

</script>
