<?php

use Biskuit\Content\ContentHelper;
use Biskuit\Content\Plugin\MarkdownPlugin;
use Biskuit\Content\Plugin\SimplePlugin;
use Biskuit\Content\Plugin\VideoPlugin;

return [

    'name' => 'system/content',

    'main' => function ($app) {

        $app->subscribe(
            new MarkdownPlugin,
            new SimplePlugin,
            new VideoPlugin
        );

        $app['content'] = function() {
            return new ContentHelper;
        };

    },

    'autoload' => [

        'Biskuit\\Content\\' => 'src'

    ]

];
