<?php $view->script('user-edit', 'system/user:app/bundle/user-edit.js', ['vue']) ?>

<validation-observer id="user-edit" v-slot="{ handleSubmit }" slim>
    <form class="uk-form-horizontal" @submit.prevent="handleSubmit(save)" v-cloak>
        <div class="uk-flex uk-flex-between uk-flex-wrap" uk-margin>
            <div uk-margin>
                <h2 class="uk-margin-remove" v-if="user.id">{{ 'Edit User' | trans }}</h2>
                <h2 class="uk-margin-remove" v-else>{{ 'Add User' | trans }}</h2>
            </div>
            <div uk-margin>
                <a class="uk-button uk-button-default uk-margin-small-right" :href="$url.route('admin/user')">{{ user.id ? 'Close' : 'Cancel' | trans }}</a>
                <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
            </div>
        </div>
        <ul uk-tab v-show="sections.length > 1">
          <li v-for="section in sections"><a>{{ section.label | trans }}</a></li>
        </ul>

        <div class="uk-switcher uk-margin">
            <div v-for="section in sections">
                <component :is="section.name" :config="config" v-model="user"></component>
            </div>
        </div>
    </form>
</validation-observer>
