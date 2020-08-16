<!DOCTYPE html>
<html class="bk-background uk-height-viewport">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= $view->url()->getStatic('system/theme:favicon.ico') ?>" rel="shortcut icon" type="image/x-icon">
  <link href="<?= $view->url()->getStatic('system/theme:apple_touch_icon.png') ?>" rel="apple-touch-icon-precomposed">
    <?= $view->render('head') ?>
    <?php $view->style('uikit', 'app/assets/uikit/dist/css/uikit.css') ?>
    <?php $view->style('theme', 'system/theme:css/theme.css') ?>
    <?php $view->script('login', 'system/theme:js/login.js', ['uikit']) ?>
    <?php $view->script('uikit-icons', 'app/assets/uikit/dist/js/uikit-icons.js', ['uikit']) ?>
</head>

<body>

<div class="uk-height-viewport uk-flex uk-flex-center uk-flex-middle uk-text-center">
  <div class="uk-container uk-container-small">
    <hr class="uk-divider" />
    <img class="uk-margin-large-bottom" src="<?= $view->url()->getStatic('app/system/assets/images/biskuit-logo-text.svg') ?>" alt="Biskuit">

    <div class="uk-card uk-card-default uk-card-body">
        <?= $view->render('messages') ?>
      <form class="js-login js-toggle uk-form tm-form" action="<?= $view->url('@user/authenticate') ?>" method="post">

        <div class="uk-margin">
          <div class="uk-inline bk-inline">
            <span class="uk-form-icon" uk-icon="icon: user"></span>
            <input class="uk-input" type="text" name="credentials[username]" value="<?= $this->escape($last_username) ?>" placeholder="<?= __('Username') ?>" autofocus>
          </div>
        </div>

        <div class="uk-margin">
          <div class="uk-inline bk-inline">
            <span class="uk-form-icon" uk-icon="icon: lock"></span>
            <input class="uk-input" type="password" name="credentials[password]" value="" placeholder="<?= __('Password') ?>">
          </div>
        </div>

        <p class="uk-margin tm-panel-marginless-bottom">
          <button class="uk-button uk-button-primary uk-button-large uk-width-1-1"><?= __('Login') ?></button>
        </p>

          <?php $view->token()->get() ?>
        <input type="hidden" name="redirect" value="<?= $this->escape($redirect) ?>">

        <ul class="uk-list">
          <li><label class="uk-form"><input type="checkbox" name="remember_me"> <?= __('Remember Me') ?></label></li>
          <li class="uk-margin-small-top">
              <?= __('Forgot Password?') ?>
            <a class="uk-link" data-uk-toggle="{ target: '.js-toggle' }">
                <?= __('Request Password') ?>
            </a>
          </li>
        </ul>

      </form>

      <form class="js-toggle uk-form tm-form uk-hidden" action="<?= $view->url('@user/resetpassword/request') ?>" method="post">

        <div class="uk-panel uk-card">

          <div class="uk-margin">
            <input class="uk-form-large uk-width-1-1" type="text" name="email" value="" placeholder="<?= __('Email') ?>" required>
          </div>

          <p class="uk-margin tm-panel-marginless-bottom">
            <button class="uk-button uk-button-primary uk-button-large uk-width-1-1"><?= __('Reset Password') ?></button>
          </p>

            <?php $view->token()->get() ?>
        </div>

      </form>

    </div>

  </div>
</div>

</body>

</html>