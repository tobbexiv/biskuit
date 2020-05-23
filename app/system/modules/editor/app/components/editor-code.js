export default {
    created() {
        const self = this;
        const $el = $(this.$parent.$refs.editor);
        const $parentEl = $el.parent();

        $parentEl.addClass('pk-editor');

        this.$asset({
            css: [
                'app/assets/codemirror/hint.css',
                'app/assets/codemirror/codemirror.css'
            ],
            js: [
                'app/assets/codemirror/codemirror.js'
            ]
        }).then(function () {
            this.editor = CodeMirror.fromTextArea(this.$parent.$refs.editor, _.extend({
                mode: 'htmlmixed',
                dragDrop: false,
                autoCloseTags: true,
                matchTags: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                indentUnit: 4,
                indentWithTabs: false,
                tabSize: 4
            }, this.$parent.options));

            $parentEl.attr('data-uk-check-display', 'true').on('display.uk.check', (e) => {
                self.editor.refresh();
            });

            this.editor.on('change', () => {
                self.editor.save();
                self.$parent.innerValue = self.editor.getValue();
            });

            this.$watch('$parent.innerValue', function (value) {
                if (value != this.editor.getValue()) {
                    this.editor.setValue(value);
                }
            });

            this.$emit('ready');
        });
    }
};
