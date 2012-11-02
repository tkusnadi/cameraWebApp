(function ($) {
    $.device = $.device || {
        getDevice: function (option) {
            var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia), dvc = false;
            if ($.isFunction(getUserMedia)) {
                console.log("device found");
                navigator.getMedia = navigator.getMedia || getUserMedia;
                dvc = new Device(option);
            }
            return dvc;
        }
    };

    var Device = function(option) {
        this.option = option;
    };

    Device.prototype = {
        initialize: function() {
            var dfd = $.Deferred(),
                option = this.option;
            
            navigator.getMedia(option.media, function (stream) {
                if (navigator.mozGetUserMedia) {
                    option.selector.video.mozSrcObject = stream;
                }else {
                    var vendorUrl = window.URL || window.webkitURL;
                    option.selector.video.src = vendorUrl.createObjectURL(stream);
                }
				console.log("play it");
                option.selector.video.play();
                dfd.resolve();
            }, function (err) {
                dfd.fail(err);
            });
            
            return dfd.promise();
        },
        dispose: function() {
            window.URL.revokeObjectURL(this.option.selector.video.src);
        }
    };

})(jQuery)