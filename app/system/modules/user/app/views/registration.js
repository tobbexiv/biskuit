const UserRegistration = {
    el: '#user-registration',

    data: {
        user: {},
        error: null
    },

    methods: {
        save() {
            this.error = null;

            this.$http.post('user/registration/register', {user: this.user}).then(function (res) {
                    window.location.replace(res.data.redirect);
            }, function (error) {
                    this.error = error.data;
                }
            );
        }
    }
};

Vue.ready(UserRegistration);
