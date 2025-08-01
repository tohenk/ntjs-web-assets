/**
 * TinyMCE version 8.0.1 (2025-07-28)
 */

(function () {
    'use strict';

    var global$1 = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global = tinymce.util.Tools.resolve('tinymce.Env');

    const option = (name) => (editor) => editor.options.get(name);
    const register$2 = (editor) => {
        const registerOption = editor.options.register;
        registerOption('pagebreak_separator', {
            processor: 'string',
            default: '<!-- pagebreak -->'
        });
        registerOption('pagebreak_split_block', {
            processor: 'boolean',
            default: false
        });
    };
    const getSeparatorHtml = option('pagebreak_separator');
    const shouldSplitBlock = option('pagebreak_split_block');

    const pageBreakClass = 'mce-pagebreak';
    const getPlaceholderHtml = (shouldSplitBlock) => {
        const html = `<img src="${global.transparentSrc}" class="${pageBreakClass}" data-mce-resize="false" data-mce-placeholder />`;
        return shouldSplitBlock ? `<p>${html}</p>` : html;
    };
    const setup$1 = (editor) => {
        const separatorHtml = getSeparatorHtml(editor);
        const shouldSplitBlock$1 = () => shouldSplitBlock(editor);
        const pageBreakSeparatorRegExp = new RegExp(separatorHtml.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g, (a) => {
            return '\\' + a;
        }), 'gi');
        editor.on('BeforeSetContent', (e) => {
            e.content = e.content.replace(pageBreakSeparatorRegExp, getPlaceholderHtml(shouldSplitBlock$1()));
        });
        editor.on('PreInit', () => {
            editor.serializer.addNodeFilter('img', (nodes) => {
                let i = nodes.length, node, className;
                while (i--) {
                    node = nodes[i];
                    className = node.attr('class');
                    if (className && className.indexOf(pageBreakClass) !== -1) {
                        // Replace parent block node if pagebreak_split_block is enabled
                        const parentNode = node.parent;
                        if (parentNode && editor.schema.getBlockElements()[parentNode.name] && shouldSplitBlock$1()) {
                            parentNode.type = 3;
                            parentNode.value = separatorHtml;
                            parentNode.raw = true;
                            node.remove();
                            continue;
                        }
                        node.type = 3;
                        node.value = separatorHtml;
                        node.raw = true;
                    }
                }
            });
        });
    };

    const register$1 = (editor) => {
        editor.addCommand('mcePageBreak', () => {
            editor.insertContent(getPlaceholderHtml(shouldSplitBlock(editor)));
        });
    };

    const setup = (editor) => {
        editor.on('ResolveName', (e) => {
            if (e.target.nodeName === 'IMG' && editor.dom.hasClass(e.target, pageBreakClass)) {
                e.name = 'pagebreak';
            }
        });
    };

    const onSetupEditable = (editor) => (api) => {
        const nodeChanged = () => {
            api.setEnabled(editor.selection.isEditable());
        };
        editor.on('NodeChange', nodeChanged);
        nodeChanged();
        return () => {
            editor.off('NodeChange', nodeChanged);
        };
    };
    const register = (editor) => {
        const onAction = () => editor.execCommand('mcePageBreak');
        editor.ui.registry.addButton('pagebreak', {
            icon: 'page-break',
            tooltip: 'Page break',
            onAction,
            onSetup: onSetupEditable(editor)
        });
        editor.ui.registry.addMenuItem('pagebreak', {
            text: 'Page break',
            icon: 'page-break',
            onAction,
            onSetup: onSetupEditable(editor)
        });
    };

    var Plugin = () => {
        global$1.add('pagebreak', (editor) => {
            register$2(editor);
            register$1(editor);
            register(editor);
            setup$1(editor);
            setup(editor);
        });
    };

    Plugin();
    /** *****
     * DO NOT EXPORT ANYTHING
     *
     * IF YOU DO ROLLUP WILL LEAVE A GLOBAL ON THE PAGE
     *******/

})();
