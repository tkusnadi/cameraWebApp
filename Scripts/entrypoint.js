(function ($) {
    $(document).ready(function () {
        var camera = $("#pictureBooth").camera({ width: 320 }),
            btn = $("#startButton"),
            photo = $("#photo");

        console.log("camera is supported: " + camera.isSupported);
       if (camera.isSupported) {
           $.when(camera.initialize()).done(function () {
               btn.click(function() {
                   var data = camera.takePicture();
                   photo.attr('src', data);
               });
           }).fail(function (err) {
               console.log(err[0]);
           });
       }
    });
})(jQuery);