<form class="pk-user pk-user-login uk-form uk-form-stacked uk-width-medium-1-2 uk-width-large-1-3 uk-container-center" action="<?= $view->url('@user/authenticate') ?>" method="post">

    <h4 class="uk-text-center"><?= __('Sign in to your account') ?></h4>

    <?= $view->render('messages') ?>

    <div class="uk-text-center">
        <div class="uk-margin">
            <input class="uk-input uk-form-width-medium" type="text" name="credentials[username]" value="<?= $this->escape($last_username) ?>" placeholder="<?= __('Username') ?>" required autofocus>
        </div>

        <div class="uk-margin">
            <input class="uk-input uk-form-width-medium" type="password" name="credentials[password]" value="" placeholder="<?= __('Password') ?>" required>
        </div>
        <div class="uk-margin">
            <button class="uk-button uk-form-width-medium uk-button-primary" type="submit"><?= __('Sign in') ?></button>
        </div>
        <div class="uk-margin">
            <label><input type="checkbox" name="remember_me"> <?= __('Remember Me') ?></label>
        </div>
        <div class="uk-margin">
            <a class="uk-button-link" href="<?= $view->url('@user/resetpassword') ?>"><?= __('Request Password') ?></a>
        </div>
    </div>

    <?php if ($app->module('system/user')->config('registration') != 'admin') : ?>
    <p class="uk-margin-large-top uk-text-center"><?= __('No account yet?') ?> 
        <a class="uk-button-link" href="<?= $view->url('@user/registration') ?>"><?= __('Sign up now') ?></a>
    </p>
    <?php endif ?>

    <input type="hidden" name="redirect" value="<?= $this->escape($redirect) ?>">
    <?php $view->token()->get() ?>

</form>
