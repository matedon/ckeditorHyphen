CKEDITOR.plugins.add('hyphen', {
    icons: 'hyphen',
    init: function (editor) {
        if (!(Hyphenator && Hyphenator.config)) {
            console.error('CKEdior Hyphenator init failed, Hyphenator plugin missing!');
            return false;
        }
        var options = {
            className: 'ckeHyphenate',
            language: editor.config.language
        };
        Hyphenator.config({
            displaytogglebox: false,
            togglebox : function () {
                return false;
            },
            classname : options.className
        });
        editor.ui.addButton('hyphen', {
            label: 'hyphen',
            command: 'hyphenArea',
            toolbar: 'insert'
        });
        var hyphenArea = editor.addCommand('hyphenArea', {
            exec: function (editor) {
                console.info(editor);
                var selection = editor.getSelection(),
                    start = selection.getStartElement(),
                    element = start.$,
                    $element = $(element);
                if ($element.length) {
                    if ($element.parents().andSelf().hasClass(options.className)) {
                        // $element.html($element.html().replace(String.fromCharCode(173), ''));
                        var ancient = editor.element.$,
                            $ancient = $(ancient);
                        Hyphenator.toggleHyphenation();
                        $element.closest('body').html($ancient.val());
                        $element.removeClass(options.className);
                        hyphenArea.setState(CKEDITOR.TRISTATE_OFF);
                    } else {
                        Hyphenator.hyphenate(element, options.language);
                        $element.addClass(options.className);
                        hyphenArea.setState(CKEDITOR.TRISTATE_ON);
                    }
                }

            }
        });
        editor.on('instanceReady', function (e) {
            var editable = editor.editable().$,
                $editable = $(editable);
            $editable.find('.' + options.className).each(function () {
                Hyphenator.hyphenate(this, options.language);
            });
            $editable.on('click', function (event) {
                var selection = editor.getSelection(),
                    start = selection.getStartElement(),
                    element = start.$,
                    $element = $(element);
                if ($element.length) {
                    if ($element.parents().andSelf().hasClass(options.className)) {
                        hyphenArea.setState(CKEDITOR.TRISTATE_ON);
                    } else {
                        hyphenArea.setState(CKEDITOR.TRISTATE_OFF);
                    }
                }
            });
        });
    }
});
