<template>
    <li>
        <a title="Routes"><span class="pf-icon pf-icon-routes"></span>Routes</a>
        <div class="pf-dropdown">
            <table class="pf-table pf-table-dropdown">
                <tbody>
                <tr>
                    <td>Route</td>
                    <td>{{ data.route ? data.route : 'n/a' }}</td>
                </tr>
                <template v-if="active">
                <tr>
                    <td>Path</td>
                    <td>{{ active.path }} {{ active.methods | str }}</td>
                </tr>
                <tr>
                    <td>Controller</td>
                    <td><abbr :title="active.controller">{{ active.controller | short }}</abbr></td>
                </tr>
                </template>
                </tbody>
            </table>
        </div>
    </li>
</template>

<script>
    export default {
        section: {
            priority: 20,
            panel: `
                <div id="panel-routes">
                    <h1>Routes</h1>
                    <table class="pf-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Path</th>
                                <th>Controller</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in routes" :class="{ 'pf-active': r.name == route }">
                                <td>{{ r.name }}</td>
                                <td>{{ r.path }} {{ r.methods | str }}</td>
                                <td><abbr :title="r.controller">{{ r.controller | short }}</abbr></td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
        },

        props: ['data'],

        computed: {
            active() {
                return this.data.routes.filter(function(route) {
                    return route.name === this.data.route;
                }, this)[0];
            }
        },

        filters: {
            str(methods) {
                return methods.length ? '(' + methods + ')' : '';
            },

            short(controller) {
                return controller.split('\\').pop();
            }
        }
    };
</script>
