/*****************************************************************************************
 * capture.js
 */

define(
    'lookup',
    ['jquery', 'alert'],
    function ($, alert) {
        return {
            find: function (upc) {        
                var urlTemplate = "https://www.digit-eyes.com/gtin/v2_0/?upcCode={upc}" +
                                    "&field_names=all&language=en" +
                                    "&app_key={appKey}&signature={signature}",
                    appKey = escape("/2z4ZJoIXFK0"),
                    signature = "xL5Ob8kSxkdAuX+D65rrnc+SIfk=",
                    url = urlTemplate
                            .replace("{upc}", upc)
                            .replace("{appKey}", appKey)
                            .replace("{signature}", signature);

                url = "/assets/data/" + upc + ".json";

                $('#myModal').foundation('reveal', 'close');

                $.getJSON(url, function (data) {
                    $('.product input').attr('value', data.upc_code);
                    if (data.contains) {
                        $('.product .product-name').empty().text(data.description);
                    } else {
                        $('.product .product-name').empty().text(data.description);
                    }
                    $('.product .product-image').attr('src', data.image);
                    $('.product .ingredients').text(data.ingredients);
                    $('.product .contains').text(data.contains || '—');

                    alert.warn();


                    $('.product').show();
                });

                
            }
        };
    }
);
