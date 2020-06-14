<template>
    <a :class="link.class" :href="link.link" @click.prevent="$parent.links.callback(link)"><span v-html="link.txt" v-if="link.txt"></span><span v-else>{{ 'Select Link' | trans }}</span> <span class="pk-icon-link pk-icon-hover"></span></a>
</template>

<script>
    export default {
        props: ['index'],

        computed: {
            link() {
                return this.$parent.links.data[this.index] || {};
            }
        }
    };
</script>
