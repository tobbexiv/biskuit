<template>
    <div class="uk-form-row">
        <label for="form-link-user" class="uk-form-label">{{ 'View' | trans }}</label>
        <div class="uk-form-controls">
            <select id="form-link-user" class="uk-width-1-1" v-model="innerLink">
                <option value="@user/login">{{ 'User Login' | trans }}</option>
                <option value="@user/logout">{{ 'User Logout' | trans }}</option>
                <option value="@user/registration">{{ 'User Registration' | trans }}</option>
                <option value="@user/profile">{{ 'User Profile' | trans }}</option>
                <option value="@user/resetpassword">{{ 'User Password Reset' | trans }}</option>
            </select>
        </div>
    </div>
</template>

<script>
    const LinkUser = {
        link: {
            label: 'User'
        },

        data() {
            return {
                innerLink: ''
            };
        },

        mounted() {
            this.innerLink = '@user/login';
        },

        watch: {
            innerLink(link) {
                this.$emit('input', link);
            }
        }
    };

    export default LinkUser;

    window.Links.default.components['link-user'] = LinkUser;
</script>
