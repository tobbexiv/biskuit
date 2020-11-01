<?php $view->script('post-index', 'blog:app/bundle/post-index.js', 'vue') ?>

<div id="post" v-cloak>
  <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" uk-margin>
    <div class="uk-flex uk-flex-middle uk-flex-wrap" uk-margin>
      <h3 class="uk-margin-remove" v-if="!selected.length">{{ '{0} %count% Posts|{1} %count% Post|]1,Inf[ %count% Posts' | transChoice(count, {count:count}) }}</h3>

      <template v-else>
        <h3 class="uk-margin-remove">{{ '{1} %count% Post selected|]1,Inf[ %count% Posts selected' | transChoice(selected.length, {count:selected.length}) }}</h3>

        <div class="uk-margin-left" >
          <ul class="uk-iconnav">
            <li><a title="Publish" data-uk-tooltip="{delay: 500}" @click="status(2)"><span uk-icon="check"></span></a></li>
            <li><a title="Unpublish" data-uk-tooltip="{delay: 500}" @click="status(3)"><span uk-icon="close"></span></a></li>
            <li><a title="Copy" data-uk-tooltip="{delay: 500}" @click="copy"><span uk-icon="copy"></span></a></li>
            <li><a title="Delete" data-uk-tooltip="{delay: 500}" @click="remove" v-confirm="'Delete Posts?'"><span uk-icon="trash"></span></a></li>
          </ul>
        </div>
      </template>

      <form class="uk-search uk-search-navbar uk-margin-left">
        <span uk-search-icon></span>
        <input class="uk-search-input" type="search" v-model="searchString">
      </form>

    </div>
    <div uk-margin>
      <a class="uk-button uk-button-primary" :href="$url.route('admin/blog/post/edit')">{{ 'Add Post' | trans }}</a>
    </div>
  </div>

  <div class="uk-overflow-auto">
    <table class="uk-table uk-table-divider uk-table-hover">
      <thead>
      <tr>
        <th class="bk-table-width-minimum"><input class="uk-checkbox" type="checkbox" v-check-all:posts.number="{ watchedElementsSelector: 'input[name=id]', statusStorageSelector: 'selected' }"></th>
        <th class="bk-table-min-width-300" v-order:title="config.filter.order">{{ 'Title' | trans }}</th>
        <th class="bk-table-width-100 uk-text-center">
          <input-filter :title="$trans('Status')" :options="statusOptions" v-model="config.filter.status"></input-filter>
        </th>
        <th class="bk-table-width-200">
          <span v-if="!canEditAll">{{ 'Author' | trans }}</span>
          <input-filter :title="$trans('Author')" :options="authorOptions" v-model="config.filter.author" v-else></input-filter>
        </th>
        <th class="uk-text-center" v-order:comment_count="config.filter.order">{{ 'Comments' | trans }}</th>
        <th v-order:date="config.filter.order">{{ 'Date' | trans }}</th>
        <th>{{ 'URL' | trans }}</th>
      </tr>
      </thead>
      <tbody>
      <tr class="check-item" v-for="post in posts" :class="{'uk-active': active(post)}">
        <td><input class="uk-checkbox" type="checkbox" name="id" :value="post.id" v-model="selected"></td>
        <td>
          <a :href="$url.route('admin/blog/post/edit', { id: post.id })">{{ post.title }}</a>
        </td>
        <td class="uk-text-center">
          <a :title="getStatusText(post)" @click="toggleStatus(post)">
            <span v-if="post.status == 0" uk-icon="check"></span>
            <span v-if="post.status == 1" uk-icon="warning"></span>
            <span v-if="post.status == 2 && post.published" uk-icon="pencil"></span>
            <span v-if="post.status == 3" uk-icon="close"></span>
            <span v-if="post.status == 2 && !post.published" uk-icon="calendar"></span>
          </a>
        </td>
        <td>
          <a :href="$url.route('admin/user/edit', { id: post.user_id })">{{ post.author }}</a>
        </td>
        <td class="uk-text-center">
          <a class="uk-text-nowrap uk-link-muted" :class="{'pk-link-icon': !post.comments_pending}" :href="$url.route('admin/blog/comment', { post: post.id })" :title="$transChoice('{0} No pending|{1} One pending|]1,Inf[ %comments% pending', post.comments_pending, {comments:post.comments_pending})" data-uk-tooltip>
            <span uk-icon="comment"></span> {{ post.comment_count }}</a>
        </td>
        <td>
          {{ post.date | date }}
        </td>
        <td class="uk-table-text-break">
          <a target="_blank" v-if="post.accessible && post.url" :href="$url.route(post.url.substr(1))">{{ decodeURI(post.url) }}</a>
          <span v-if="!post.accessible && post.url">{{ decodeURI(post.url) }}</span>
          <span v-if="!post.url">{{ 'Disabled' | trans }}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <h3 class="uk-h3 uk-text-muted uk-text-center" v-show="posts && !posts.length">{{ 'No posts found.' | trans }}</h3>

  <v-pagination v-model="config.page" :pages="pages" v-show="pages > 1 || config.page > 0"></v-pagination>

</div>
