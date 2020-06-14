import DebugbarTemplate from './debugbar.vue';
import TimeInformation from './components/time-information.vue';
import System from './components/system.vue';
import Events from './components/events.vue';
import Routes from './components/routes.vue';
import Memory from './components/memory.vue';
import Database from './components/database.vue';
//import Request from './components/request.vue';
import Auth from './components/auth.vue';
import Log from './components/log.vue';
import Profile from './components/profile.vue';

const Debugbar = Vue.extend(DebugbarTemplate);

Debugbar.component('time-information', TimeInformation);
Debugbar.component('system', System);
Debugbar.component('events', Events);
Debugbar.component('routes', Routes);
Debugbar.component('memory', Memory);
Debugbar.component('database', Database);
//Debugbar.component('request', Request);
Debugbar.component('auth', Auth);
Debugbar.component('log', Log);
Debugbar.component('profile', Profile);

Vue.ready(() => {
    const debugbar = new Debugbar().$mount();
    document.body.appendChild(debugbar.$el);
});

export default Debugbar;
