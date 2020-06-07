<template>
    <div class="uk-form-horizontal">
        <template-settings />
    </div>
</template>

<script>
    export default {
        section: {
            label: 'Settings'
        },

        props: ['roles', 'value'],

        data() {
            return {
                menuTitleRequired: true,
                node: this.value
            };
        },

        watch: {
            value(val) {
                this.node = val;
            },
            node(val) {
                this.$emit('input', val);
            }
        },

        beforeCreate() {
            this.$options.components = _.merge(this.$options.components, this.$root.$options.components);
        },
    };
</script>
