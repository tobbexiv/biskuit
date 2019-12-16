<?php

$autoload = [
    'Biskuit\\Auth\\' => '/app/modules/auth/src',
    'Biskuit\\Config\\' => '/app/modules/config/src',
    'Biskuit\\Cookie\\' => '/app/modules/cookie/src',
    'Biskuit\\Database\\' => '/app/modules/database/src',
    'Biskuit\\Filesystem\\' => '/app/modules/filesystem/src',
    'Biskuit\\Filter\\' => '/app/modules/filter/src',
    'Biskuit\\Migration\\' => '/app/modules/migration/src',
    'Biskuit\\Package\\' => '/app/modules/package/src',
    'Biskuit\\Routing\\' => '/app/modules/routing/src',
    'Biskuit\\Session\\' => '/app/modules/session/src',
    'Biskuit\\Tree\\' => '/app/modules/tree/src',
    'Biskuit\\View\\' => '/app/modules/view/src'
];

$path = realpath(__DIR__.'/../../../../../');
$loader = require $path.'/autoload.php';

foreach ($autoload as $namespace => $src) {
    $loader->addPsr4($namespace, $path.$src);
}
