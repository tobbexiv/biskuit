<?php $view->script('settings', 'app/system/modules/settings/app/bundle/settings.js', ['vue', 'uikit']) ?>

<form id="settings" class="uk-form uk-form-horizontal" @submit.prevent="save" v-cloak>

    <div class="uk-grid pk-grid-large" data-uk-grid-margin>
        <div class="pk-width-sidebar">

            <div class="uk-panel">

                <ul class="uk-nav uk-nav-side pk-nav-large" ref="tab">
                    <li v-for="section in sections" :key="section.name"><a><i :class="'uk-icon-justify uk-icon-small uk-margin-right ' + section.icon"></i> {{ section.label | trans }}</a></li>
                </ul>

            </div>

        </div>
        <div class="pk-width-content">

            <ul class="uk-switcher uk-margin" ref="content">
                <li v-for="section in sections" :key="section.name">
                    <component :is="section.name" :config="config[getBackendName(section.name)]" :options="options[getBackendName(section.name)]"></component>
                </li>
            </ul>

        </div>
    </div>

</form>
