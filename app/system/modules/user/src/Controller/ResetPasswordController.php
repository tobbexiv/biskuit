<?php

namespace Biskuit\User\Controller;

use Biskuit\Application as App;
use Biskuit\Application\Exception;
use Biskuit\User\Model\User;

class ResetPasswordController
{

    public function indexAction()
    {
        if (App::user()->isAuthenticated()) {
            return App::redirect();
        }

        return [
            '$view' => [
                'title' => __('Reset'),
                'name' => 'system/user/reset-request.php',
            ],
            'error' => ''
        ];
    }

    /**
     * @Request({"email"})
     */
    public function requestAction($email)
    {
        if (App::user()->isAuthenticated()) {
            return App::redirect();
        }

        try {
            if (!App::csrf()->validate()) {
                throw new Exception(__('Invalid token. Please try again.'));
            }

            if (empty($email)) {
                throw new Exception(__('Enter a valid email address.'));
            }
        } catch (Exception $e) {
            return [
                '$view' => [
                    'title' => __('Reset'),
                    'name' => 'system/user/reset-request.php',
                ],
                'error' => $e->getMessage()
            ];
        }

        if ($user = User::findByEmail($email)) {
            if(!$user->isBlocked()) {
                $key = App::get('auth.random')->generateString(32);
                $url = App::url('@user/resetpassword/confirm', compact('key'), 0);
                try {
                    $mail = App::mailer()->create();
                    $mail->setTo($user->email)
                        ->setSubject(__('Reset password for %site%.', ['%site%' => App::module('system/site')->config('title')]))
                        ->setBody(App::view('system/user:mails/reset.php', compact('user', 'url', 'mail')), 'text/html')
                        ->send();
                } catch (\Exception $e) {
                    App::log()->error("[Reset password exception]: {$e->getMessage()}");
                }
                $user->activation = $key;
                $user->save();
            }
        }

        // sleep for a random time (0-2 seconds) to make it harder to guess success based on the runtime.
        usleep(rand(0, 2000000));
        App::message()->success(__('You will receive an email with a confirmation link if an unblocked account exists for entered email.'));
        return App::redirect('@user/login');
    }

    /**
     * @Request({"key", "password"})
     */
    public function confirmAction($activation = '', $password = '')
    {
        if ($activation and $user = User::where(compact('activation'))->first()) {

            App::session()->set('activation', [
                'key' => $activation,
                'user' => $user->id,
            ]);

            $user->activation = null;
            $user->save();
        }

        if (!$data = App::session()->get('activation') or $data['key'] != $activation) {
            App::abort(400, __('Invalid key.'));
        }

        if (!$user = User::find($data['user']) or $user->isBlocked()) {
            App::abort(400, __('Your account has not been activated or is blocked.'));
        }

        if ('POST' === App::request()->getMethod()) {

            try {

                if (!App::csrf()->validate()) {
                    throw new Exception(__('Invalid token. Please try again.'));
                }

                if (empty($password)) {
                    throw new Exception(__('Enter password.'));
                }

                if ($password != trim($password)) {
                    throw new Exception(__('Invalid password.'));
                }

                $user->activation = null;
                $user->password = App::get('auth.password')->hash($password);
                $user->save();

                App::session()->remove('activation');
                App::message()->success(__('Your password has been reset.'));

                return App::redirect('@user/login');

            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        return [
            '$view' => [
                'title' => __('Reset Confirm'),
                'name' => 'system/user/reset-confirm.php'
            ],
            'activation' => $activation,
            'error' => isset($error) ? $error : ''
        ];
    }

}
