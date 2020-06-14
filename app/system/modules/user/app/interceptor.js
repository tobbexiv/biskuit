import loginModal from './components/modal-login.vue';
let mutex;

Vue.http.interceptors.push((request) => {
    let options = _.clone(request);

    return (response) => {
        if (options.crossOrigin || response.status !== 401 || options.headers.get('X-LOGIN')) {
           return response;
        }

        if (!mutex) {
            mutex = new Vue(loginModal).promise.finally(() => {
                mutex = undefined;
            });
        }

        return mutex.then(() => {
            return Vue.http(options);
        });
    }
});
