const UserProfile = {
    el: '#user-profile',

    data: window.$data,

    methods: {
        save() {
            this.$http.post('user/profile/save', {user: this.user}).then(function () {
                        this.$notify('Profile Updated', 'success');
                    }, function (res) {
                        this.$notify(res.data, 'danger');
                    }
                );
        }
    }
};

Vue.ready(UserProfile);
