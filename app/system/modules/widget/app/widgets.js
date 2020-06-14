import WidgetSettings from './components/widget-settings.vue';
import WidgetVisibility from './components/widget-visibility.vue';

window.Widgets = {
    data() {
        return {
            widgets: []
        };
    },

    created() {
        this.resource = this.$resource('api/site/widget{/id}');
    },

    components: {
        'template-settings': {
            template: require('./templates/widget-settings.html')
        },
        settings: WidgetSettings,
        visibility: WidgetVisibility
    }
};

export default window.Widgets;
