<?php $view->script('widget-edit', 'system/widget:app/bundle/edit.js', ['widgets', 'editor', 'input-tree']) ?>

<validation-observer id="widget-edit" v-slot="{ handleSubmit }" slim>
    <form class="uk-form" @submit.prevent="handleSubmit(save)" v-cloak>
        <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
            <div data-uk-margin>
                <h2 class="uk-margin-remove" v-if="widget.id">{{ 'Edit Widget' | trans }}</h2>
                <h2 class="uk-margin-remove" v-else>{{ 'Add Widget' | trans }}</h2>
            </div>
            <div data-uk-margin>
                <a class="uk-button uk-margin-small-right" href="<?= $view->url('@site/widget') ?>">{{ widget.title ? 'Close' : 'Cancel' | trans }}</a>
                <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
            </div>
        </div>

        <ul class="uk-tab" ref="tab" v-show="sections.length > 1">
            <li v-for="section in sections"><a>{{ section.label | trans }}</a></li>
        </ul>

        <div class="uk-switcher uk-margin-large-top" ref="content">
            <div v-for="section in sections">
                <component :is="section.name" :config="config" v-model="widget"></component>
            </div>
        </div>
    </form>
</validation-observer>
