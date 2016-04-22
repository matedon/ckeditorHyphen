(function ($) {
    $.fn.ckeditorCustom = function (opts) {
        var fnObj = this;
        opts = $.extend(true, {
            callback: $.noop,
            config: {
                height: 400,
                toolbar: [],
                customConfig: false,
                stylesSet: false,
                defaultLanguage: 'hu',
                language: 'hu',
                allowedContent: true,
                extraPlugins: 'justify,hyphen'
            },
            toolbar: 'min',
            // @formatter:off
        toolbars: {
            min: [
                { name: 'hyphen', items: [ 'hyphen' ] },
                { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ] },
                { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                { name: 'document', items: [ 'Source' ] }
            ]
        }
        // @formatter:on
        }, opts);
        if (opts.toolbars[opts.toolbar] && (!opts.config.toolbar || !opts.config.toolbar.length)) {
            opts.config.toolbar = opts.toolbars[opts.toolbar];
        }
        fnObj.each(function () {
            var $self = $(this),
                editor;
            editor = $self.ckeditor(function () {
                opts.callback(editor);
            }, opts.config);
        });
        return this;
    };

    Hyphenator.config({
        classname : 'ckeHyphenate'
    });

    // Setup demo view

    var $editor = $('.ckeditor'),
        $preview = $('.ckeditorPreview');

    $editor.ckeditorCustom({
        callback: function (editor) {
            var updateTimer = setInterval(function () {
                $preview.html($editor.val());
            }, 1000);
        }
    });
    
})(jQuery);
