<?php $view->script('comment-index', 'blog:app/bundle/comment-index.js', 'vue') ?>

<div id="comments" v-cloak>
  <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" data-uk-margin>
    <div class="uk-flex uk-flex-middle uk-flex-wrap" data-uk-margin>
      <h3 class="uk-margin-remove" v-if="!selected.length">{{ '{0} %count% Comments|{1} %count% Comment|]1,Inf[ %count% Comments' | transChoice(count, {count:count}) }}</h3>
      <template v-else>
        <h3 class="uk-margin-remove">{{ '{1} %count% Comment selected|]1,Inf[ %count% Comments selected' | transChoice(selected.length, {count:selected.length}) }}</h3>

        <div class="uk-margin-left">
          <ul class="uk-subnav pk-subnav-icon">
            <li><a class="pk-icon-check pk-icon-hover" :title="$trans('Approve')" data-uk-tooltip="{delay: 500}" @click="status(1)"></a></li>
            <li><a class="pk-icon-block pk-icon-hover" :title="$trans('Unapprove')" data-uk-tooltip="{delay: 500}" @click="status(0)"></a></li>
            <li><a class="pk-icon-spam pk-icon-hover" :title="$trans('Mark as spam')" data-uk-tooltip="{delay: 500}" @click="status(2)"></a></li>
            <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove"></a></li>
          </ul>
          <ul class="uk-iconnav">
            <li><a :title="$trans('Approve')" data-uk-tooltip="{delay: 500}" @click="status(1)"><span uk-icon="check"></span></a></li>
            <li><a :title="$trans('Unapprove')" data-uk-tooltip="{delay: 500}" @click="status(0)"><span uk-icon="close"></span></a></li>
            <li><a :title="$trans('Mark as spam')" data-uk-tooltip="{delay: 500}" @click="status(2)"><span uk-icon="warning"></span></a></li>
            <li><a :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove"><span uk-icon="trash"></span></a></li>
          </ul>
        </div>
      </template>
      <form class="uk-search uk-search-navbar">
        <span uk-search-icon></span>
        <input class="uk-search-input" type="search" v-model="searchString">
      </form>
    </div>
  </div>

  <div class="uk-overflow-container">
    <table class="uk-table uk-table-divider uk-table-hover">
      <thead>
      <tr>
        <th class="bk-table-width-minimum"><input class="uk-checkbox" type="checkbox" v-check-all:comments.number="{ watchedElementsSelector: 'input[name=id]', statusStorageSelector: 'selected' }"></th>
        <th class="bk-table-min-width-200" colspan="2">{{ 'Comment' | trans }}</th>
        <th class="bk-table-width-100 uk-text-center">
          <input-filter :title="$trans('Status')" :options="statusOptions" v-model="config.filter.status"></input-filter>
        </th>
        <th class="bk-table-width-200" :class="{'bk-filter': config.post, 'uk-active': config.post}">
          <span v-if="!config.post">{{ 'Post' | trans }}</span>
          <span v-else>{{ config.post.title }}</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <template v-for="comment in comments">
        <template v-if="editComment.id !== comment.id">
          <tr class="uk-visible-toggle" :class="{'uk-active': active(comment)}" v-for="post in getPost(comment.post_id)">
            <td><input class="uk-checkbox" type="checkbox" name="id" :value="comment.id" v-model="selected"></td>
            <td class="bk-table-width-36">
              <img class="uk-img-preserve uk-border-circle" width="40" height="40" :alt="comment.author" v-gravatar="comment.email">
            </td>
            <td>
              <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" data-uk-margin>
                <div>
                  <a :href="$url.route('admin/user/edit', { id: comment.user_id })" v-if="comment.user_id!=0">{{ comment.author }}</a>
                  <span v-else>{{ comment.author }}</span>
                  <br><a class="uk-link-muted uk-text-meta" :href="'mailto:'+comment.email">{{ comment.email }}</a>
                </div>
                <div class="uk-flex uk-flex-middle">
                  <ul class="uk-iconnav pk-subnav-icon uk-margin-right uk-invisible-hover">
                    <li><a class="pk-icon-edit pk-icon-hover" uk-icon="icon: pencil" :title="$trans('Edit')" data-uk-tooltip="{delay: 500}" @click.prevent="edit(comment)"></a></li>
                    <li><a class="pk-icon-reply pk-icon-hover" uk-icon="icon: reply" :title="$trans('Reply')" data-uk-tooltip="{delay: 500}" @click.prevent="reply(comment)"></a></li>
                  </ul>
                  <a class="uk-link-muted uk-text-meta" v-if="post.accessible" :href="$url.route(post.url.substr(1))+'#comment-'+comment.id">{{ comment.created | relativeDate }}</a>
                  <span v-else>{{ comment.created | relativeDate }}</span>
                </div>
              </div>

              <div v-html="comment.content"></div>

              <div class="uk-margin-top" v-if="replyComment.parent_id === comment.id">
                <validation-observer v-slot="{ handleSubmit }" slim>
                  <form class="uk-form" @submit.prevent="handleSubmit(submit)">
                    <v-validated-input
                        :id="'form-reply-comment-' + comment.id"
                        name="content"
                        tag="textarea"
                        rules="required"
                        label="Comment"
                        :error-messages="{ required: 'Comment cannot be blank.' }"
                        :options="{ innerWrapperClass: '', textarea: { rows: 10 }, elementClass: 'uk-textarea' }"
                        v-model="replyComment.content">
                    </v-validated-input>

                    <p>
                      <button class="uk-button uk-button-primary" type="submit">{{ 'Reply' | trans }}</button>
                      <button class="uk-button" @click.prevent="cancel">{{ 'Cancel' | trans }}</button>
                    </p>
                  </form>
                </validation-observer>
              </div>
            </td>
            <td class="uk-text-center">
              <a :title="getStatusText(comment)" @click="toggleStatus(comment)">
                <span class="uk-margin-top"  v-if="comment.status == 1" uk-icon="check"></span>
                <span class="uk-margin-top"  v-if="comment.status == 0" uk-icon="warning"></span>
                <span class="uk-margin-top"  v-if="comment.status == 2" uk-icon="close"></span>
              </a>
            </td>
            <td>
              <a :href="$url.route('admin/blog/post/edit', { id: post.id })">{{ post.title }}</a>
              <br />
              <a class="uk-text-nowrap uk-link-muted uk-text-meta" :class="{'pk-link-icon': !post.comments_pending}" :href="$url.route('admin/blog/comment', { post: post.id })" :title="$transChoice('{0} No pending|{1} One pending|]1,Inf[ %comments_pending% pending', post.comments_pending, post)">
                <span uk-icon="comment"></span>
                {{ post.comment_count }}</a>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td></td>
            <td>
              <img class="uk-img-preserve uk-border-circle" width="40" height="40" :alt="editComment.author" v-gravatar="editComment.email">
            </td>
            <td colspan="3">
              <validation-observer v-slot="{ handleSubmit }" slim>
                <form class="uk-form uk-form-stacked" @submit.prevent="handleSubmit(submit)">
                  <div class="uk-grid uk-grid-medium uk-grid-width-medium-1-3" data-uk-margin="{cls:'uk-margin-top'}">
                    <v-validated-input
                        :id="'form-edit-name-' + comment.id"
                        name="author"
                        rules="required"
                        label="Name"
                        :error-messages="{ required: 'Name cannot be blank.' }"
                        :options="{ wrapperClass:'', innerWrapperClass: '', elementClass: 'uk-input' }"
                        v-model="editComment.author">
                    </v-validated-input>

                    <v-validated-input
                        :id="'form-edit-email-' + comment.id"
                        name="email"
                        type="email"
                        rules="email"
                        label="Email"
                        :error-messages="{ email: 'Email invalid.' }"
                        :options="{ wrapperClass:'', innerWrapperClass: '', elementClass: 'uk-input' }"
                        v-model="editComment.email">
                    </v-validated-input>
                    <div>
                      <label for="form-status" class="uk-form-label">{{ 'Status' | trans }}</label>
                      <select id="form-status" class="uk-width-1-1 uk-select" v-model="editComment.status">
                        <option v-for="(status, key) in statuses" :value="key">{{ status }}</option>
                      </select>
                    </div>
                  </div>

                  <v-validated-input
                      :id="'form-edit-comment-' + comment.id"
                      name="content"
                      tag="textarea"
                      rules="required"
                      label="Comment"
                      :error-messages="{ required: 'Comment cannot be blank.' }"
                      :options="{ wrapperClass: 'uk-margin', innerWrapperClass: '', textarea: { rows: 10 }, elementClass: 'uk-textarea' }"
                      v-model="editComment.content">
                  </v-validated-input>

                  <p>
                    <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>
                    <button class="uk-button" @click.prevent="cancel">{{ 'Cancel' | trans }}</button>
                  </p>
                </form>
              </validation-observer>
            </td>
          </tr>
        </template>
      </template>
      </tbody>
    </table>
  </div>

  <h3 class="uk-h1 uk-text-muted uk-text-center" v-show="comments && !comments.length">{{ 'No comments found.' | trans }}</h3>
  <v-pagination :pages="pages" v-model="config.page" v-show="pages > 1 || config.page > 0"></v-pagination>
</div>