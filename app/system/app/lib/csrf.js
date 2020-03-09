export default (Vue) => {
    Vue.http.interceptors.unshift((request) => {
        if (!request.crossOrigin) {
            request.headers['X-XSRF-TOKEN'] = Vue.cache.get('_csrf');
        }
    });
    Vue.cache.set('_csrf', window.$biskuit.csrf);
};
