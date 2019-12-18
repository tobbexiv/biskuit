<?php

use Biskuit\Info\InfoHelper;

return [

    'name' => 'system/info',

    'main' => function ($app) {

        $app['info'] = function () {
            return new InfoHelper();
        };

    },

    'autoload' => [

        'Biskuit\\Info\\' => 'src'

    ],

    'routes' => [

        '/system/info' => [
            'name' => '@system/info',
            'controller' => 'Biskuit\\Info\\Controller\\InfoController'
        ]

    ],

    'menu' => [

        'system: info' => [
            'label' => 'Info',
            'parent' => 'system: system',
            'url' => '@system/info',
            'priority' => 30
        ]

    ]

];
