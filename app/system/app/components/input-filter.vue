<template>
    <div class="uk-form-custom bk-filter" :class="{'uk-active': value }">
        <span>{{ label }}</span>
        <select v-model="innerValue">
            <template v-for="option in list">
                <optgroup :label="option.label" v-if="option.label">
                    <option v-for="opt in option.options" :value="opt.value">{{ opt.text }}</option>
                </optgroup>
                <option :value="option.value" v-else>{{ option.text }}</option>
            </template>
        </select>
    </div>
</template>

<script>
    export default {
        props: ['title', 'value', 'options', 'number'],

        data() {
            return {
                innerValue: this.value !== undefined ? this.value : ''
            };
        },

        watch: {
            value(newValue) {
                this.innerValue = newValue;
            },

            innerValue(newValue) {
                this.$emit('input', newValue);
            }
        },

        computed: {
            list() {
                return [ { value: '', text: this.title } ].concat(this.options);
            },

            label() {
                const list = this.list.concat(_.flatten(_.map(this.list, 'options')));
                const value = _.find(list, ['value', this.innerValue]);
                return value ? value.text : this.title;
            }
        }
    };
</script>
