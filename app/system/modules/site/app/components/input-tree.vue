<template>
    <div>
        <label><input type="checkbox" v-model="all"> {{ 'All Pages' | trans }}</label>
        <ul class="uk-list uk-margin-top-remove" v-for="menu in filteredMenus" :key="menu.id">
            <li class="pk-list-header">{{ menu.label }}</li>
            <node-template v-for="node in grouped[menu.id][0]" :menu="menu" :grouped="grouped" :node="node" v-model="active" :key="menu.id + '0' + node.id"></node-template>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            trash: {
                type: Boolean,
                default: false
            },
            value: {
                type: Array,
                default: function() {
                    return [];
                }
            }
        },

        data() {
            return {
                menus: [],
                nodes: [],
                active: this.value,
                all: true
            }
        },

        created() {
            this.all = !this.active || !this.active.length;
        },

        watch: {
            value(val) {
                if(this.active != val) {
                    this.active = val;
                }
            },
            active(val) {
                this.all = !val || !val.length;
                this.$emit('input', val);
            },
            all(all) {
                if (all) {
                    this.active = [];
                }
            }
        },

        mounted() {
            const vm = this;

            Vue.Promise.all([
                    this.$http.get('api/site/node'),
                    this.$http.get('api/site/menu')
                ])
                .then((responses) => {
                    vm.nodes = responses[0].data;
                    vm.menus = vm.trash ? responses[1].data : _.reject(responses[1].data, ['id', 'trash']);
                }, function () {
                    vm.$notify('Could not load config.', 'danger');
                });
        },

        computed: {
            grouped() {
                return _(this.nodes).groupBy('menu').mapValues(function(nodes) {
                    return _(nodes || {}).sortBy('priority').groupBy('parent_id').value();
                }).value();
            },
            filteredMenus() {
                return _.filter(this.menus, (menu) => menu.count);
            }
        },

        components: {
            'node-template': {
                name: 'node-template',
                props: ['node', 'grouped', 'menu', 'value'],
                data() { return { active: this.value }; },
                watch: {
                    value(val) { this.active = val; },
                    active(val) { this.$emit('input', val); }
                },
                template: '<li>' +
                    '<label><input type="checkbox" :value="node.id" v-model.number="active"> {{ node.title }}</label>' +
                    '<ul class="uk-list" v-if="grouped[menu.id][node.id]">' +
                        '<node-template v-for="innerNode in grouped[menu.id][node.id]" :menu="menu" :grouped="grouped" :node="innerNode" v-model="active" :key="menu.id + node.id + innerNode.id></node-template>' +
                    '</ul>' +
                '</li>'
            }
        }
    };

    window.Vue.component('input-tree', function (resolve) {
        resolve(require('./input-tree.vue'));
    });
</script>
