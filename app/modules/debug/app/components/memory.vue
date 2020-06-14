<template>
    <li>
        <a title="Memory"><span class="pf-icon pf-icon-memory"></span>{{ data.peak_usage_str }}</a>
    </li>
</template>

<script>
    export default {
        section: {
            priority: 40
        },

        props: ['data']
    };
</script>
