<?php

namespace Biskuit\Site\Controller;

use Biskuit\Application as App;
use Biskuit\Site\Model\Page;

/**
 * @Access("site: manage site")
 */
class PageApiController
{
    /**
     * @Route("/", methods="GET")
     */
    public function indexAction()
    {
        return array_values(Page::findAll());
    }

    /**
     * @Route("/{id}", methods="GET", requirements={"id"="\d+"})
     */
    public function getAction($id)
    {
        return Page::find($id);
    }
}
