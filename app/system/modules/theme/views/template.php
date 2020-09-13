<!DOCTYPE html>
<html lang="<?= str_replace('_', '-', $intl->getLocaleTag()) ?>">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,600&amp;subset=<?= $subset ?>" rel="stylesheet">
    <?php $view->style('uikit', 'app/assets/uikit/dist/css/uikit.css') ?>
    <?php $view->style('theme', 'system/theme:css/theme.css') ?>
    <?php $view->script('theme', 'system/theme:js/theme.js', ['vue', 'uikit']) ?>
    <?php $view->script('uikit-icons', 'app/assets/uikit/dist/js/uikit-icons.js', ['uikit']) ?>
    <?= $view->render('head') ?>
  </head>

  <body>
    <div id="header" class="bk-header">
      <nav class="uk-navbar-container uk-container uk-navbar-transparent uk-light" uk-navbar>
        <!---- menu ---->
        <div class="uk-navbar-left">
          <a uk-toggle="target: #offcanvas" class="uk-navbar-toggle uk-hidden@m uk-icon uk-navbar-toggle-icon" uk-navbar-toggle-icon></a>
          <a class="uk-navbar-item uk-logo" href="#">{{ item.label | trans }}</a>

          <ul class="uk-navbar-nav uk-navbar-item uk-visible@m" data-url="<?= $view->url('@system/adminmenu') ?>">
            <li v-for="item in nav" :data-id="item.id">
              <a :href="item.url">{{ item.label | trans }}</a>
            </li>
          </ul>
        </div>

        <!---- user ---->
        <div class="uk-navbar-right">
          <a uk-toggle="target: #offcanvas-flip" class="uk-hidden@m">
            <img class="uk-border-circle" height="32" width="32" :alt="user.username" v-gravatar="user.email">
          </a>
          <ul class="uk-navbar-nav uk-navbar-item uk-visible@m">
            <li>
              <a href="https://github.com/biskuitorg" title="GitHub" target="_blank"><span uk-icon="github"></span></a>
            </li>
            <li>
              <a href="https://github.com/biskuitorg/biskuit/issues" :title="$trans('Get Help')" target="_blank"><span uk-icon="question"></span></a>
            </li>
            <li>
              <a :href="$url.route('')" :title="$trans('Visit Site')" target="_blank"><span uk-icon="home"></span></a>
            </li>
            <li>
              <a href="<?= $view->url('@user/logout', ['redirect' => 'admin/login']) ?>" :title="$trans('Logout')"><span uk-icon="sign-out"></span></a>
            </li>
            <li class="uk-margin-small-left">
              <a :href="$url.route('admin/user/edit', {id: user.id})" :title="$trans('Profile')"><img class="uk-border-circle uk-margin-small-right" height="24" width="24" :title="user.name" v-gravatar="user.email"> <span v-text="user.username"></span></a>
            </li>
          </ul>
        </div>
      </nav>

      <!---- navigation ---->
      <div class="uk-light uk-container">
        <ul class="uk-flex uk-tab">
          <li :class="{ 'uk-active': item.active }" v-for="item in subnav">
            <a :href="item.url" v-text="$trans(item.label)"></a>
          </li>
        </ul>
      </div>
    </div>

    <main class="bk-main uk-margin-top uk-container">
        <?= $view->render('content') ?>
    </main>

    <div class="uk-hidden">
        <?= $view->render('messages') ?>
    </div>

    <div id="offcanvas" uk-offcanvas="overlay:true">
      <div class="uk-offcanvas-bar">
        <ul class="uk-nav uk-nav-default">
          <li class="uk-nav-header" v-show="subnav">{{ item.label | trans }}</li>
          <li :class="{ 'uk-active': item.active }" v-for="item in subnav">
            <a :href="item.url">{{ item.label | trans }}</a>
          </li>
          <li class="uk-nav-divider" v-show="subnav"></li>
          <li class="uk-nav-header">{{ 'Extensions' | trans }}</li>
          <li :class="{ 'uk-active': item.active }" v-for="item in nav">
            <a :href="item.url">{{ item.label | trans }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div id="offcanvas-flip" uk-offcanvas="overlay:true;flip:true">
      <div class="uk-offcanvas-bar">
        <ul class="uk-nav uk-nav-default">
          <li class="uk-nav-header">{{ user.username }}</li>
          <li><a :href="$url.route('')" target="_blank">{{ 'Visit Site' | trans }}</a></li>
          <li><a :href="$url.route('admin/user/edit', {id: user.id})">{{ 'Settings' | trans }}</a></li>
          <li><a href="<?= $view->url('@user/logout', ['redirect' => 'admin/login']) ?>">{{ 'Logout' | trans }}</a></li>
        </ul>
      </div>
    </div>
  </body>
</html>
