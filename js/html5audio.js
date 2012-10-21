(function ($) {

    // Namespaces

    $.html5Audio = {
        defaultSettings: {},
        config: {},
        that: {},
        object: {},
        element: {
            audio: {},
            mainContainer: {},
            playPauseContainer: {},
            playBtn: {},
            pauseBtn: {},
            volumeBtn: {},
            songName: {},
            songSources: []
        },
        styleClasses: {
            deactivated: 'h5aDeactivated',
            playing: 'h5aPlaying',
            paused: 'h5aPaused'
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

        $.html5Audio.element.songName = $('<p>').text($.html5Audio.config.noMusicText);
        $.html5Audio.element.songName.appendTo(songContainer);

        // Putting on markup

        $.html5Audio.element.mainContainer.appendTo($.html5Audio.that);
    };

    $.html5Audio.object.configurator = function () {
        //// ** CONSTRUCTOR ** ////

        // Initial State: Deactivated

        $.html5Audio.element.mainContainer.addClass($.html5Audio.styleClasses.deactivated);

        // Setting Song Sources

        $.html5Audio.element.songSources = $($.html5Audio.config.songSources);
    };

    $.html5Audio.object.behavior = function () {

        var deactivatedClass = $.html5Audio.styleClasses.deactivated;
        var playingClass = $.html5Audio.styleClasses.playing;
        var pausedClass = $.html5Audio.styleClasses.paused;

        //// ** METHODS ** ////

        var isActive = function () {
            return !$.html5Audio.element.mainContainer.hasClass(deactivatedClass);
        };

        var activate = function () {
            $.html5Audio.element.mainContainer.removeClass(deactivatedClass);
            $.html5Audio.element.mainContainer.addClass(pausedClass);
        };

        var play = function () {
            if (!isActive()) return;

            $.html5Audio.element.mainContainer.removeClass(pausedClass);
            $.html5Audio.element.mainContainer.addClass(playingClass);

            $.html5Audio.element.audio.play();
        };

        var pause = function () {
            if (!isActive()) return;

            $.html5Audio.element.mainContainer.removeClass(playingClass);
            $.html5Audio.element.mainContainer.addClass(pausedClass);

            $.html5Audio.element.audio.pause();
        };

        var togglePlayPause = function () {
            if (!isActive()) return;

            var mainContainer = $.html5Audio.element.mainContainer;

            if (mainContainer.hasClass(playingClass)) {
                var playingSong = $.html5Audio.element.songSources.filter('.' + playingClass);
                playingSong.removeClass(playingClass).addClass(pausedClass);
                pause();
            }
            else {
                var playingSong = $.html5Audio.element.songSources.filter('.' + pausedClass);
                playingSong.addClass(playingClass).removeClass(pausedClass);
                play();
            }
        };

        var playSong = function (songUrl) {
            if (!isActive()) { activate(); }

            var mainContainer = $.html5Audio.element.mainContainer;
            mainContainer.find('audio').remove();

            $.html5Audio.element.audio = $('<audio>').attr({ src: songUrl }).appendTo(mainContainer).get(0);

            loud();
            play();
        };

        var togglePlaySongSource = function (songSource) {
            if (songSource.hasClass(playingClass)) {
                songSource.removeClass(playingClass).addClass(pausedClass);
                pause();
            }
            else if (songSource.hasClass(pausedClass)) {
                songSource.removeClass(pausedClass).addClass(playingClass);
                play();
            }
            else {
                $.html5Audio.element.songSources.removeClass(playingClass).removeClass(pausedClass);
                songSource.removeClass(playingClass).addClass(playingClass);
                var songUrl = songSource.attr('data-h5a-song-url');
                playSong(songUrl);
                showMusicName(songSource);
            }
        };

        var loud = function () {
            $.html5Audio.element.volumeBtn.attr('src', $.html5Audio.config.volumeButtonImgSrc);
        };

        var mute = function () {
            $.html5Audio.element.volumeBtn.attr('src', $.html5Audio.config.mutedVolumeButtonImgSrc);
        };

        var toggleMute = function () {
            var isMuted = $.html5Audio.element.audio.muted;

            if (isMuted) {
                loud();
            }
            else {
                mute();
            }

            $.html5Audio.element.audio.muted = !isMuted;
        };

        var showMusicName = function (songSource) {
            var artist = songSource.attr('data-h5a-song-artist');
            var songName = songSource.attr('data-h5a-song-name');

            $.html5Audio.element.songName.text(artist + ' - ' + songName);
        };

        return {
            play: play,
            pause: pause,
            togglePlayPause: togglePlayPause,
            playSong: playSong,
            togglePlaySongSource: togglePlaySongSource,
            toggleMute: toggleMute,
            showMusicName: showMusicName
        }
    };

    $.html5Audio.object.binder = function (behavior) {
        //// ** CONSTRUCTOR ** ////

        var deactivatedClass = $.html5Audio.styleClasses.deactivated;
        var playingClass = $.html5Audio.styleClasses.playing;
        var pausedClass = $.html5Audio.styleClasses.paused;
        var songSources = $.html5Audio.element.songSources;

        if (!$.isEmptyObject(songSources)) {
            songSources.click(function (e) {
                e.preventDefault();
                var _this = $(e.currentTarget);
                behavior.togglePlaySongSource(_this);
                /*if (_this.hasClass(playingClass)) {
                _this.removeClass(playingClass).addClass(pausedClass);
                behavior.pause();
                }
                else if (_this.hasClass(pausedClass)) {
                _this.removeClass(pausedClass).addClass(playingClass);
                behavior.play();
                }
                else {
                $.html5Audio.element.songSources.removeClass(playingClass).removeClass(pausedClass);
                _this.removeClass(playingClass).addClass(playingClass);
                var songUrl = $(e.currentTarget).attr('data-h5a-song-url');
                behavior.playSong(songUrl);
                }*/
            });
        }

        $.html5Audio.element.playPauseContainer.click(function (e) { behavior.togglePlayPause(); });
        $.html5Audio.element.volumeBtn.click(function (e) { behavior.toggleMute(); });
    };

})(jQuery);