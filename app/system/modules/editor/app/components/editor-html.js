export default {
    data() {
        return {
            preview: null,
            previewComponents: {},
            previewData: {}
        };
    },

    created() {
        this.$parent.height = this.$parent.height + 47;

        this.$asset({
            css: [
                'app/assets/codemirror/hint.css',
                'app/assets/codemirror/codemirror.css'
            ],
            js: [
                'app/assets/codemirror/codemirror.js',
                'app/assets/marked/marked.min.js',
                'app/assets/uikit/js/components/htmleditor.min.js'
            ]
        }).then(function () {
            const vm = this;

            const editor = this.$parent.editor = UIkit.htmleditor(this.$parent.$refs.editor, _.extend({
                marked: window.marked,
                CodeMirror: window.CodeMirror
            }, this.$parent.options));

            editor.element
                .on('htmleditor-save', function (e, editor) {
                    if (editor.element[0].form) {
                        const event = document.createEvent('HTMLEvents');
                        event.initEvent('submit', true, true);
                        editor.element[0].form.dispatchEvent(event);
                    }
                });

            editor.on('render', () => {
                const regexp = /<script(.*)>[^<]+<\/script>|<style(.*)>[^<]+<\/style>/gi;
                editor.replaceInPreview(regexp, '');
            });

            editor.editor.on('change', () => {
                editor.editor.save();
                vm.$parent.innerValue = editor.editor.getValue();
            });

            editor.on('renderLate', function() {
                Vue.nextTick(function() {
                    if(vm.preview) {
                        // Mounting removes the original child element ==> we need to re-attach it.
                        vm.preview.$el.parentNode.replaceChild(editor.preview.container[0], vm.preview.$el);
                        vm.preview.$destroy();
                    }
                    const PreviewComponent = vm.createPreviewComponent(vm);
                    vm.preview = new PreviewComponent();
                    vm.preview.$mount(editor.preview.container[0]);
                });
            });

            this.$watch('$parent.innerValue', function (value) {
                if (value != editor.editor.getValue()) {
                    editor.editor.setValue(value);
                }
            });

            this.$watch('$parent.options.markdown', function (markdown) {
                    editor.trigger(markdown ? 'enableMarkdown' : 'disableMarkdown');
                }, {immediate: true}
            );

            this.$emit('ready');
        });
    },

    methods: {
        createPreviewComponent(vm) {
            return Vue.extend({
                name: 'html-editor-preview',
                parent: vm,
                components: vm.previewComponents,
                data: () => { return vm.previewData; }
            });
        }
    }
};
