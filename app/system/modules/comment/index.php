<?php

use Biskuit\Comment\CommentPlugin;

return [

    'name' => 'system/comment',

    'main' => function ($app) {

        $app->subscribe(new CommentPlugin);

    },

    'autoload' => [

        'Biskuit\\Comment\\' => 'src'

    ]

];
