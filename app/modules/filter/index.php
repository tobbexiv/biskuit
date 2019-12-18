<?php

use Biskuit\Filter\FilterManager;

return [

    'name' => 'filter',

    'main' => function ($app) {

        $app['filter'] = function() {
            return new FilterManager($this->config['defaults']);
        };

    },

    'autoload' => [

        'Biskuit\\Filter\\' => 'src'

    ],

    'config' => [

        'defaults' => null

    ]
];
