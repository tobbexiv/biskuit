<template>
    <div class="uk-grid pk-grid-large pk-width-sidebar-large" data-uk-grid-margin>
        <div class="pk-width-content uk-form-stacked">
            <v-validated-input
                id="form-title"
                name="title"
                rules="required"
                placeholder="Enter Title"
                :error-messages="{ required: 'Title cannot be blank.' }"
                :options="{ elementClass: 'uk-width-1-1 uk-form-large' }"
                v-model="widget.title">
            </v-validated-input>

            <div class="uk-margin">
                <v-editor :options="{ markdown : widget.data.markdown }" v-model="widget.data.content"></v-editor>
                <p>
                    <label><input type="checkbox" v-model="widget.data.markdown"> {{ 'Enable Markdown' | trans }}</label>
                </p>
            </div>
        </div>
        <div class="pk-width-sidebar">
            <template-settings />
        </div>
    </div>
</template>

<script>
    const WidgetSystemTextSettings = {
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

    export default WidgetSystemTextSettings;

    window.Widgets.components['system-text.settings'] = WidgetSystemTextSettings;
</script>
