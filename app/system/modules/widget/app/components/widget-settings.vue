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
                :options="{ elementClass: 'uk-width-1-1 uk-form-large' }"
                v-model="widget.title">
            </v-validated-input>
        </div>
        <div class="pk-width-sidebar">
            <template-settings />
        </div>
    </div>
</template>

<script>
    export default {
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
        },
    }
</script>
