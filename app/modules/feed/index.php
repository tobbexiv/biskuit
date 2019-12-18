<?php

use Biskuit\Feed\FeedFactory;

return [

    'name' => 'feed',

    'main' => function ($app) {

        $app['feed'] = function () {
            return new FeedFactory;
        };

    },

    'autoload' => [

        'Biskuit\\Feed\\' => 'src'

    ]

];
