<template>
    <div class="uk-grid pk-grid-large pk-width-sidebar-large uk-form-stacked" data-uk-grid-margin>
        <div class="pk-width-content">
            <v-validated-input
                id="form-page-title"
                name="page[title]"
                rules="required"
                placeholder="Enter Title"
                :error-messages="{ required: 'Title cannot be blank.' }"
                :options="{ innerWrapperClass: '', elementClass: 'uk-width-1-1 uk-form-large' }"
                v-model.lazy="page.title">
            </v-validated-input>

            <div class="uk-form-row">
                <v-editor v-model="page.content" :options="{markdown : page.data.markdown}"></v-editor>
                <p>
                    <label><input type="checkbox" v-model="page.data.markdown"> {{ 'Enable Markdown' | trans }}</label>
                </p>
            </div>
        </div>
        <div class="pk-width-sidebar">
            <div class="uk-panel">
                <template-settings />
            </div>
        </div>
    </div>
</template>

<script>
    const NodePage = {
        section: {
            label: 'Content'
        },

        props: ['roles', 'value'],

        data() {
            return {
                menuTitleRequired: false,
                node: this.value,
                page: {
                    data: {
                        title: true,
                        markdown: false
                    }
                }
            };
        },

        watch: {
            'node.data.defaults.id': {
                handler: function (id) {
                    if (id) {
                        this.$http.get('api/site/page{/id}', { params: { id: id } }).then(function (res) {
                            this.page = res.data;
                        });
                    }
                },
                immediate: true
            },
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

        mounted() {
            if (!this.node.id) this.node.status = 1;
        },

        methods: {
            nodeSave(event, params) {
                params.page = this.page;
                if (!params.node.title) {
                    params.node.title = this.page.title;
                }
            }
        },

        events: {
            'node:save': 'nodeSave'
        }
    };

    export default NodePage;

    window.Site.components['page.settings'] = NodePage;
</script>
