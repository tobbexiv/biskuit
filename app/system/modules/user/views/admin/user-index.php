<?php $view->script('user-index', 'system/user:app/bundle/user-index.js', 'vue') ?>

<div id="users" v-cloak>
    <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" uk-margin>
        <div class="uk-flex uk-flex-middle uk-flex-wrap" uk-margin>
            <h3 class="uk-margin-remove" v-if="!selected.length">{{ '{0} %count% Users|{1} %count% User|]1,Inf[ %count% Users' | transChoice(count, {count:count}) }}</h3>

            <template v-else>
                <h3 class="uk-margin-remove">{{ '{1} %count% User selected|]1,Inf[ %count% Users selected' | transChoice(selected.length, {count:selected.length}) }}</h3>
                <div class="uk-margin-left">
                    <ul class="uk-iconnav">
                        <li><a :uk-tooltip="$trans('Activate')" @click="status(1)"><span uk-icon="check"></span></a></li>
                        <li><a :uk-tooltip="$trans('Block')" @click="status(0)"><span uk-icon="ban"></span></a></li>
                        <li><a :uk-tooltip="$trans('Delete')" @click.prevent="remove" v-confirm="'Delete users?'"><span uk-icon="trash"></span></a></li>
                    </ul>
                </div>
            </template>

            <hr class="uk-divider-vertical bk-divider-vertical" />

            <form class="uk-search uk-search-navbar">
              <span uk-search-icon></span>
              <input class="uk-search-input" type="search" v-model="searchString">
            </form>
        </div>
        <div uk-margin>
            <a class="uk-button uk-button-primary" :href="$url.route('admin/user/edit')">{{ 'Add User' | trans }}</a>
        </div>
    </div>

    <div class="uk-overflow-auto">
        <table class="uk-table uk-table-divider uk-table-hover uk-table-middle">
            <thead>
                <tr>
                    <th class="uk-table-shrink"><input class="uk-checkbox" type="checkbox" v-check-all:users.number="{ watchedElementsSelector: 'input[name=id]', statusStorageSelector: 'selected' }"></th>
                    <th colspan="2" v-order:username="config.filter.order">
                        {{ 'User' | trans }}
                    </th>
                    <th class="bk-table-width-100 uk-text-center">
                        <input-filter :title="$trans('Status')" :options="statuses" v-model="config.filter.status"></input-filter>
                    </th>
                    <th class="bk-table-width-200" v-order:email="config.filter.order">
                        {{ 'Email' | trans }}
                    </th>
                    <th class="bk-table-width-100">
                        <input-filter :title="$trans('Roles')" :options="roles" v-model="config.filter.role"></input-filter>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="check-item" v-for="user in users" :class="{'uk-active': active(user)}" :id="'user_' + user.id">
                    <td><input class="uk-checkbox" type="checkbox" name="id" :value="user.id" v-model="selected"></td>
                    <td class="uk-table-shrink uk-preserve-width">
                        <img class="uk-border-circle" width="40" height="40" :alt="user.name" v-gravatar="user.email">
                    </td>
                    <td class="uk-text-nowrap">
                        <a :href="$url.route('admin/user/edit', { id: user.id })">{{ user.username }}</a>
                        <div class="uk-text-muted">{{ user.name }}</div>
                    </td>
                    <td class="uk-text-center">
                      <a :title="user.statusText" @click="toggleStatus(user)">
                        <span v-if="user.status && user.login" uk-icon="check"></span>
                        <span v-if="user.status && !user.login">(<span uk-icon="check"></span>)</span>
                        <span v-if="!user.status" uk-icon="ban"></span>
                      </a>
                    </td>
                    <td>
                        <a :href="'mailto:'+user.email">{{ user.email }}</a> <span uk-icon="check" :uk-tooltip="$trans('Verified Email Address')" v-if="showVerified(user)"></i>
                    </td>
                    <td>
                        {{ showRoles(user) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <h3 class="uk-h1 uk-text-muted uk-text-center" v-show="users && !users.length">{{ 'No user found.' | trans }}</h3>

    <v-pagination :pages="pages" v-model="config.page" v-show="pages > 1 || config.page > 0"></v-pagination>
</div>
