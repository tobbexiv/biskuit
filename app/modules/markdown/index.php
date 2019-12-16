<?php

use Biskuit\Markdown\Markdown;

return [

    'name' => 'markdown',

    'main' => function ($app) {

        $app['markdown'] = function() {
            return new Markdown;
        };

    },

    'autoload' => [

        'Biskuit\\Markdown\\' => 'src'

    ]

];
