requirejs.config({
    paths: {
        'capture': '/scripts/capture',
        'camera': '/scripts/camera',
        'lookup': '/scripts/lookup',
        'alert': '/scripts/alert'
    },
    shim: {
    }
});

require(['capture'], function (capture) {
    'use strict';
    
    capture.init();
});