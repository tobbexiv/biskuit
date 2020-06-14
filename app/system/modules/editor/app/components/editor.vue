<template>
    <div>
        <textarea autocomplete="off" :style="{height: height + 'px'}" :class="{'uk-invisible': !show}" ref="editor" @asdf="alert('input');" v-model="innerValue"></textarea>
    </div>
</template>

<script>
    import EditorHtml from './editor-html';
    import EditorCode from './editor-code';
    import PluginLink from './link';
    import PluginImage from './image';
    import PluginVideo from './video';
    import PluginUrl from './url';
    import ImagePicker from './image-picker.vue';
    import VideoPicker from './video-picker.vue';
    import LinkPicker from './link-picker.vue';

    const Editor = {
        props: ['type', 'value', 'options'],

        data: function () {
            return {
                innerValue: this.value,
                show: false,
                editor: {},
                height: 500
            }
        },

        mounted() {
            if (this.options && this.options.height) {
                this.height = this.options.height
            }

            if (this.$el.hasAttributes()) {
                const attrs = this.$el.attributes;
                for (let i = attrs.length - 1; i >= 0; i--) {
                    this.$refs.editor.setAttribute(attrs[i].name, attrs[i].value);
                    this.$el.removeAttribute(attrs[i].name);
                }
            }

            const self = this;
            const type = 'editor-' + this.type
            const components = this.$options.components;
            const EditorType = components[type] || components['editor-' + window.$biskuit.editor] || components['editor-textarea'];
            const EditorComponent = Vue.extend(EditorType);
            const Editor = new EditorComponent({ parent: this })
            Editor.$on('ready', () => {
                _.forIn(components, (component) => {
                    if (component.plugin) {
                        const Plugin = Vue.extend(component);
                        new Plugin({ parent: self, editor: Editor });
                    }
                });
                self.show = true;
            });
        },

        watch: {
            value(newValue) {
                this.innerValue = newValue;
            },

            innerValue(newValue) {
                this.$emit('input', newValue);
            }
        },

        components: {
            'editor-textarea': {
                created() {
                    this.$nextTick(function () {
                        this.$emit('ready');
                    });
                }
            },
            'editor-html': EditorHtml,
            'editor-code': EditorCode,
            'plugin-link': PluginLink,
            'plugin-image': PluginImage,
            'plugin-video': PluginVideo,
            'plugin-url': PluginUrl
        },

        utils: {
            'image-picker': Vue.extend(ImagePicker),
            'video-picker': Vue.extend(VideoPicker),
            'link-picker': Vue.extend(LinkPicker)
        }
    };

    export default Editor;

    Vue.component('v-editor', (resolve) => {
        resolve(Editor);
    });
</script>
