<template>
    <div class="uk-margin">
        <label for="form-link-page" class="uk-form-label">{{ 'View' | trans }}</label>
        <div class="uk-form-controls">
            <select id="form-link-page" class="uk-width-1-1" v-model="page">
                <option v-for="p in pages" :value="p.id" :key="p.id">{{ p.title }}</option>
            </select>
        </div>
    </div>
</template>

<script>
    const LinkPage = {
        link: {
            label: 'Page'
        },

        data() {
            return {
                pages: [],
                page: ''
            }
        },

        created() {
            //TODO don't retrieve entire page objects
            this.$http.get('api/site/page').then(function (res) {
                this.pages = res.data;
                if (this.pages.length) {
                    this.page = this.pages[0].id;
                }
            });
        },

        watch: {
            page: function (page) {
                this.$emit('input', '@page/' + page);
            }
        }
    };

    export default LinkPage;

    window.Links.default.components['link-page'] = LinkPage;
</script>
