<?php

namespace Biskuit\Content\Plugin;

use Biskuit\Application as App;
use Biskuit\Content\Event\ContentEvent;
use Biskuit\Event\EventSubscriberInterface;

class MarkdownPlugin implements EventSubscriberInterface
{
    /**
     * Content plugins callback.
     *
     * @param ContentEvent $event
     */
    public function onContentPlugins(ContentEvent $event)
    {
        if (!$event['markdown']) {
            return;
        }

        $content = $event->getContent();
        $content = App::markdown()->parse($content, is_array($event['markdown']) ? $event['markdown'] : []);

        $event->setContent($content);
    }

    /**
     * {@inheritdoc}
     */
    public function subscribe()
    {
        return [
            'content.plugins' => ['onContentPlugins', 5]
        ];
    }
}
