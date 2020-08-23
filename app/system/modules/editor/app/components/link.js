/**
 * Editor Link plugin.
 */
import LinkPreview from './link-preview.vue';

export default {
    plugin: true,

    created() {
        const vm = this;

        /*if (!editor || !editor.htmleditor) {
            return;
        }*/

        this.$options.editor.previewData.links = {
            data: [],
            callback: vm.openModal
        };

        this.$options.editor
            .$on('editor-html:toolbar', this.onToolbar)
            .$on('editor-html:render', this.onRender);

        /*editor
            .off('action.link')
            .on('action.link', (e, editor) => {

            })
            .on('render', () => {

            });*/
        this.$options.editor.previewComponents['link-preview'] = this.$options.components['link-preview'];
    },

    methods: {
        openModal(link) {
            const parser = new DOMParser();
            const editor = this.$parent.editor;
            const cursor = editor.codemirror.getCursor();
            const vm = this;

            if (!link) {
                link = {
                    replace: (value) => {
                        editor.codemirror.replaceRange(value, cursor);
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
                    if ((link.tag || !vm.$parent.options.markdown) == 'html') {
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
        },

        linkCallback(editor) {
            this.openModal(_.find(this.$options.editor.previewData.links.data, (link) => {
                return link.inRange(editor.codemirror.getCursor());
            }))
        },

        onToolbar(data) {
            data.icons.push({
                index: 110,
                config: {
                    name: 'link',
                    action: this.linkCallback,
                    className: 'fa fab fa-github',
                    title: 'Create Link'
                }
            });
        },

        onRender(data) {
            const regexp = !data.markdownEnabled ? /<a(?:\s.+?>|\s*>)(?:[^<]*)<\/a>/gi : /<a(?:\s.+?>|\s*>)(?:[^<]*)<\/a>|(?:\[([^\n\]]*)\])(?:\(([^\n\]]*)\))?/gi;
            this.$options.editor.previewData.links.data = data.replaceInPreview(data, regexp, this.replaceInPreview);
        }
    },

    components: {
        'link-preview': LinkPreview
    }
};
