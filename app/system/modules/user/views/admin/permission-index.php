<?php $view->script('permission-index', 'system/user:app/bundle/permission-index.js', 'vue') ?>

<div id="permissions" v-cloak>

    <h2>{{ 'Permissions' | trans }}</h2>

    <div :id="groupKey" class="uk-overflow-auto uk-margin" v-for="(group, groupKey) in permissions" :key="groupKey">
        <table class="uk-table uk-table-hover uk-table-divider uk-table-middle">
            <thead>
                <tr>
                    <th class="bk-table-min-width-200">{{ groupKey }}</th>
                    <th class="uk-table-shrink"></th>
                    <th class="uk-table-shrink bk-table-max-width-100 uk-text-nowrap uk-text-center" v-for="r in roles">{{ r.name }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(permission, permissionKey) in group" :class="{'uk-visible-toggle': permission.trusted}">
                    <td>
                        <span :uk-tooltip="$trans(permission.description)">{{ permission.title | trans }}</span>
                    </td>
                    <td class="uk-preserve-width">
                        <span class="uk-invisible-hover uk-text-danger" uk-icon="warning" :uk-tooltip="$trans('Grant this permission to trusted roles only to avoid security implications.')" v-if="permission.trusted"></span>
                    </td>
                    <td class="uk-text-center" v-for="role in roles">

                        <span class="uk-position-relative" v-if="showFakeCheckbox(role, permissionKey)">
                            <input class="uk-checkbox" type="checkbox" checked disabled>
                            <span class="uk-position-cover" v-if="!role.administrator" @click="addPermission(role, permissionKey)" @click="savePermissions(role)"></span>
                        </span>

                        <input class="uk-checkbox" type="checkbox" :value="permissionKey" v-else v-model="role.permissions" @click="savePermissions(role)">
                    </td>
                </tr>
            </tbody>
        </table>

    </div>

</div>
