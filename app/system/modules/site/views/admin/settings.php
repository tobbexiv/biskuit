<?php $view->script('site-settings', 'system/site:app/bundle/settings.js', ['vue', 'editor']) ?>

<validation-observer id="settings" v-slot="{ handleSubmit }" slim>
    <form class="uk-form uk-form-horizontal" @submit.prevent="handleSubmit(save)" v-cloak>
        <div class="uk-grid pk-grid-large" data-uk-grid-margin>
            <div class="pk-width-sidebar">
                <div class="uk-panel">
                    <ul class="uk-nav uk-nav-side pk-nav-large" ref="tab">
                        <li :class="{'uk-active': section.active}" v-for="section in sections"><a><i :class="`uk-icon-justify uk-icon-small uk-margin-right ${section.icon}`"></i> {{ section.label | trans }}</a></li>
                    </ul>
                </div>
            </div>
            <div class="pk-width-content">
                <ul class="uk-switcher uk-margin" ref="content">
                    <li v-for="section in sections">
                        <component :is="section.name" v-model="config"></component>
                    </li>
                </ul>
            </div>
        </div>
    </form>
</validation-observer>
