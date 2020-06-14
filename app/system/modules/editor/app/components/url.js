/**
 * URL resolver plugin
 */

export default {
    plugin: true,

    created() {
        const editor = this.$parent.editor;
        
        if (!editor || !editor.htmleditor) {
            return;
        }

        editor.element.on('renderLate', () => {
            editor.replaceInPreview(/src=["'](.+?)["']/gi, (data) => {
                let replacement = data.matches[0];
                if (!data.matches[1].match(/^(\/|http:|https:|ftp:)/i)) {
                    replacement = replacement.replace(data.matches[1], Vue.url(data.matches[1], true));
                }
                return replacement;
            });
        });
    }
};
