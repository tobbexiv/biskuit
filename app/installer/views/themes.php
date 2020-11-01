<?php $view->script('themes', 'installer:app/bundle/themes.js', ['vue', 'uikit-upload', 'editor']) ?>

<div id="themes" v-cloak>
  <div class="uk-margin uk-flex uk-flex-between uk-flex-wrap" data-uk-margin>
    <div class="uk-flex uk-flex-middle uk-flex-wrap uk-first-column" data-uk-margin>
      <h3 class="uk-margin-remove">{{ 'Themes' | trans }}</h3>
      <form class="uk-search uk-search-navbar">
        <span uk-search-icon></span>
        <input class="uk-search-input" type="search" v-model="search">
      </form>
    </div>
    <div data-uk-margin="">
      <div class="js-upload" uk-form-custom>
        <package-upload :api="api" :packages="packages" type="theme"></package-upload>
      </div>
    </div>
  </div>

  <div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid v-for="pkg in themeorder(filteredPackages)">
    <div>
      <div class="uk-card uk-card-default">
        <div class="uk-card-media-top">
          <img v-bind:src="image(pkg)" />
        </div>

        <div class="uk-card-body">
          <h2 class="uk-panel-title uk-margin-remove">{{ pkg.title }}</h2>
          <div class="uk-text-muted">{{ pkg.authors[0].name }}</div>
          <a class="uk-position-cover" @click="details(pkg)"></a>

          <div class="pk-panel-badge-bottom-right">
            <button class="uk-button uk-button-primary uk-button-small" v-show="pkg.enabled && pkg.settings" @click="settings(pkg)">Customize</button>
            <button class="uk-button uk-button-success uk-button-small" @click="update(pkg, updates)" v-show="updates && updates[pkg.name]">{{ 'Update' | trans }}</button>
          </div>
        </div>

        <div class="uk-panel-badge pk-panel-badge uk-hidden" v-if="!pkg.enabled">
          <ul class="uk-subnav pk-subnav-icon">
            <li><a class="pk-icon-star pk-icon-hover" :title="$trans('Enable')" data-uk-tooltip="{delay: 500}" @click="enable(pkg)"></a></li>
            <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click="uninstall(pkg, packages)" v-confirm="'Uninstall theme?'"></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <h3 class="uk-h1 uk-text-muted uk-text-center" v-show="nothingFound">{{ 'No theme found.' | trans }}</h3>

  <v-modal ref="details">
    <package-details :api="api" :pkg="pkg"></package-details>
  </v-modal>

  <v-modal ref="settings">
    <component :is="view" :pkg="pkg"></component>
  </v-modal>

</div>
