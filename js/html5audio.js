(function ($) {

    // Namespaces

    $.html5Audio = {
        defaultSettings: {},
        config: {},
        that: {},
        object: {},
        element: {
            mainContainer: {},
            playPauseContainer: {},
            playBtn: {},
            pauseBtn: {},
            volumeBtn: {},
            songSources: []
        }
    };

    // Default Settings

    $.html5Audio.defaultSettings = {
        playButtonImgSrc: 'images/play.png',
        pauseButtonImgSrc: 'images/pause.png',
        volumeButtonImgSrc: 'images/volume_max.png',
        mutedVolumeButtonImgSrc: 'images/volume_muted.png',
        noMusicText: 'No Music',
        songSources: []
    };

    // Plugin

    $.fn.html5Audio = function (userSettings) {

        //// ** CONSTRUCTOR ** ////

        $.html5Audio.that = $(this);
        $.html5Audio.config = $.extend({}, $.html5Audio.defaultSettings, userSettings); ;

        $.html5Audio.object.constructor();
        $.html5Audio.object.configurator();
        var behavior = $.html5Audio.object.behavior();
        $.html5Audio.object.binder(behavior);


        return {
            play: behavior.play,
            pause: behavior.pause,
            togglePlayPause: behavior.togglePlayPause,
            toggleMute: behavior.toggleMute
        };
    };

    // Objects

    $.html5Audio.object.constructor = function () {

        //// ** CONSTRUCTOR ** ////

        // Main Container

        $.html5Audio.element.mainContainer = $('<div>').addClass('html5Audio');

        // Controls Container

        var controlsContainer = $('<div>').addClass('h5aControls');
        controlsContainer.appendTo($.html5Audio.element.mainContainer);

        // Song Container

        var songContainer = $('<div>').addClass('h5aSong');
        songContainer.appendTo($.html5Audio.element.mainContainer);

        // Play / Pause Container

        $.html5Audio.element.playPauseContainer = $('<div>').addClass('h5aPlayPause');
        $.html5Audio.element.playPauseContainer.appendTo(controlsContainer);

        // Volume Container

        var volumeContainer = $('<div>').addClass('h5aVolume');
        volumeContainer.appendTo(controlsContainer);

        // Control Buttons

        $.html5Audio.element.playBtn = $('<img>').addClass('h5aPlayBtn').attr('src', $.html5Audio.config.playButtonImgSrc);
        $.html5Audio.element.pauseBtn = $('<img>').addClass('h5aPauseBtn').attr('src', $.html5Audio.config.pauseButtonImgSrc);
        $.html5Audio.element.volumeBtn = $('<img>').addClass('h5aMuteBtn').attr('src', $.html5Audio.config.volumeButtonImgSrc);

        $.html5Audio.element.playBtn.appendTo($.html5Audio.element.playPauseContainer);
        $.html5Audio.element.pauseBtn.appendTo($.html5Audio.element.playPauseContainer);
        $.html5Audio.element.volumeBtn.appendTo(volumeContainer);

        // Song Name

        var song = $('<p>').text($.html5Audio.config.noMusicText);
        song.appendTo(songContainer);

        // Putting on markup

        $.html5Audio.element.mainContainer.appendTo($.html5Audio.that);

        // TODO : DELETE THIS CODE

        $.html5Audio.element.audio = $('<audio>').attr({ src: 'musics/01.mp3' }).appendTo($.html5Audio.element.mainContainer).get(0);
    };

    $.html5Audio.object.configurator = function () {
        //// ** CONSTRUCTOR ** ////

        // Initial State: Paused

        $.html5Audio.element.mainContainer.addClass('paused');

        // Setting Song Sources

        $.html5Audio.element.songSources = $.html5Audio.config.songSources;
    };

    $.html5Audio.object.behavior = function () {

        //// ** METHODS ** ////

        var play = function (e) {
            $.html5Audio.element.mainContainer.removeClass('paused');
            $.html5Audio.element.mainContainer.addClass('playing');

            $.html5Audio.element.audio.play();
        };

        var pause = function (e) {
            $.html5Audio.element.mainContainer.removeClass('playing');
            $.html5Audio.element.mainContainer.addClass('paused');

            $.html5Audio.element.audio.pause();
        };

        var togglePlayPause = function (e) {
            var mainContainer = $.html5Audio.element.mainContainer;

            if (mainContainer.hasClass('playing')) {
                pause();
            }
            else {
                play();
            }
        };

        var playSong = function (songUrl) {
            var mainContainer = $.html5Audio.element.mainContainer;
            mainContainer.find('audio').remove();

            $.html5Audio.element.audio = $('<audio>').attr({ src: songUrl }).appendTo(mainContainer).get(0);

            play();
        };

        var toggleMute = function (e) {
            var isMuted = $.html5Audio.element.audio.muted;

            if (isMuted) {
                $.html5Audio.element.volumeBtn.attr('src', $.html5Audio.config.volumeButtonImgSrc);
            }
            else {
                $.html5Audio.element.volumeBtn.attr('src', $.html5Audio.config.mutedVolumeButtonImgSrc);
            }

            $.html5Audio.element.audio.muted = !isMuted;
        };


        return {
            play: play,
            pause: pause,
            togglePlayPause: togglePlayPause,
            playSong: playSong,
            toggleMute: toggleMute
        }
    };

    $.html5Audio.object.binder = function (behavior) {
        //// ** CONSTRUCTOR ** ////

        if ($.html5Audio.element.songSources.length) {
            $.html5Audio.element.songSources.click(function (e) {
                e.preventDefault();
                songUrl = $(e.currentTarget).attr('h5a-song-url');
            });
            behavior.playSong(songUrl);
        }

        $.html5Audio.element.playPauseContainer.click(function (e) { behavior.togglePlayPause(e); });
        $.html5Audio.element.volumeBtn.click(function (e) { behavior.toggleMute(e); });
    };

})(jQuery);