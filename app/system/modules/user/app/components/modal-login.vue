<template>
    <div>
        <v-modal ref="login">
            <div class="uk-text-center">
                <img class="uk-margin" :src="$url('app/system/assets/images/biskuit-logo-text-black.svg')" alt="Biskuit">
                <p class="uk-text-danger">{{ 'Session expired. Please log in again.' | trans }}</p>

                <form class="uk-form tm-form" @submit.prevent="login" ref="loginForm">
                    <div class="uk-panel uk-card">
                        <div class="uk-margin">
                            <input class="uk-form-large uk-width-1-1" type="text" name="credentials[username]" :placeholder="$trans('Username')" autofocus v-model="credentials.username">
                        </div>

                        <div class="uk-margin">
                            <input class="uk-form-large uk-width-1-1" type="password" name="credentials[password]" :placeholder="$trans('Password')" v-model="credentials.password" ref="password">
                        </div>

                        <p class="uk-margin tm-panel-marginless-bottom">
                            <button class="uk-button uk-button-primary uk-button-large uk-width-1-1">{{ 'Login' | trans }}</button>
                        </p>
                    </div>

                    <p>
                        <label class="uk-form"><input type="checkbox" v-model="remember"> {{ 'Remember Me' | trans }}</label>
                    </p>
                </form>
            </div>
        </v-modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                credentials: {},
                remember: false
            };
        },

        created() {
            this.$mount();//.$appendTo('body');
            this.promise = this.$promise(function (fulfill, reject) {
                this.fulfill = fulfill;
                this.reject = reject;
            });
        },

        mounted() {
            const vm = this;

            this.$refs.login.open();
            this.$refs.login.modal.on('hide.uk.modal', function () {
                vm.reject();
                vm.$destroy();
            });
        },

        methods: {
            login() {
                const login = function () {
                    return this.$http.post('user/authenticate', {
                        credentials: this.credentials,
                        _remember_me: this.remember
                    }, { headers: { 'X-LOGIN': 'true' } });
                }.bind(this);

                login().then(null, function (res) {
                    if (res.data.csrf) {
                        this.$cache.set('_csrf', res.data.csrf);
                        this.$cache.set('_session', window.$biskuit.csrf);
                        this.$session.flush();

                        return login();
                    }

                    return Vue.Promise.reject(res);
                }).then(function (res) {
                    this.$cache.set('_csrf', res.data.csrf);
                    this.fulfill();
                    this.$refs.login.close();
                }, function (res) {
                    this.$notify(res.data, 'danger');
                    this.$refs.loginForm.classList.remove('uk-animation-shake');
                    this.$nextTick(function () {
                        this.$refs.loginForm.classList.add('uk-animation-shake');
                    });
                    this.$refs.password.focus();
                });
            }
        }
    };
</script>
