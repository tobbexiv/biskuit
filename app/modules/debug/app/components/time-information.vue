<template>
    <li>
        <a title="Time"><span class="pf-icon pf-icon-time"></span>{{ data.duration_str }}</a>
    </li>
</template>

<script>
    export default {
        section: {
            priority: 30
        },

        props: ['data']
    };
</script>
