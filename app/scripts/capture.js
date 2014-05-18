/*****************************************************************************************
 * capture.js
 */

define(
    'capture',
    ['camera', 'lookup', 'alert'],
    function (camera, lookup, alert) {
        return {
            init: function () {        
                var canvas= document.createElement("canvas"), 
                    context = canvas.getContext("2d");

                document.body.addEventListener("keydown", function() {
                    if (event.keyCode === 32 && $('#myModal').is(':visible')) {
                        context.drawImage(video, 0, 0, 320, 240);
                        var url = context.canvas.toDataURL();
                        url = '/assets/images/upc2.png';
                        $('#before').hide();
                        $('#after').empty().show().append($('<img id="barcode">').attr('src', url));

                        window.setTimeout(function() { 
                            lookup.find('0077975082157'); 
                        }, 1250);
                    }
                });

                $('.findAlt').on("click", function() {
                    var upcNow = $("input[type=hidden]").val(),
                        upc = upcNow === '0819021011007' ? '075119647255' : '0819021011007';
                    lookup.find(upc);
                });

                $('form :checkbox').on("click", function() {
                    alert.warn();
                });


                $(document).on('open', '[data-reveal]', function () {
                    $('#before').show();
                    $('#after').hide();
                });
            }
        };
    }
);
