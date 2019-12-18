<?php

namespace Biskuit\Routing\Loader;

use Biskuit\Routing\Route;

interface LoaderInterface
{
    /**
     * Loads routes.
     *
     * @param  mixed $routes
     * @return Route[]
     */
    public function load($routes);
}
