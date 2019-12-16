<?php

namespace Biskuit\Content;

use Biskuit\Application as App;
use Biskuit\Content\Event\ContentEvent;

class ContentHelper
{
    /**
     * Applies content plugins
     *
     * @param  string $content
     * @param  array  $parameters
     * @return mixed
     */
    public function applyPlugins($content, $parameters = [])
    {
        return App::trigger(new ContentEvent('content.plugins', $content, $parameters))->getContent();
    }
}
