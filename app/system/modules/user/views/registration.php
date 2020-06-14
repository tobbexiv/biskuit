<?php $view->script('registration', 'system/user:app/bundle/registration.js', ['vue', 'uikit-form-password']) ?>

<validation-observer id="user-registration" v-slot="{ handleSubmit }" slim>
    <form class="pk-user pk-user-registration uk-form uk-form-stacked uk-width-medium-1-2 uk-width-large-1-3 uk-container-center" @submit.prevent="handleSubmit(save)">
        <h4 class="uk-text-center"><?= __('Create an account') ?></h4>
        <div class="uk-alert uk-alert-danger" v-show="error">{{ error }}</div>

        <div class="uk-text-center uk-grid-small" uk-grid>
            <v-validated-input
                id="form-username"
                name="username"
                :rules="{ required: true, min: 3, regex: /^[a-zA-Z0-9._\-]{3,}$/ }"
                placeholder="<?= __('Username') ?>"
                :error-messages="{ required: 'Username cannot be blank.', min: 'Username must be at least 3 charaters long.', regex: 'Username can only contain alphanumeric characters (A-Z, 0-9) and some special characters (._-)' }"
                :options="{ wrapperClass: 'uk-width-1-2@s', innerWrapperClass: '' }"
                v-model="user.username">
            </v-validated-input>

            <v-validated-input
                id="form-name"
                name="name"
                rules="required"
                placeholder="<?= __('Name') ?>"
                :error-messages="{ required: 'Name cannot be blank.' }"
                :options="{ wrapperClass: 'uk-width-1-2@s', innerWrapperClass: '' }"
                v-model="user.name">
            </v-validated-input>

            <v-validated-input
                id="form-email"
                name="email"
                type="email"
                rules="required|email"
                placeholder="<?= __('Email') ?>"
                :error-messages="{ required: 'Email cannot be blank.', email: 'Field must be a valid email address.' }"
                :options="{ wrapperClass: 'uk-width-1-2@s', innerWrapperClass: '' }"
                v-model.lazy="user.email">
            </v-validated-input>

            <v-validated-input
                id="form-password"
                name="password"
                type="password"
                :rules="{ required: true, min: 6 }"
                placeholder="<?= __('Current Password') ?>"
                :error-messages="{ required: 'Password cannot be blank.', min: 'Password must be at least 6 characters long.' }"
                :options="{ wrapperClass: 'uk-width-1-2@s', innerWrapperClass: '' }"
                v-model="user.password">
            </v-validated-input>

            <div class="uk-margin">
                <button class="uk-button uk-button-primary" type="submit"><?= __('Sign up') ?></button>
            </div>
        </div>

        <p class="uk-text-center"><?= __('Already have an account?') ?> <a href="<?= $view->url('@user/login') ?>"><?= __('Login!') ?></a></p>
    </form>
</validation-observer>
