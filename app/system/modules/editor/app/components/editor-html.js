export default {
    data() {
        return {
            preview: null,
            previewComponents: {},
            previewData: {},
            id: null
        };
    },

    created() {
        this.$parent.height = this.$parent.height + 47;
        this.id = this.$parent.$refs.editor.id;

        this.$on('editor-html:render', this.onRender)
            .$on('editor-html:renderLate', this.onRenderLate);

        this.$asset({
            css: [
                'app/assets/codemirror/hint.css',
                'app/assets/codemirror/codemirror.css',
                'app/assets/easymde/easymde.min.css'
            ],
            js: [
                'app/assets/codemirror/codemirror.js',
                'app/assets/marked/marked.min.js',
                'app/assets/easymde/easymde.min.js'
            ]
        }).then(function () {
            const vm = this;

            const editor = this.$parent.editor = new EasyMDE({
                element: this.$parent.$refs.editor,
                spellChecker: false,
                /*autosave: { // TODO: Autosave currently does not work properly.
                    enabled: true,
                    uniqueId: this.id,
                    delay: 1000 * 5,
                    submit_delay: 5000,
                    timeFormat: {
                        locale: 'en-US', // TODO: Use information for/from current locale?
                        format: {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        },
                    },
                    text: this.$trans('Last autsave: ')
                },*/
                previewRender: this.renderPreview,
                //toolbar: false,
            });

            editor.codemirror.on('change', (instance, changeObj) => {
                vm.$parent.innerValue = editor.value();
                vm.renderContent(editor.value());
            });

            this.$watch('$parent.innerValue', function (value) {
                if (value != editor.value()) {
                    editor.value(value);
                    vm.renderContent(editor.value());
                }
            });

            this.renderContent(editor.value());

            this.$emit('ready');

            const data = {
                icons: [ // Array of { index: <int>, config: <string>|<object> }
                    { index: 100, config: '|' },
                    { index: 200, config: '|' },
                    { index: 300, config: '|' },
                    { index: 400, config: '|' },
                    { index: 800, config: '|' },
                    { index: 810, config: 'preview' },
                    { index: 820, config: 'side-by-side' },
                    { index: 830, config: 'fullscreen' }
                ]
            };
            /*[
                'bold',
                'italic',
                'strikethrough',
                '|',
                'link',
                'image',
                '|',
                'quote',
                'unordered-list',
                'ordered-list',
                '|',
                {
                    name: 'new',
                    className: 'fa fa-blind',
                    title: 'New (video is missing)',
                    children: [
                        'heading',
                        'heading-smaller',
                        'heading-bigger',
                        'heading-1',
                        'heading-2',
                        'heading-3',
                        '|',
                        'code',
                        'clean-block',
                        'table',
                        'horizontal-rule'
                    ]
                },
                '|',
                'preview',
                'side-by-side',
                'fullscreen',
                '|',
                'guide'
            ]*/
            this.$emit('editor-html:toolbar', data);
            //editor.createToolbar(_.map(_.sortBy(data.icons, 'index'), 'config'));
        });
    },

    computed: {
        markdownEnabled() {
            return !!this.$parent.options.markdown;
        }
    },

    methods: {
        renderPreview(plainText, preview) {
            const vm = this;
            setTimeout(function() {
                preview.innerHTML = vm.renderContent(plainText);
                vm.$emit('editor-html:renderLate', preview);
            }, 1);
            return this.$trans('Loading...');
        },

        renderContent(content) {
            const data = {
                original: content,
                rendered: content,
                markdownEnabled: this.markdownEnabled,
                replaceInPreview: this.replaceInPreview
            };
            this.$emit('editor-html:render', data);
            if(this.markdownEnabled) {
                data.rendered = window.marked(data.rendered);
            }
            return data.rendered;
        },

        replaceInPreview(data, regexp, callback) {
            // Based on the Uikit 2 HTML Editor replaceInPreview function
            const editor = this.$parent.editor.codemirror;
            const translateOffset = (offset) => {
                const result = data.original.substring(0, offset).split('\n');
                return { line: result.length - 1, ch: result[result.length - 1].length }
            };

            const results = [];
            let offset = -1;
            let index = 0;

            data.rendered = data.rendered.replace(regexp, function() {
                offset = data.original.indexOf(arguments[0], ++offset);
                const match = {
                    matches: arguments,
                    from   : translateOffset(offset),
                    to     : translateOffset(offset + arguments[0].length),
                    replace: (value) => {
                        editor.replaceRange(value, match.from, match.to);
                    },
                    inRange: (cursor) => {
                        if (cursor.line === match.from.line && cursor.line === match.to.line) {
                            return cursor.ch >= match.from.ch && cursor.ch < match.to.ch;
                        }

                        return  (cursor.line === match.from.line && cursor.ch   >= match.from.ch) ||
                                (cursor.line >   match.from.line && cursor.line <  match.to.line) ||
                                (cursor.line === match.to.line   && cursor.ch   <  match.to.ch);
                    }
                };

                let replacement = typeof(callback) === 'string' ? callback : callback(match, index);
                if (!replacement && replacement !== '') {
                    return arguments[0];
                }

                index++;
                results.push(match);

                return replacement;
            });
            return results;
        },

        onRender(data) {
            const regexp = /<script(.*)>[^<]+<\/script>|<style(.*)>[^<]+<\/style>/gi;
            data.replaceInPreview(data, regexp, '');
        },

        onRenderLate(preview) {
            const vm = this;
            Vue.nextTick(function() {
                if(vm.preview) {
                    vm.preview.$destroy();
                }
                const PreviewComponent = vm.createPreviewComponent(vm);
                vm.preview = new PreviewComponent();
                vm.preview.$mount(preview);
            });
        },

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
