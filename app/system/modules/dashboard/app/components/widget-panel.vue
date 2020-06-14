<template>
    <div>
        <div class="uk-panel-badge" v-if="!type.disableToolbar">
            <ul class="uk-subnav pk-subnav-icon">
                <li v-show="type.editable !== false && !innerEditing">
                    <a class="pk-icon-edit pk-icon-hover uk-hidden" :title="$trans('Edit')" data-uk-tooltip="{delay: 500}" @click.prevent="edit"></a>
                </li>
                <li v-show="!innerEditing">
                    <a class="pk-icon-handle pk-icon-hover uk-hidden uk-sortable-handle" :title="$trans('Drag')" data-uk-tooltip="{delay: 500}"></a>
                </li>
                <li v-show="innerEditing">
                    <a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove" v-confirm="'Delete widget?'"></a>
                </li>
                <li v-show="innerEditing">
                    <a class="pk-icon-check pk-icon-hover" :title="$trans('Close')" data-uk-tooltip="{delay: 500}" @click.prevent="save"></a>
                </li>
            </ul>
        </div>
        <component :is="type.component" :widget="widget" :editing="innerEditing"></component>
    </div>
</template>

<script>
    export default {
        props: { 'widget': {}, 'editing': {default: false} },

        data() {
            return {
                innerEditing: false
            }
        },

        created() {
            if(this.editing === true || this.editing === false) {
                this.innerEditing = this.editing;
            }
            this.$options.components = this.$parent.$options.components;
        },

        computed: {
            type() {
                return this.$root.getType(this.widget.type);
            }
        },

        watch: {
            innerEditing(value) {
                this.$emit('editing', value);
            },
            editing(value) {
                if(value !== this.innerEditing) {
                    this.innerEditing = value;
                }
            }
        },

        methods: {
            edit() {
                this.innerEditing = true;
            },

            save() {
                this.$root.save(this.widget);
                this.innerEditing = false;
            },

            remove() {
                this.$root.remove(this.widget);
            }
        }
    };
</script>
