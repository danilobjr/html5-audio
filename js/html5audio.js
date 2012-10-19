(function ($) {

    // Namespaces

    $.html5Audio = {
        defaultSettings: {},
        config: {},
        obj: {},
        fn: {}
    };

    // Default Settings

    $.html5Audio.defaultSettings = {
        playButtonImgSrc: 'images/play.png',
        pauseButtonImgSrc: 'images/pause.png',
        muteButtonImgSrc: 'images/mute.png',
        spectroImgSrc: 'images/spectro.png'
    };

    // Plugin

    $.fn.html5Audio = function (userSettings) {

        // Constructor

        $.html5Audio.obj = $(this);
        $.html5Audio.config = $.extend({}, $.html5Audio.defaultSettings, userSettings); ;

        $.html5Audio.fn.run();

        // Methods

        var play = function () {
            // TODO
        };

        var pause = function () {
            // TODO
        };

        var mute = function () {
            // TODO
        };

        var loadSong = function () {
            // TODO
        };


        return {
            play: play,
            pause: pause,
            mute: mute,
            loadSong: loadSong
        };
    };

    // Functions

    $.html5Audio.fn.run = function () {
        $.html5Audio.fn.createElements();
    };

    $.html5Audio.fn.createElements = function () {
        // Main Container

        var container = $('<div>').addClass('html5Audio');

        // Controls Container

        var controlsContainer = $('<div>');
        controlsContainer.appendTo(container);

        // Spectro Container

        var spectroContainer = $('<div>');
        spectroContainer.appendTo(container);

        // Buttons

        var playBtn = $('<img>').attr('src', $.html5Audio.config.playButtonImgSrc);
        var pauseBtn = $('<img>').attr('src', $.html5Audio.config.pauseButtonImgSrc);
        var muteBtn = $('<img>').attr('src', $.html5Audio.config.muteButtonImgSrc);

        playBtn.appendTo(controlsContainer);
        pauseBtn.appendTo(controlsContainer);
        muteBtn.appendTo(controlsContainer);

        // Spectro

        var spectro = $('<img>').attr('src', $.html5Audio.config.spectroImgSrc);
        spectro.appendTo(spectroContainer);

        // Putting on markup

        container.appendTo($.html5Audio.obj);
    };

})(jQuery);