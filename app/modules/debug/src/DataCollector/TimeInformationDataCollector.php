<?php

namespace Biskuit\Debug\DataCollector;

use DebugBar\DataCollector\TimeDataCollector;

class TimeInformationDataCollector extends TimeDataCollector
{
    /**
     * @param float $requestStartTime
     */
    public function __construct($requestStartTime = null)
    {
        parent::__construct($requestStartTime);
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'time-information';
    }
}
