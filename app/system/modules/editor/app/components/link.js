/**
 * Editor Link plugin.
 */
import LinkPreview from './link-preview.vue';

export default {
    plugin: true,

    created() {
        const vm = this;
        const editor = this.$parent.editor;

        if (!editor || !editor.htmleditor) {
            return;
        }

        this.$options.editor.previewData.links = {
            data: [],
            callback: vm.openModal
        };

        editor
            .off('action.link')
            .on('action.link', (e, editor) => {
                vm.openModal(_.find(vm.$options.editor.previewData.links.data, (link) => {
                    return link.inRange(editor.getCursor());
                }));
            })
            .on('render', () => {
                const regexp = editor.getMode() != 'gfm' ? /<a(?:\s.+?>|\s*>)(?:[^<]*)<\/a>/gi : /<a(?:\s.+?>|\s*>)(?:[^<]*)<\/a>|(?:\[([^\n\]]*)\])(?:\(([^\n\]]*)\))?/gi;
                vm.$options.editor.previewData.links.data = editor.replaceInPreview(regexp, vm.replaceInPreview);
            });
        this.$options.editor.previewComponents['link-preview'] = this.$options.components['link-preview'];
    },

    methods: {
        openModal(link) {
            const parser = new DOMParser();
            const editor = this.$parent.editor;
            const cursor = editor.editor.getCursor();

            if (!link) {
                link = {
                    replace: (value) => {
                        editor.editor.replaceRange(value, cursor);
                    }
                };
            }

            new this.$parent.$options.utils['link-picker']({
                parent: this,
                data: {
                    link: link
                }
            }).$mount()
                .$on('select', (link) => {
                    let content;
                    if ((link.tag || editor.getCursorMode()) == 'html') {
                        if (!link.anchor) {
                            link.anchor = parser.parseFromString('<a></a>', "text/html").body.childNodes[0];
                        }
                        link.anchor.setAttribute('href', link.link);
                        link.anchor.innerHTML = link.txt;
                        content = link.anchor.outerHTML;
                    } else {
                        content = '[' + link.txt + '](' + link.link + ')';
                    }
                    link.replace(content);
                });
        },

        replaceInPreview(data, index) {
            const parser = new DOMParser();

            data.data = {};
            if (data.matches[0][0] == '<') {
                data.anchor = parser.parseFromString(data.matches[0], "text/html").body.childNodes[0];
                data.link = data.anchor.attributes.href ? data.anchor.attributes.href.nodeValue : '';
                data.txt = data.anchor.innerHTML;
                data.tag = 'html';
            } else {
                if (data.matches[data.matches.length - 1][data.matches[data.matches.length - 2] - 1] == '!') return false;
                data.link = data.matches[2];
                data.txt = data.matches[1];
                data.tag = 'gfm';
            }

            return '<link-preview index="' + index + '"></link-preview>';
        }
    },

    components: {
        'link-preview': LinkPreview
    }
};
