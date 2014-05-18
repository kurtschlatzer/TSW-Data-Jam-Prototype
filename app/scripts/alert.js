/*****************************************************************************************
 * alert.js
 */

define(
    'alert',
    ['jquery'],
    function ($) {
        $.fn.highlight = function (str, className) {
            var regex = new RegExp(str, "gi");
            return this.each(function () {
                this.innerHTML = this.innerHTML.replace(regex, function(matched) {
                    return "<span class=\"" + className + "\">" + matched + "</span>";
                });
            });
        };

        return {
            warn: function () {
                this.unwarn();

                var reds = [];
                $('form :checkbox:checked').each(function (index, item) {
                    reds.push($(item).val());
                });

                reds.forEach(function (item) {
                    $(".product .ingredients").highlight(item, "warn");
                    $(".product .contains").highlight(item, "warn");
                });

                if ($('.product .warn').length) {
                    $('.findAlt').show();
                } else {
                    $('.findAlt').hide(); 
                }
            },
            unwarn: function () {
                $(".product .ingredients span").removeClass("warn");
                $(".product .contains span").removeClass("warn");
            }
        };
    }
);
