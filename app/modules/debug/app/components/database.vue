<template>
    <li>
        <a title="Database" class="pf-parent"><span class="pf-icon pf-icon-database"></span>{{ data.nb_statements }}</a>
        <div class="pf-dropdown">
            <table class="pf-table pf-table-dropdown">
                <tbody>
                <tr>
                    <td>Queries</td>
                    <td>{{ data.nb_statements }}</td>
                </tr>
                <tr>
                    <td>Time</td>
                    <td>{{ data.accumulated_duration_str }}</td>
                </tr>
                <tr>
                    <td>Driver</td>
                    <td>{{ data.driver }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </li>
</template>

<script>
    export default {
        section: {
            priority: 50,
            panel: `
                <div id="panel-database">
                    <h1>Queries</h1>

                    <p v-show="!nb_statements">
                        <em>No queries.</em>
                    </p>

                    <div v-for="statement in statements">
                        <pre><code>{{ statement.sql }}</code></pre>
                        <p class="pf-submenu">
                            <span>{{ statement.duration_str }}</span>
                            <span>{{ statement.params }}</span>
                        </p>
                    </div>
                </div>`
        },

        props: ['data']
    };
</script>
