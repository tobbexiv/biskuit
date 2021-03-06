<?php

namespace Biskuit\Finder\Controller;

use Biskuit\Application as App;

/**
 * @Access("system: manage storage", admin=true)
 */
class StorageController
{
    public function indexAction()
    {
        return [
            '$view' => [
                'title' => __('Storage'),
                'name'  => 'system:modules/finder/views/storage.php'
            ],
            'root' => App::module('system/finder')->config('storage'),
            'mode' => 'write'
        ];
    }
}
