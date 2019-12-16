<?php

namespace Biskuit\Filter\Tests;

use Biskuit\Filter\SlugifyFilter;

class SlugifyTest extends \PHPUnit_Framework_TestCase
{
    public function testFilter()
    {
        $filter = new SlugifyFilter;

        $values = [
            'BISKUIT'                  => 'biskuit',
            ":#*\"@+=;!><&.%()/'\\|[]" => "",
            "  a b ! c   "             => "a-b-c",
        ];

        foreach ($values as $in => $out) {
            $this->assertEquals($out, $filter->filter($in));
        }

    }
}
