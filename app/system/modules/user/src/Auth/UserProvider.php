<?php

namespace Biskuit\User\Auth;

use Biskuit\Auth\Encoder\PasswordEncoderInterface;
use Biskuit\Auth\UserInterface;
use Biskuit\Auth\UserProviderInterface;
use Biskuit\User\Model\User;

class UserProvider implements UserProviderInterface
{
    /**
     * @var PasswordEncoderInterface
     */
    protected $encoder;

    /**
     * Constructor.
     *
     * @param PasswordEncoderInterface $encoder
     */
    public function __construct(PasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * {@inheritdoc}
     */
    public function find($id)
    {
        return User::find($id);
    }

    /**
     * {@inheritdoc}
     */
    public function findByUsername($username)
    {
        return User::findByUsername($username);
    }

    /**
     * {@inheritdoc}
     */
    public function findByCredentials(array $credentials)
    {
        if (isset($credentials['password'])) {
            unset($credentials['password']);
        }

        return User::where($credentials)->first();
    }

    /**
     * {@inheritdoc}
     */
    public function validateCredentials(UserInterface $user, array $credentials)
    {
        return $this->encoder->verify($user->getPassword(), $credentials['password']);
    }
}
