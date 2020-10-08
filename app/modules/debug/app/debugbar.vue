<template>
    <div id="bk-profiler" class="pf-profiler">
        <div class="pf-navbar">
            <ul v-if="data" class="pf-navbar-nav">
                <li v-for="section in sections" :key="section.name" :is="section.name" :data="data[section.name]" @click.native="open(section.name)" />
            </ul>

            <a class="pf-close" @click.prevent="close"><span class="pf-icon-medium pf-icon-close"></span></a>
        </div>

        <div class="pf-profiler-panel" ref="panel" :style="{ display: panel ? 'block' : 'none', height: height }"></div>
    </div>
</template>

<script>
    const _ = require('lodash');
    const config = window.$debugbar;

    export default {
        data() {
            return {
                request: null,
                data: null,
                panel: null,
                sections: {}
            }
        },

        created() {
            let sections = {};
            _.forIn(this.$options.components, (component, name) => {
                if (component.options && component.options.section) {
                    sections[name] = _.merge({ name: name }, component.options.section);
                }
            });
            this.sections = _.orderBy(sections, 'priority');

            this.load(config.current).then(function (res) {
                this.request = res.data.__meta;
            });
        },

        computed: {
            height() {
                return Math.ceil(window.innerHeight / 2) + 'px';
            }
        },

        methods: {
            load(id) {
                return this.$http.get('_debugbar/{id}', { params: { id } }).then(function (res) {
                    this.data = res.data;
                    return res;
                });
            },

            open(name) {
                const section = _.find(this.sections, ['name', name]);
                const vm = _.find(this.$children, ['$options.name', name]);

                if (!section.panel) {
                    return;
                }

                if (this.panel) {
                    this.close();
                }

                this.panel = new Vue({
                    parent: vm,
                    template: section.panel,
                    data: this.data[section.name],
                    filters: vm.$options.filters
                });
                this.panel.$mount();
                this.$refs.panel.appendChild(this.panel.$el);
            },

            close() {
                if (this.panel) {
                    this.$refs.panel.removeChild(this.panel.$el);
                    this.panel.$destroy(true);
                }
                this.panel = null;
            }
        }
    };
</script>
