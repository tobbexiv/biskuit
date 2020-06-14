<?php $view->script('permission-index', 'system/user:app/bundle/permission-index.js', 'vue') ?>

<div id="permissions" class="uk-form" v-cloak>

    <h2>{{ 'Permissions' | trans }}</h2>

    <div :id="groupKey" class="uk-overflow-container uk-margin-large" v-for="(group, groupKey) in permissions" :key="groupKey">
        <table class="uk-table uk-table-hover uk-table-middle">
            <thead>
                <tr>
                    <th class="pk-table-min-width-200">{{ groupKey }}</th>
                    <th class="pk-table-width-minimum"></th>
                    <th class="pk-table-width-minimum pk-table-max-width-100 uk-text-truncate uk-text-center" v-for="r in roles">{{ r.name }}</th>
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
                    <td class="uk-text-center" v-for="role in roles">

                        <span class="uk-position-relative" v-if="showFakeCheckbox(role, permissionKey)">
                            <input type="checkbox" checked disabled>
                            <span class="uk-position-cover" v-if="!role.administrator" @click="addPermission(role, permissionKey)" @click="savePermissions(role)"></span>
                        </span>

                        <input type="checkbox" :value="permissionKey" v-else v-model="role.permissions" @click="savePermissions(role)">
                    </td>
                </tr>
            </tbody>
        </table>

    </div>

</div>
