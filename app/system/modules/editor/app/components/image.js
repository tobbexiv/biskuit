/**
 * Editor Image plugin.
 */

import ImagePreview from './image-preview.vue';

export default {
    plugin: true,

    created() {
        const vm = this;
        const editor = this.$parent.editor;

        if (!editor || !editor.htmleditor) {
            return;
        }

        this.$options.editor.previewData.images = {
            data: [],
            callback: vm.openModal
        };

        editor
            .off('action.image')
            .on('action.image', (e, editor) => {
                vm.openModal(_.find(vm.$options.editor.previewData.images.data, function (img) {
                    return img.inRange(editor.getCursor());
                }));
            })
            .on('render', () => {
                var regexp = editor.getMode() != 'gfm' ? /<img(.+?)>/gi : /(?:<img(.+?)>|!(?:\[([^\n\]]*)])(?:\(([^\n\]]*?)\))?)/gi;
                vm.$options.editor.previewData.images.data = editor.replaceInPreview(regexp, vm.replaceInPreview);
            });
            this.$options.editor.previewComponents['image-preview'] = this.$options.components['image-preview'];
    },

    methods: {
        openModal(image) {
            const parser = new DOMParser();
            const editor = this.$parent.editor;
            const cursor = editor.editor.getCursor();

            if (!image) {
                image = {
                    replace: (value) => {
                        editor.editor.replaceRange(value, cursor);
                    }
                };
            }

            new this.$parent.$options.utils['image-picker']({
                parent: this,
                data: {
                    image: image
                }
            }).$mount()
                .$on('select', function (image) {
                    let content;
                    if ((image.tag || editor.getCursorMode()) == 'html') {
                        if (!image.anchor) {
                            image.anchor = parser.parseFromString('<img>', "text/html").body.childNodes[0];;
                        }
                        image.anchor.setAttribute('src', image.data.src);
                        image.anchor.setAttribute('alt', image.data.alt);
                        content = image.anchor.outerHTML;
                    } else {
                        content = '![' + image.data.alt + '](' + image.data.src + ')';
                    }
                    image.replace(content);
                });
        },

        replaceInPreview(data, index) {
            const parser = new DOMParser();

            data.data = {};
            if (data.matches[0][0] == '<') {
                data.anchor = parser.parseFromString(data.matches[0], "text/html").body.childNodes[0];
                data.data.src = data.anchor.attributes.src ? data.anchor.attributes.src.nodeValue : '';
                data.data.alt = data.anchor.attributes.alt ? data.anchor.attributes.alt.nodeValue : '';
                data.tag = 'html';
            } else {
                data.data.src = data.matches[3];
                data.data.alt = data.matches[2];
                data.tag = 'gfm';
            }

            return '<image-preview index="' + index + '"></image-preview>';
        }
    },

    components: {
        'image-preview': ImagePreview
    }
};
