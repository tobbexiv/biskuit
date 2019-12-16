<?php

return [

    'name' => 'system/dashboard',

    'main' => 'Biskuit\\Dashboard\\DashboardModule',

    'autoload' => [

        'Biskuit\\Dashboard\\' => 'src'

    ],

    'routes' => [

        '/dashboard' => [
            'name' => '@dashboard',
            'controller' => 'Biskuit\\Dashboard\\Controller\\DashboardController'
        ]

    ],

    'resources' => [

        'system/dashboard:' => ''

    ],

    'menu' => [

        'dashboard' => [
            'label' => 'Dashboard',
            'icon' => 'system/dashboard:assets/images/icon-dashboard.svg',
            'url' => '@dashboard',
            'active' => '@dashboard*',
            'priority' => 100
        ]

    ],

    'config' => [

        'defaults' => []

    ]

];
