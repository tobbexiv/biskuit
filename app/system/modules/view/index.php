<?php

use Biskuit\Util\ArrObject;
use Biskuit\View\Event\ResponseListener;

return [

    'name' => 'system/view',

    'main' => function ($app) {

        $app->extend('twig', function ($twig) use ($app) {

            $twig->addFilter(new Twig_SimpleFilter('trans', '__'));
            $twig->addFilter(new Twig_SimpleFilter('transChoice', '_c'));

            return $twig;

        });

        $app->extend('assets', function ($assets) use ($app) {

            $assets->register('file', 'Biskuit\View\Asset\FileLocatorAsset');

            return $assets;
        });

    },

    'autoload' => [

        'Biskuit\\View\\' => 'src'

    ],

    'events' => [

        'boot' => function ($event, $app) {
            $app->subscribe(new ResponseListener());
        },

        'site' => function ($event, $app) {
            $app->on('view.meta', function ($event, $meta) use ($app) {
                $meta->add('canonical', $app['url']->get($app['request']->attributes->get('_route'), $app['request']->attributes->get('_route_params', []), 0));
            }, 60);
        },

        'view.init' => [function ($event, $view) {
            $view->defer('head');
            $view->meta(['generator' => 'Biskuit']);
            $view->addGlobal('params', new ArrObject());
        }, 20],

        'view.data' => function ($event, $data) use ($app) {
            $data->add('$biskuit', [
                'url' => $app['router']->getContext()->getBaseUrl(),
                'csrf' => $app['csrf']->generate()
            ]);
        },

        'view.styles' => function ($event, $styles) {
            $styles->register('codemirror-hint', 'app/assets/codemirror/hint.css');
            $styles->register('codemirror', 'app/assets/codemirror/codemirror.css', ['codemirror-hint']);
        },

        'view.scripts' => function ($event, $scripts) use ($app) {
            $scripts->register('codemirror', 'app/assets/codemirror/codemirror.js');
            $scripts->register('jquery', 'app/assets/jquery/jquery.min.js'); // TODO: Remove
            $scripts->register('lodash', 'app/assets/lodash/lodash.min.js');
            $scripts->register('marked', 'app/assets/marked/marked.min.js');
            $scripts->register('uikit', 'app/assets/uikit/dist/js/uikit.min.js');
            $scripts->register('vue', 'app/system/app/bundle/vue.js', ['vue-dist', 'uikit', 'jquery', 'lodash', 'locale']);
            $scripts->register('vue-dist', 'app/assets/vue/' . ($app->debug() ? 'vue.js' : 'vue.min.js'));
            $scripts->register('locale', $app->url('@system/intl', ['locale' => $app->module('system/intl')->getLocale(), 'v' => $scripts->getFactory()->getVersion()]), [], ['type' => 'url']);
        }

    ]

];
