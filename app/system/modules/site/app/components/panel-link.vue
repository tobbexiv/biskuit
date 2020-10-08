<template>
    <div>
        <div class="uk-margin">
            <label for="form-style" class="uk-form-label">{{ 'Extension' | trans }}</label>
            <div class="uk-form-controls">
                <select id="form-style" class="uk-select uk-width-1-1" v-model="type">
                    <option v-for="type in types" :value="type.value">{{ type.text }}</option>
                </select>
            </div>
        </div>

        <component :is="type" v-if="type" v-model="link"></component>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                type: false,
                link: ''
            };
        },

        watch: {
            type: {
                handler(type) {
                    if (!type && this.types.length) {
                        this.type = this.types[0].value;
                    }
                },
                immediate: true
            },

            link() {
                this.$emit('selection-changed', this.link);
            }
        },

        computed: {
            types() {
                const types = [];
                let options;

                _.forIn(this.$options.components, (component, name) => {
                    if (component.link) {
                        types.push({ text: component.link.label, value: name });
                    }

                });

                return _.sortBy(types, ['text']);
            }
        },

        components: {}
    };

    Vue.component('panel-link', (resolve) => {
        resolve(require('./panel-link.vue'));
    });

</script>
