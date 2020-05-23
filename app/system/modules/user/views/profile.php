<?php $view->script('profile', 'system/user:app/bundle/profile.js', ['vue', 'uikit-form-password']) ?>

<validation-observer id="user-profile" v-slot="{ handleSubmit }" slim>
    <form class="pk-user pk-user-profile uk-form uk-form-stacked uk-width-medium-1-2 uk-width-large-1-3 uk-container-center" @submit.prevent="handleSubmit(save)">
        <h1 class="uk-h2 uk-text-center">{{ 'Your Profile' | trans }}</h1>

        <v-validated-input
            id="form-name"
            name="name"
            rules="required"
            placeholder="<?= __('Name') ?>"
            :error-messages="{ required: 'Name cannot be blank.' }"
            :options="{ innerWrapperClass: '' }"
            v-model="user.name">
        </v-validated-input>

        <v-validated-input
            id="form-email"
            name="email"
            type="email"
            rules="required|email"
            placeholder="<?= __('Email') ?>"
            :error-messages="{ required: 'Email cannot be blank.', email: 'Field must be a valid email address.' }"
            :options="{ innerWrapperClass: '' }"
            v-model.lazy="user.email">
        </v-validated-input>

        <div class="uk-form-row">
            <a href="#" data-uk-toggle="{ target: '.js-password' }">{{ 'Change password' | trans }}</a>
        </div>

        <v-validated-input
            id="form-password-old"
            name="password-old"
            type="password"
            placeholder="<?= __('Current Password') ?>"
            :options="{ wrapperClass: 'uk-form-row js-password uk-hidden', innerWrapperClass: '' }"
            v-model="user.password_old">
        </v-validated-input>

        <v-validated-input
            id="form-password-new"
            name="password-new"
            type="password"
            placeholder="<?= __('New Password') ?>"
            :options="{ wrapperClass: 'uk-form-row js-password uk-hidden', innerWrapperClass: '' }"
            v-model="user.password_new">
        </v-validated-input>

        <p class="uk-form-row">
            <button class="uk-button uk-button-primary uk-button-large uk-width-1-1" type="submit">{{ 'Save' | trans }}</button>
        </p>
    </form>
</validation-observer>
