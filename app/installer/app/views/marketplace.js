import MarketplaceComponent from '../components/marketplace.vue';

const Marketplace = {
    el: '#marketplace',

    data() {
        return _.extend({
            searchString: this.$session.get('marketplace.search', ''),
            search: this.$session.get('marketplace.search', '')
        }, window.$data);
    },

    watch: {
        searchString: _.throttle(function() {
            this.search = this.searchString;
        }, 300),
        search(search) {
            this.$session.set('marketplace.search', search);
        }
    },

    components: {
        'marketplace': MarketplaceComponent
    }
};

Vue.ready(Marketplace);
