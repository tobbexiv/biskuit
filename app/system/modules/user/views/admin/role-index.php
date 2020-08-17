<?php $view->script('role-index', 'system/user:app/bundle/role-index.js', 'vue') ?>

<div id="roles" class="uk-form" v-cloak>
    <div class="uk-grid pk-grid-large" data-uk-grid-margin>
        <div class="pk-width-sidebar">
            <div class="uk-panel">

                <ul class="uk-sortable uk-nav uk-nav-side" data-uk-sortable="{dragCustomClass:'pk-sortable-dragged-list'}">
                    <li :id="role.id" class="uk-visible-toggle" v-for="role in orderedRoles" :class="{'uk-active': current.id === role.id}" :key="role.id">
                        <ul class="uk-subnav pk-subnav-icon uk-hidden" v-if="!role.locked">
                            <li><a class="pk-icon-edit pk-icon-hover" :title="$trans('Edit')" data-uk-tooltip="{delay: 500}" @click="edit(role)"></a></li>
                            <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click="remove(role)" v-confirm="'Delete role?'"></a></li>
                        </ul>
                        <a @click.prevent="config.role = role.id">{{ role.name }}</a>
                    </li>
                </ul>

                <p>
                    <a class="uk-button" @click.prevent="edit()">{{ 'Add Role' | trans }}</a>
                </p>
            </div>
        </div>
        <div class="pk-width-content">
            <h2>{{ current.name }}</h2>

            <div class="uk-overflow-container uk-margin-large" v-for="(group, groupKey) in permissions" :key="groupKey">
                <table class="uk-table uk-table-hover uk-table-middle">
                    <thead>
                        <tr>
                            <th class="pk-table-min-width-200">{{ groupKey }}</th>
                            <th class="bk-table-width-minimum"></th>
                            <th class="bk-table-width-minimum"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(permission, permissionKey) in group" :class="{'uk-visible-hover-inline': permission.trusted}">
                            <td class="pk-table-text-break">
                                <span :title="$trans(permission.description)" data-uk-tooltip="{pos:'top-left'}">{{ permission.title | trans }}</span>
                            </td>
                            <td>
                                <i class="pk-icon-warning uk-invisible" :title="$trans('Grant this permission to trusted roles only to avoid security implications.')" data-uk-tooltip v-if="permission.trusted"></i>
                            </td>
                            <td class="uk-text-center">
                                <span class="uk-position-relative" v-if="showFakeCheckbox(current, permissionKey)">
                                    <input type="checkbox" checked disabled>
                                    <span class="uk-position-cover" v-if="!current.administrator" @click="addPermission(current, permissionKey)" @click="savePermissions(current)"></span>
                                </span>

                                <input type="checkbox" :value="permissionKey" v-else v-model="current.permissions" @click="savePermissions(current)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <v-modal ref="modal">
        <validation-observer v-slot="{ handleSubmit }" slim>
            <form class="uk-form uk-form-stacked" @submit.prevent="handleSubmit(save)">
                <div class="uk-modal-header">
                    <h2>{{ (role.id ? 'Edit Role':'Add Role') | trans }}</h2>
                </div>

                <v-validated-input
                    id="form-name"
                    name="name"
                    rules="required"
                    label="Name"
                    :error-messages="{ required: 'Name cannot be blank.' }"
                    :options="{ elementClass: 'uk-width-1-1 uk-form-large' }"
                    v-model="role.name">
                </v-validated-input>

                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                    <button class="uk-button uk-button-link" type="submit">{{ 'Save' | trans }}</button>
                </div>
            </form>
        </validation-observer>
    </v-modal>
</div>
