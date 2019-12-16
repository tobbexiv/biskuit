<?php

namespace Biskuit\User\Event;

use Biskuit\Application as App;
use Biskuit\Auth\Event\LoginEvent;
use Biskuit\Event\EventSubscriberInterface;
use Biskuit\User\Model\User;

class UserListener implements EventSubscriberInterface
{
    /**
     * Updates user's last login time
     */
    public function onUserLogin(LoginEvent $event)
    {
        User::updateLogin($event->getUser());
    }

    public function onRoleDelete($event, $role)
    {
        User::removeRole($role);
    }

    /**
     * {@inheritdoc}
     */
    public function subscribe()
    {
        return [
            'auth.login' => 'onUserLogin',
            'model.role.deleted' => 'onRoleDelete'
        ];
    }
}
