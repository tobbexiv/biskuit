<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link href="app/system/modules/theme/favicon.ico" rel="shortcut icon" type="image/x-icon">
        <link href="app/system/modules/theme/apple_touch_icon.png" rel="apple-touch-icon-precomposed">
        <?php $view->style('uikit', 'app/assets/uikit/dist/css/uikit.css') ?>
        <?php $view->style('installer', 'app/installer/assets/css/installer.css') ?>
        <?php $view->script('installer', 'app/installer/app/views/installer.js', ['vue', 'uikit', 'uikit-form-password']) ?>
        <?= $view->render('head') ?>
    </head>
    <body>

        <div id="installer" class="tm-background uk-height-viewport uk-flex uk-flex-center uk-flex-middle" :key="key">
            <div class="tm-container">
                <div class="uk-text-center" ref="start" v-show="step == 'start'">

                    <a class="uk-panel" @click="gotoStep('language')">
                        <img src="app/system/assets/images/biskuit-logo-large.svg" alt="Biskuit">
                        <p>
                            <svg class="tm-arrow" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <line fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="2" y1="18" x2="36" y2="18"/>
                                <polyline fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="26.071,6.5 37.601,18.03 26,29.631 "/>
                            </svg>
                        </p>
                    </a>

                </div>

                <div class="uk-panel uk-card uk-card-default" ref="language" v-show="step == 'language'" >
                    <div>

                        <h1 class="uk-margin-small-bottom uk-text-center">{{ 'Choose language' | trans }}</h1>
                        <div class="uk-margin-large-bottom uk-text-muted uk-text-center">{{ "Select your site language." | trans }}</div>

                        <form class="uk-form" @submit.prevent="stepLanguage">

                            <select class="uk-width-1-1" size="10" v-model="locale">
                                <option v-for="(lang, key) in locales" :value="key">{{ lang }}</option>
                            </select>

                            <p class="uk-text-right">
                                <button class="uk-button uk-button-primary" type="submit">
                                    <span class="uk-flex-inline uk-flex-middle">{{ 'Next' | trans }}
                                        <svg class="uk-margin-small-left" width="18" height="11" viewBox="0 0 18 11" xmlns="http://www.w3.org/2000/svg">
                                            <line fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" x1="3" y1="5.5" x2="15" y2="5.5"/>
                                            <path fill="#FFFFFF" d="M10.5,10.9c-0.128,0-0.256-0.049-0.354-0.146c-0.195-0.195-0.195-0.512,0-0.707l4.597-4.597l-4.597-4.597
                                            c-0.195-0.195-0.195-0.512,0-0.707s0.512-0.195,0.707,0l4.95,4.95c0.195,0.195,0.195,0.512,0,0.707l-4.95,4.95
                                            C10.756,10.852,10.628,10.9,10.5,10.9z"/>
                                        </svg>
                                    </span>
                                </button>
                            </p>
                        </form>

                    </div>

                </div>

                <div class="uk-panel uk-card uk-card-default" ref="database" v-show="step == 'database'">
                    <validation-observer tag="div" v-slot="{ handleSubmit }">

                        <h1 class="uk-margin-small-bottom uk-text-center">{{ 'Connect database' | trans }}</h1>
                        <div class="uk-margin-large-bottom uk-text-muted uk-text-center">{{ 'Enter your database connection details.' | trans }}</div>

                        <div class="uk-alert uk-alert-danger uk-margin uk-text-center" v-show="message"><p>{{ message }}</p></div>

                        <form class="uk-form uk-form-horizontal tm-form-horizontal" @submit.prevent="handleSubmit(stepDatabase)">
                            <div class="uk-margin">
                                <label for="form-dbdriver" class="uk-form-label">{{ 'Driver' | trans }}</label>
                                <div class="uk-form-controls">
                                    <select id="form-dbdriver" class="uk-width-1-1" name="dbdriver" v-model="config.database.default">
                                        <option value="sqlite" v-if="sqlite">SQLite</option>
                                        <option value="mysql">MySQL</option>
                                    </select>
                                </div>
                            </div>
                            <div class="uk-margin" v-if="config.database.default == 'mysql'">
                                <v-validated-input
                                    id="form-mysql-dbhost"
                                    name="host"
                                    rules="required"
                                    label="Hostname"
                                    :error-messages="{ required: 'Host cannot be blank.' }"
                                    v-model="config.database.connections.mysql.host">
                                </v-validated-input>
                                <v-validated-input
                                    id="form-mysql-dbuser"
                                    name="user"
                                    rules="required"
                                    label="User"
                                    :error-messages="{ required: 'User cannot be blank.' }"
                                    v-model="config.database.connections.mysql.user">
                                </v-validated-input>
                                <v-validated-input
                                    id="form-mysql-dbpassword"
                                    name="password"
                                    type="password"
                                    label="Password"
                                    v-model="config.database.connections.mysql.password">
                                </v-validated-input>
                                <v-validated-input
                                    id="form-mysql-dbname"
                                    name="dbname"
                                    rules="required"
                                    label="Database Name"
                                    :error-messages="{ required: 'Database name cannot be blank.' }"
                                    v-model="config.database.connections.mysql.dbname">
                                </v-validated-input>
                                <v-validated-input
                                    id="form-mysql-dbprefix"
                                    name="mysqlprefix"
                                    :rules="{ regex: /^[a-zA-Z][a-zA-Z0-9._\-]*$/ }"
                                    label="Table Prefix"
                                    :error-messages="{ regex: 'Prefix must start with a letter and can only contain alphanumeric characters (A-Z, 0-9) and underscore (_)' }"
                                    v-model="config.database.connections.mysql.prefix">
                                </v-validated-input>
                            </div>
                            <div class="uk-margin" v-else-if="config.database.default == 'sqlite'">
                                <v-validated-input
                                    id="form-sqlite-dbprefix"
                                    name="sqliteprefix"
                                    :rules="{ regex: /^[a-zA-Z][a-zA-Z0-9._\-]*$/ }"
                                    label="Table Prefix"
                                    :error-messages="{ regex: 'Prefix must start with a letter and can only contain alphanumeric characters (A-Z, 0-9) and underscore (_)' }"
                                    v-model="config.database.connections.sqlite.prefix">
                                </v-validated-input>
                            </div>
                            <p class="uk-text-right">
                                <button class="uk-button uk-button-primary" type="submit">
                                    <span class="uk-flex-inline uk-flex-middle">{{ 'Next' | trans }}
                                        <svg class="uk-margin-small-left" width="18" height="11" viewBox="0 0 18 11" xmlns="http://www.w3.org/2000/svg">
                                            <line fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" x1="3" y1="5.5" x2="15" y2="5.5"/>
                                            <path fill="#FFFFFF" d="M10.5,10.9c-0.128,0-0.256-0.049-0.354-0.146c-0.195-0.195-0.195-0.512,0-0.707l4.597-4.597l-4.597-4.597
                                            c-0.195-0.195-0.195-0.512,0-0.707s0.512-0.195,0.707,0l4.95,4.95c0.195,0.195,0.195,0.512,0,0.707l-4.95,4.95
                                            C10.756,10.852,10.628,10.9,10.5,10.9z"/>
                                        </svg>
                                    </span>
                                </button>
                            </p>
                        </form>

                    </validation-observer>
                </div>

                <div class="uk-panel uk-card uk-card-default" ref="site" v-show="step == 'site'">
                    <validation-observer tag="div" v-slot="{ handleSubmit }">

                        <h1 class="uk-margin-small-bottom uk-text-center">{{ 'Setup your site' | trans }}</h1>
                        <div class="uk-margin-large-bottom uk-text-muted uk-text-center">{{ 'Choose a title and create the administrator account.' | trans }}</div>

                        <form class="uk-form uk-form-horizontal tm-form-horizontal" validator="formSite" @submit.prevent="handleSubmit(stepSite)">
                            <v-validated-input
                                id="form-sitename"
                                name="name"
                                rules="required"
                                label="Site Title"
                                :error-messages="{ required: 'Site title cannot be blank.' }"
                                v-model="option['system/site'].title">
                            </v-validated-input>
                            <v-validated-input
                                id="form-username"
                                name="user"
                                :rules="{ required: true, min: 3, regex: /^[a-zA-Z0-9._\-]{3,}$/ }"
                                label="Username"
                                :error-messages="{ required: 'Username cannot be blank.', min: 'Username must be at least 3 charaters long.', regex: 'Username can only contain alphanumeric characters (A-Z, 0-9) and some special characters (._-)' }"
                                v-model="user.username">
                            </v-validated-input>
                            <v-validated-input
                                id="form-password"
                                name="password"
                                type="password"
                                rules="required"
                                label="Password"
                                :error-messages="{ required: 'Password cannot be blank.' }"
                                v-model="user.password">
                            </v-validated-input>
                            <v-validated-input
                                id="form-email"
                                name="email"
                                type="email"
                                rules="required|email"
                                label="Email"
                                :error-messages="{ required: 'Email cannot be blank.', email: 'Field must be a valid email address.' }"
                                v-model="user.email">
                            </v-validated-input>
                            <p class="uk-text-right">
                                <button class="uk-button uk-button-primary" type="submit">
                                    <span class="uk-flex-inline uk-flex-middle">{{ 'Install' | trans }}
                                        <svg class="uk-margin-small-left" width="18" height="11" viewBox="0 0 18 11" xmlns="http://www.w3.org/2000/svg">
                                            <line fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" x1="3" y1="5.5" x2="15" y2="5.5"/>
                                            <path fill="#FFFFFF" d="M10.5,10.9c-0.128,0-0.256-0.049-0.354-0.146c-0.195-0.195-0.195-0.512,0-0.707l4.597-4.597l-4.597-4.597
                                            c-0.195-0.195-0.195-0.512,0-0.707s0.512-0.195,0.707,0l4.95,4.95c0.195,0.195,0.195,0.512,0,0.707l-4.95,4.95
                                            C10.756,10.852,10.628,10.9,10.5,10.9z"/>
                                        </svg>
                                    </span>
                                </button>
                            </p>
                        </form>

                    </validation-observer>
                </div>

                <div ref="finish" v-show="step == 'finish'">
                    <div>
                        <div class="uk-text-center" v-show="status == 'install'">
                            <svg class="tm-loader" width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                                <g><circle cx="0" cy="0" r="70" fill="none" stroke-width="2"/></g>
                            </svg>
                        </div>

                        <div class="uk-text-center" v-show="status == 'finished'">
                            <a class="uk-panel" :href="$url.route('admin')">
                                <svg class="tm-checkmark" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <polyline fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="5.125,63.25 27.375,89.375 95.25,18.875"/>
                                </svg>
                            </a>
                        </div>

                        <div class="uk-panel uk-card uk-card-default" v-show="status == 'failed'">
                            <h1>{{ 'Installation failed!' | trans }}</h1>
                            <div class="uk-text-break">{{ message }}</div>
                            <p class="uk-text-right">
                                <button type="button" class="uk-button uk-button-primary" @click="stepInstall">{{ 'Retry' | trans }}</button>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </body>
</html>
