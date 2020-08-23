<?php $view->script('post-edit', 'blog:app/bundle/post-edit.js', ['vue', 'editor', 'uikit']) ?>

<validation-observer id="post" v-slot="{ handleSubmit }" slim>
  <form class="uk-form" @submit.prevent="handleSubmit(save)" v-cloak>
    <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" data-uk-margin>
      <div data-uk-margin>
        <h3 class="uk-margin-remove" v-if="post.id">{{ 'Edit Post' | trans }}</h3>
        <h3 class="uk-margin-remove" v-else>{{ 'Add Post' | trans }}</h3>
      </div>
      <div data-uk-margin>
        <a class="uk-button uk-margin-small-right" :href="$url.route('admin/blog/post')">{{ post.id ? 'Close' : 'Cancel' | trans }}</a>
        <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
      </div>
    </div>

    <ul uk-tab v-show="sections.length > 1">
      <li v-for="section in sections"><a>{{ section.label | trans }}</a></li>
    </ul>

    <ul class="uk-switcher uk-margin">
      <li v-for="section in sections">
        <component :is="section.name" :data="data" v-model="post"></component>
      </li>
    </ul>
  </form>
</validation-observer>
