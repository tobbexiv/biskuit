<?php $view->script('blog-settings', 'blog:app/bundle/settings.js', 'vue') ?>

<div id="settings" class="uk-form-horizontal" v-cloak>
  <div uk-grid>
    <div class="uk-first-column bk-sidebar bk-sidebar-small">
      <ul class="uk-tab-left" uk-tab="connect: #component-tab-left; animation: uk-animation-fade">
        <li><a><span uk-icon="settings"></span> {{ 'General' | trans }}</a></li>
        <li><a><span uk-icon="comments"></span> {{ 'Comments' | trans }}</a></li>
      </ul>
    </div>
    <div class="uk-width-expand@m">
      <ul id="component-tab-left" class="uk-switcher">
        <li>
          <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" uk-margin>
            <div uk-margin>
              <h2 class="uk-margin-remove">{{ 'General' | trans }}</h2>
            </div>
            <div uk-margin>
              <button class="uk-button uk-button-primary" @click.prevent="save">{{ 'Save' | trans }}</button>
            </div>
          </div>

          <div class="uk-margin">
            <span class="uk-form-label">{{ 'Permalink' | trans }}</span>
            <div class="uk-form-controls uk-form-controls-text">
              <p class="uk-margin-small">
                <label>
                  <input class="uk-radio"  type="radio" v-model="config.permalink.type" value="">
                  {{ 'Numeric' | trans }} <code>{{ '/123' | trans }}</code>
                </label>
              </p>
              <p class="uk-margin-small">
                <label>
                  <input class="uk-radio"  type="radio" v-model="config.permalink.type" value="{slug}">
                  {{ 'Name' | trans }} <code>{{ '/sample-post' | trans }}</code>
                </label>
              </p>
              <p class="uk-margin-small">
                <label>
                  <input class="uk-radio"  type="radio" v-model="config.permalink.type" value="{year}/{month}/{day}/{slug}">
                  {{ 'Day and name' | trans }} <code>{{ '/2014/06/12/sample-post' | trans }}</code>
                </label>
              </p>
              <p class="uk-margin-small">
                <label>
                  <input class="uk-radio"  type="radio" v-model="config.permalink.type" value="{year}/{month}/{slug}">
                  {{ 'Month and name' | trans }} <code>{{ '/2014/06/sample-post' | trans }}</code>
                </label>
              </p>
              <p class="uk-margin-small">
                <label>
                  <input class="uk-radio"  type="radio" v-model="config.permalink.type" value="custom">
                  {{ 'Custom' | trans }}
                </label>
                <input class="uk-input uk-form-small uk-form-width-medium" type="text" v-model="config.permalink.custom">
              </p>
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label">{{ 'Posts per page' | trans }}</label>
            <div class="uk-form-controls uk-form-controls-text">
              <p class="uk-margin-small">
                <input class="uk-input uk-form-width-small" type="number" v-model="config.posts.posts_per_page" class="uk-form-width-small">
              </p>
            </div>
          </div>

          <div class="uk-margin">
            <span class="uk-form-label">{{ 'Default post settings' | trans }}</span>
            <div class="uk-form-controls uk-form-controls-text">
              <p class="uk-margin-small">
                <label><input class="uk-checkbox"  type="checkbox" v-model="config.posts.markdown_enabled"> {{ 'Enable Markdown' | trans }}</label>
              </p>
              <p class="uk-margin-small">
                <label><input class="uk-checkbox"  type="checkbox" v-model="config.posts.comments_enabled"> {{ 'Enable Comments' | trans }}</label>
              </p>
            </div>
          </div>
        </li>

        <li>
          <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" uk-margin>
            <div uk-margin>
              <h2 class="uk-margin-remove">{{ 'Comments' | trans }}</h2>
            </div>
            <div uk-margin>
              <button class="uk-button uk-button-primary" @click.prevent="save">{{ 'Save' | trans }}</button>
            </div>
          </div>

          <div class="uk-margin">
            <span class="uk-form-label">{{ 'Comments' | trans }}</span>
            <div class="uk-form-controls uk-form-controls-text">
              <p class="uk-margin-small">
                <label><input class="uk-checkbox"  type="checkbox" v-model="config.comments.require_email"> {{ 'Require e-mail.' | trans }}</label>
              </p>
              <p class="uk-margin-small">
                <input class="uk-checkbox"  type="checkbox" v-model="config.comments.autoclose"> {{ 'Close comments on articles older than' | trans }}
                <input class="uk-form-small uk-input uk-form-width-xsmall" type="number" v-model="config.comments.autoclose_days" min="1"> {{ 'days.' | trans }}
              </p>
            </div>
          </div>

          <div class="uk-margin">
            <span class="uk-form-label">{{ 'Appearance' | trans }}</span>
            <div class="uk-form-controls uk-form-controls-text">
              <p class="uk-margin-small">
                <label><input class="uk-checkbox"  type="checkbox" v-model="config.comments.gravatar"> {{ 'Show Avatars from Gravatar.' | trans }}</label>
              </p>
              <p class="uk-margin-small">
                <label>{{ 'Order comments by' | trans }}
                  <select class="uk-select uk-form-width-medium uk-form-small" v-model="config.comments.order">
                    <option value="ASC">{{ 'latest last' | trans }}</option>
                    <option value="DESC">{{ 'latest first' | trans }}</option>
                  </select>
                </label>
              </p>
              <p class="uk-margin-small">
                <input class="uk-checkbox"  type="checkbox" v-model="config.comments.nested"> {{ 'Enable nested comments of' | trans }}
                <input class="uk-form-small uk-input uk-form-width-xsmall" type="number" v-model="config.comments.max_depth" min="2" max="10"> {{ 'levels deep.' | trans }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
