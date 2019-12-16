<?php

namespace Biskuit\Site\Controller;

use Biskuit\Application as App;
use Biskuit\Site\Model\Page;

class PageController
{
    public function indexAction($id = 0)
    {
        if (!$page = Page::find($id)) {
            App::abort(404, __('Page not found.'));
        }

        $page->content = App::content()->applyPlugins($page->content, ['page' => $page, 'markdown' => $page->get('markdown')]);

        return [
            '$view' => [
                'title' => $page->title,
                'name'  => 'system/site/page.php'
            ],
            'page' => $page,
            'node' => App::node()
        ];
    }
}
