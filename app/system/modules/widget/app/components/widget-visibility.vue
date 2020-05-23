<template>
    <div class="uk-form-horizontal">
        <div class="uk-form-row">
            <span class="uk-form-label">Pages</span>
            <div class="uk-form-controls uk-form-controls-text" v-if="config.menus">
                <input-tree v-model="widget.nodes"></input-tree>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        section: {
            label: 'Visibility',
            priority: 100
        },

        props: ['config', 'value'],

        data() {
            return {
                menus: false,
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
        }
    }
</script>
