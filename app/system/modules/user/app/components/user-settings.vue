<template>
    <div uk-grid>
        <div class="uk-width-2-3@m uk-width-3-4@l">
            <v-validated-input
                id="form-username"
                name="username"
                :rules="{ required: true, min: 3, regex: /^[a-zA-Z0-9._\-]{3,}$/ }"
                label="Username"
                autocomplete="new-username"
                :error-messages="{ required: 'Username cannot be blank.', min: 'Username must be at least 3 charaters long.', regex: 'Username can only contain alphanumeric characters (A-Z, 0-9) and some special characters (._-)' }"
                :options="{ elementClass: 'uk-form-width-large' }"
                v-model="user.username">
            </v-validated-input>

            <v-validated-input
                id="form-name"
                name="name"
                rules="required"
                label="Name"
                autocomplete="new-name"
                :error-messages="{ required: 'Name cannot be blank.' }"
                :options="{ elementClass: 'uk-form-width-large' }"
                v-model="user.name">
            </v-validated-input>

            <v-validated-input
                id="form-email"
                name="email"
                type="email"
                rules="required|email"
                label="Email"
                autocomplete="new-email"
                :error-messages="{ required: 'Email cannot be blank.', email: 'Field must be a valid email address.' }"
                :options="{ elementClass: 'uk-form-width-large' }"
                v-model.lazy="user.email">
            </v-validated-input>

            <v-validated-input
                id="form-password"
                name="password"
                type="password"
                label="Password"
                :options="{ elementClass: 'uk-form-width-large', password: { noImmediateEdit: user.id, new: true } }"
                v-model.lazy="password">
            </v-validated-input>

            <div class="uk-margin">
                <span class="uk-form-label">{{ 'Status' | trans }}</span>
                <div class="uk-form-controls uk-form-controls-text">
                    <p class="uk-margin-small" v-for="(status, key) in config.statuses">
                        <label><input type="radio" v-model="user.status" :value="parseInt(key)" :disabled="config.currentUser == user.id"> {{ status }}</label>
                    </p>
                </div>
            </div>

            <div class="uk-margin">
                <span class="uk-form-label">{{ 'Roles' | trans }}</span>
                <div class="uk-form-controls uk-form-controls-text">
                    <p class="uk-margin-small" v-for="role in config.roles">
                        <label><input type="checkbox" :value="role.id" :disabled="role.disabled" v-model="user.roles"> {{ role.name }}</label>
                    </p>
                </div>
            </div>

            <div class="uk-margin">
                <span class="uk-form-label">{{ 'Last login' | trans }}</span>
                <div class="uk-form-controls uk-form-controls-text">
                    <p>{{ $trans('%date%', { date: user.login ? $date(user.login) : $trans('Never') }) }}</p>
                </div>
            </div>

            <div class="uk-margin">
                <span class="uk-form-label">{{ 'Registered since' | trans }}</span>
                <div class="uk-form-controls uk-form-controls-text">
                    {{ user.registered ? $trans('%date%', { date: $date(user.registered) }) : '' }}
                </div>
            </div>
        </div>

        <div class="uk-width-1-3@m uk-width-1-4@l">
            <div class="uk-panel uk-card uk-text-center" v-show="user.name">
                <div class="uk-panel-teaser">
                    <img height="280" width="280" :alt="user.name" v-gravatar="user.email">
                </div>

                <h3 class="uk-panel-tile uk-margin-remove-bottom uk-text-break">{{ user.name }}
                    <span :uk-tooltip="$trans((isNew ? 'New' : config.statuses[user.status]))">
                        <span v-if="user.status && user.login" uk-icon="check"></span>
                        <span v-if="isNew">(<span uk-icon="check"></span>)</span>
                        <span v-if="!user.status" uk-icon="ban"></span>
                    </span>
                </h3>

                <div>
                    <a class="uk-text-break" :href="'mailto:'+user.email">{{ user.email }}</a><span uk-icon="check" :title="$trans('Verified email address')" v-show="config.emailVerification && user.data.verified"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        section: {
            label: 'User'
        },

        props: ['value', 'config'],

        data() {
            return {
                password: '',
                user: this.value,
            }
        },

        computed: {
            isNew() {
                return !this.user.login && this.user.status;
            }
        },

        methods: {
            userSave(event, params) {
                params.password = this.password;
            }
        },

        watch: {
            value(newUser) {
                this.user = newUser;
            },
            user(newUser) {
                this.$emit('input', newUser);
            }
        },

        events: {
            'user:save': 'userSave'
        }
    };
</script>
