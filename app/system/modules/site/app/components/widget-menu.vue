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
                <label for="form-menu" class="uk-form-label">{{ 'Menu' | trans }}</label>
                <div class="uk-form-controls">
                    <select id="form-menu" class="uk-form-width-large" v-model="widget.data.menu">
                        <option value="">{{ '- Menu -' | trans }}</option>
                        <option v-for="m in menus" :value="m.id">{{ m.label }}</option>
                    </select>
                </div>
            </div>

            <div class="uk-form-row">
                <label for="form-level" class="uk-form-label">{{ 'Start Level' | trans }}</label>
                <div class="uk-form-controls">
                    <select id="form-level" class="uk-form-width-large" v-model.number="widget.data.start_level">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
            </div>

            <div class="uk-form-row">
                <label for="form-depth" class="uk-form-label">{{ 'Depth' | trans }}</label>
                <div class="uk-form-controls">
                    <select id="form-depth" class="uk-form-width-large" v-model.number="widget.data.depth">
                        <option value="">{{ 'No Limit' | trans }}</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
            </div>

            <div class="uk-form-row">
                <span class="uk-form-label">{{ 'Sub Items' | trans }}</span>
                <div class="uk-form-controls uk-form-controls-text">
                    <p class="uk-form-controls-condensed">
                        <label><input type="radio" value="all" v-model="widget.data.mode"> {{ 'Show all' | trans }}</label>
                    </p>
                    <p class="uk-form-controls-condensed">
                        <label><input type="radio" value="active" v-model="widget.data.mode"> {{ 'Show only for active item' | trans }}</label>
                    </p>
                </div>
            </div>
        </div>
        <div class="pk-width-sidebar">
            <template-settings />
        </div>
    </div>
</template>

<script>
    const WidgetSystemMenuSettings = {
        section: {
            label: 'Settings'
        },

        props: ['config', 'value'],

        data() {
            return {
                menus: {},
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

        created() {
            this.$http.get('api/site/menu').then(function (res) {
                this.menus = res.data.filter((menu) => {
                    return menu.id !== 'trash';
                });
            });
        }
    };

    export default WidgetSystemMenuSettings;

    window.Widgets.components['system-menu.settings'] = WidgetSystemMenuSettings;
</script>
