<?php

return [

    'name' => 'system/intl',

    'main' => 'Biskuit\\Intl\\IntlModule',

    'autoload' => [

        'Biskuit\\Intl\\' => 'src'

    ],

    'resources' => [

        'system/intl:' => ''

    ],

    'routes' => [
        '/system/intl' => [
            'name' => '@system/intl',
            'controller' => 'Biskuit\\Intl\\Controller\\IntlController'
        ],
    ],

    'config' => [

        'locale' => 'en_US'

    ],

    'events' => [

        'view.init' => function ($event, $view) {
            $view->addGlobal('intl', $this);
        }

    ]

];
