<?php

namespace Biskuit\Site\Model;

use Biskuit\Database\ORM\ModelTrait;
use Biskuit\System\Model\DataModelTrait;

/**
 * @Entity(tableClass="@system_page")
 */
class Page implements \JsonSerializable
{
    use DataModelTrait, ModelTrait;

    /** @Column(type="integer") @Id */
    public $id;

    /** @Column(type="string") */
    public $title;

    /** @Column */
    public $content = '';
}
