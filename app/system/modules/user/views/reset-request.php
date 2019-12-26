<form class="pk-user pk-user-reset uk-form uk-form-stacked uk-width-medium-1-2 uk-width-large-1-3 uk-container-center" action="<?= $view->url('@user/resetpassword/request') ?>" method="post">

    <h4 class="uk-text-center"><?= __('Forgot Password') ?></h4>

    <div class="uk-text-center">
        <?php if($error): ?>
            <div class="uk-alert uk-alert-danger">
                <?= $error; ?>
            </div>
        <?php endif; ?>

        <p><?= __('Please enter your email address. You will receive a link to create a new password via email.') ?></p>

        <div class="uk-margin">
            <input class="uk-input uk-form-width-medium" type="text" name="email" value="" placeholder="<?= __('Email') ?>" required autofocus>
        </div>

        <div class="uk-margin">
            <button class="uk-button uk-button-primary" type="submit"><?= __('Request password') ?></button>
        </div>
    </div>

    <?php $view->token()->get() ?>

</form>
