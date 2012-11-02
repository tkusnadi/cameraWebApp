(function ($) {
    $.fn.camera = $.fn.camera || function(options) {
        return new Camera($(this), options);
    };

    //var option = {
    //    width: 320
    //};
    var Camera = function(mainEl, option) {
        var video = document.createElement('video'), device;
        
        video.setAttribute('Id', 'camera-video');
        video.setAttribute('class', 'camera-video');
        mainEl.append(video);

        device = $.device.getDevice({
            media: {
                video: true,
                audio: false
            },
            selector: {
                video: video
            }
        });

        if (device) {
            this.streaming = false;
            this._device = device;
            this.video = video;
            this.option = option;
            this.canvas = document.createElement('canvas');
            this.isSupported = true;
            this.isRunning = false;
        }
    };

    Camera.prototype = {
        initialize: function () {
            var dfd = $.Deferred();
            var self = this;
            if (!this.isSupported) return dfd.fail("browser not supported camera");
            this.video.addEventListener("canplay", $.proxy(this._canPlay, this));

            $.when(this._device.initialize()).done(function () {
                return dfd.resolve();
            }).fail(function (err) {
                self.isRunning = false;
                return dfd.fail(err[0]);
            });

            return dfd.promise();
        },
        takePicture: function (mimeType) {
            this.canvas.width = this.option.width;
            this.canvas.height = this.option.height;
            this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.option.width, this.option.height);
            return this.canvas.toDataURL(mimeType || 'image/png');
        },
        isSupported: false,
        _canPlay: function () {
            var video = this.video,
                canvas = this.canvas,
                height = 0;
            
            if (!this.streaming) {
                this.option.height = video.videoHeight / (video.videoWidth / this.option.width);
                video.setAttribute("width", this.option.width);
                video.setAttribute("height", this.option.height);
                canvas.setAttribute("width", this.option.width);
                canvas.setAttribute("height", this.option.height);
                this.streaming = true;
            }
        },
        dispose: function () {
            if (this.isRunning) this._device.dispose();
        }
    };

  
})(jQuery);