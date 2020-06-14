<template>
    <div class="uk-form-horizontal">
        <v-validated-input
            id="form-url"
            name="link"
            rules="required"
            label="Url"
            :error-messages="{ required: 'Url cannot be blank.' }"
            :options="{ elementClass: 'uk-form-width-large' }"
            v-model="node.link">
        </v-validated-input>

        <div class="uk-form-row">
            <label for="form-type" class="uk-form-label">{{ 'Type' | trans }}</label>
            <div class="uk-form-controls">
                <select id="form-type" class="uk-form-width-large" v-model="behavior">
                    <option value="link">{{ 'Link' | trans }}</option>
                    <option value="alias">{{ 'URL Alias' | trans }}</option>
                    <option value="redirect">{{ 'Redirect' | trans }}</option>
                </select>
            </div>
        </div>

        <template-settings />
    </div>
</template>

<script>
    export default {
        section: {
            label: 'Settings',
            priority: 0,
            active: 'link'
        },

        props: ['roles', 'value'],

        data() {
            return {
                menuTitleRequired: false,
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

        created() {
            if (this.behavior === 'redirect') {
                this.node.link = this.node.data.redirect;
            }

            if (!this.node.id) {
                this.node.status = 1;
            }
        },

        computed: {
            behavior: {
                get() {
                    if (this.node.data.alias) {
                        return 'alias';
                    } else if (this.node.data.redirect) {
                        return 'redirect';
                    }
                    return 'link';
                },

                set(type) {
                    this.node.data = _.extend(this.node.data, {
                        alias: type === 'alias',
                        redirect: type === 'redirect' ? this.node.link : false
                    });
                }
            }
        },

        methods: {
            nodeSave(event, params) {
                if (this.behavior === 'redirect') {
                    params.node.data.redirect = params.node.link;
                }
            }
        },

        events: {
            'node:save': 'nodeSave'
        }
    }
</script>
