<?php $view->script('post-edit', 'blog:app/bundle/post-edit.js', ['vue', 'editor', 'uikit']) ?>

<validation-observer id="post" v-slot="{ handleSubmit }" slim>
    <form class="uk-form" @submit.prevent="handleSubmit(save)" v-cloak>
        <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
            <div data-uk-margin>
                <h2 class="uk-margin-remove" v-if="post.id">{{ 'Edit Post' | trans }}</h2>
                <h2 class="uk-margin-remove" v-else>{{ 'Add Post' | trans }}</h2>
            </div>
            <div data-uk-margin>
                <a class="uk-button uk-margin-small-right" :href="$url.route('admin/blog/post')">{{ post.id ? 'Close' : 'Cancel' | trans }}</a>
                <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
            </div>
        </div>

        <ul class="uk-tab" ref="tab" v-show="sections.length > 1">
            <li v-for="section in sections"><a>{{ section.label | trans }}</a></li>
        </ul>

        <div class="uk-switcher uk-margin" ref="content">
            <div v-for="section in sections">
                <component :is="section.name" :data="data" v-model="post"></component>
            </div>
        </div>
    </form>
</validation-observer>
