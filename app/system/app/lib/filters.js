export default (Vue) => {
    Vue.filter('baseUrl', (url) => (_.startsWith(url, Vue.url.options.root) ? url.substr(Vue.url.options.root.length) : url));
    Vue.filter('trans', (id, parameters, domain, locale) => Vue.prototype.$trans(id, parameters, domain, locale));
    Vue.filter('transChoice', (id, number, parameters, domain, locale) => Vue.prototype.$transChoice(id, number, parameters, domain, locale));
};
