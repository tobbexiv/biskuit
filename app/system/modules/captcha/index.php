<?php

use Biskuit\Captcha\CaptchaListener;

return [

    'name' => 'system/captcha',

    'autoload' => [

        'Biskuit\\Captcha\\' => 'src'

    ],

    'resources' => [

        'system/captcha:' => ''

    ],

    'events' => [

        'boot' => function ($event, $app) {
            $app->subscribe(
                new CaptchaListener
            );
        },

        'view.system:modules/settings/views/settings' => function ($event, $view) use ($app) {
            $view->data('$settings', [
                'options' => [
                    $this->name => $this->config
                ]
            ]);
        },

    ],

    'config' => [

        'recaptcha_sitekey' => '',
        'recaptcha_secret' => '',

    ]

];
