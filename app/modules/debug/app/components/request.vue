<template>
    <li>
        <a title="Request"><span class="pf-icon pf-icon-request"></span><span class="pf-badge">200</span> @test</a>
    </li>
</template>

<script>
    export default {
        section: {
            priority: 10
        },

        props: ['data']
    };
</script>
