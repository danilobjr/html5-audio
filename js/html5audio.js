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
        muteButtonImgSrc: 'images/volume_high.png',
        noMusicText: 'No Music'
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
        $.html5Audio.fn.defineBehavior();
    };

    $.html5Audio.fn.createElements = function () {
        // Main Container

        var container = $('<div>').addClass('html5Audio');

        // Controls Container

        var controlsContainer = $('<div>').addClass('h5aControls');
        controlsContainer.appendTo(container);

        // Song Container

        var songContainer = $('<div>').addClass('h5aSong');
        songContainer.appendTo(container);

        // Play / Pause Container

        var playPauseContainer = $('<div>').addClass('h5aPlayPause');
        playPauseContainer.appendTo(controlsContainer);

        // Volume Container

        var volumeContainer = $('<div>').addClass('h5aVolume');
        volumeContainer.appendTo(controlsContainer);

        // Control Buttons

        var playBtn = $('<img>').addClass('h5aPlayBtn').attr('src', $.html5Audio.config.playButtonImgSrc);
        var pauseBtn = $('<img>').addClass('h5aPauseBtn').attr('src', $.html5Audio.config.pauseButtonImgSrc);
        var muteBtn = $('<img>').addClass('h5aMuteBtn').attr('src', $.html5Audio.config.muteButtonImgSrc);

        playBtn.appendTo(playPauseContainer);
        pauseBtn.appendTo(playPauseContainer);
        muteBtn.appendTo(volumeContainer);

        // Song Name

        var song = $('<p>').text($.html5Audio.config.noMusicText);
        song.appendTo(songContainer);

        // Putting on markup

        container.appendTo($.html5Audio.obj);
    };

    $.html5Audio.fn.defineBehavior = function () {
        var obj = $.html5Audio.obj;
        var mainContainer = obj.find('.html5Audio');

        // Initial State: Paused

        mainContainer.addClass('paused');
    };

})(jQuery);