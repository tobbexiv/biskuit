<template>
    <li>
        <a title="System Information"><div class="pf-icon-large pf-icon-biskuit"></div></a>
    </li>
</template>

<script>
    export default {
        section: {
            priority: 10,
            panel: `
                <div id="panel-system">
                    <h1>Information</h1>

                    <h2>System</h2>
                    <table class="pf-table pf-table-dropdown">
                        <tbody>
                        <tr>
                            <td>Biskuit</td>
                            <td>{{ version }}</td>
                        </tr>
                        <tr>
                            <td>Server</td>
                            <td>{{ server }}</td>
                        </tr>
                        <tr>
                            <td>Useragent</td>
                            <td>{{ useragent }}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h2>PHP</h2>
                    <table class="pf-table pf-table-dropdown">
                        <tbody>
                        <tr>
                            <td>PHP</td>
                            <td>{{ phpversion }}</td>
                        </tr>
                        <tr>
                            <td>PHP SAPI</td>
                            <td>{{ sapi_name }}</td>
                        </tr>
                        <tr>
                            <td>System</td>
                            <td>{{ php }}</td>
                        </tr>
                        <tr>
                            <td>Extensions</td>
                            <td>{{ extensions }}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h2>Database</h2>
                    <table class="pf-table pf-table-dropdown">
                        <tbody>
                        <tr>
                            <td>Driver</td>
                            <td>{{ dbdriver }}</td>
                        </tr>
                        <tr>
                            <td>Version</td>
                            <td>{{ dbversion }}</td>
                        </tr>
                        <tr>
                            <td>Client</td>
                            <td>{{ dbclient }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>`
        },

        props: ['data']
    };
</script>
