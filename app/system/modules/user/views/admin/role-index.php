<?php $view->script('role-index', 'system/user:app/bundle/role-index.js', 'vue') ?>

<div id="roles" v-cloak>
    <div class="uk-grid" uk-grid-margin>
        <div class="uk-first-column bk-sidebar bk-sidebar-small">
            <div class="uk-panel">

                <ul class="uk-tab uk-tab-left uk-sortable" uk-sortable="handle: .uk-sortable-handle; cls-custom: uk-text-uppercase">
                    <li :id="role.id" class="uk-visible-toggle" v-for="role in orderedRoles" :class="{'uk-active': current.id === role.id}" :key="role.id">
                        <a class="uk-sortable-handle uk-position-relative" @click.prevent="config.role = role.id">{{ role.name }}</a>
                        <ul class="uk-invisible-hover uk-iconnav uk-position-center-right uk-margin-small-right" v-if="!role.locked">
                            <li><a class="uk-icon-link" uk-icon="file-edit" :uk-tooltip="$trans('Edit')" @click="edit(role)"></a></li>
                            <li><a class="uk-icon-link" uk-icon="trash" :uk-tooltip="$trans('Delete')" @click="remove(role)" v-confirm="'Delete role?'"></a></li>
                        </ul>
                    </li>
                </ul>

                <p>
                    <a class="uk-button uk-button-default" @click.prevent="edit()">{{ 'Add Role' | trans }}</a>
                </p>
            </div>
        </div>
        <div class="uk-width-expand">
            <h2>{{ current.name }}</h2>

            <div class="uk-overflow-auto uk-margin" v-for="(group, groupKey) in permissions" :key="groupKey">
                <table class="uk-table uk-table-hover uk-table-divider uk-table-middle">
                    <thead>
                        <tr>
                            <th class="bk-table-min-width-200">{{ groupKey }}</th>
                            <th class="bk-table-width-minimum"></th>
                            <th class="bk-table-width-minimum"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(permission, permissionKey) in group" :class="{'uk-visible-toggle': permission.trusted}">
                            <td>
                                <span :uk-tooltip="$trans(permission.description)" data-uk-tooltip="{pos:'top-left'}">{{ permission.title | trans }}</span>
                            </td>
                            <td class="uk-preserve-width">
                                <span class="uk-invisible-hover uk-text-danger" uk-icon="warning" :uk-tooltip="$trans('Grant this permission to trusted roles only to avoid security implications.')" v-if="permission.trusted"></span>
                            </td>
                            <td class="uk-text-center">
                                <span class="uk-position-relative" v-if="showFakeCheckbox(current, permissionKey)">
                                    <input class="uk-checkbox" type="checkbox" checked disabled>
                                    <span class="uk-position-cover" v-if="!current.administrator" @click="addPermission(current, permissionKey)" @click="savePermissions(current)"></span>
                                </span>

                                <input class="uk-checkbox" type="checkbox" :value="permissionKey" v-else v-model="current.permissions" @click="savePermissions(current)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <v-modal ref="modal">
        <template #header>
            <h2 class="uk-modal-title">{{ (role.id ? 'Edit Role':'Add Role') | trans }}</h2>
        </template>

        <form class="uk-form uk-form-stacked" @submit.prevent="handleSubmit(save)">
            <v-validated-input
                id="form-name"
                name="name"
                rules="required"
                label="Name"
                :error-messages="{ required: 'Name cannot be blank.' }"
                :options="{ elementClass: 'uk-width-1-1 uk-form-large' }"
                v-model="role.name">
            </v-validated-input>
        </form>

        <template #footer="{ validationObserver }">
            <button class="uk-button uk-button-link uk-modal-close">{{ 'Cancel' | trans }}</button>
            <button class="uk-button uk-button-primary" @click.prevent="validationObserver.handleSubmit(save)">{{ 'Save' | trans }}</button>
        </template>
    </v-modal>
</div>
