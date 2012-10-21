(function ($) {

    // Namespaces

    $.html5Audio = {
        defaultSettings: {},
        config: {},
        that: {},
        object: {},
        const : {
            autoClose: true
        },
        element: {
            audio: {},
            mainContainer: {},
            playPauseContainer: {},
            playBtn: {},
            pauseBtn: {},
            volumeBtn: {},
            songSlider: {},
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

        var constructor = $.html5Audio.object.constructor();
        $.html5Audio.object.configurator();
        var animator = $.html5Audio.object.animator();
        var behavior = $.html5Audio.object.behavior(constructor, animator);
        $.html5Audio.object.binder(behavior, animator);


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

        // Song Slider

        $.html5Audio.element.songSlider = $('<div>').addClass('h5aSongSlider');
        $.html5Audio.element.songSlider.appendTo(songContainer);

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
        $.html5Audio.element.songName.appendTo($.html5Audio.element.songSlider);

        // Putting on markup

        $.html5Audio.element.mainContainer.appendTo($.html5Audio.that);


        //// ** METHODS ** ////

        var showMusicName = function (songSource) {
            var artist = songSource.attr('data-h5a-song-artist');
            var songName = songSource.attr('data-h5a-song-name');

            $.html5Audio.element.songName.text(artist + ' - ' + songName);
        };

        return {
            showMusicName: showMusicName
        };
    };

    $.html5Audio.object.configurator = function () {
        //// ** CONSTRUCTOR ** ////

        // Initial State: Deactivated

        $.html5Audio.element.mainContainer.addClass($.html5Audio.styleClasses.deactivated);

        // Setting Song Sources

        $.html5Audio.element.songSources = $($.html5Audio.config.songSources);
    };

    $.html5Audio.object.behavior = function (constructor, animator) {

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

            animator.animateSongName();
            $.html5Audio.element.audio.play();
        };

        var pause = function () {
            if (!isActive()) return;

            $.html5Audio.element.mainContainer.removeClass(playingClass);
            $.html5Audio.element.mainContainer.addClass(pausedClass);

            animator.stopAnimationSongName();
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
            animator.expandPlayer($.html5Audio.const.autoClose);
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
                constructor.showMusicName(songSource);
                playSong(songUrl);
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


        return {
            play: play,
            pause: pause,
            togglePlayPause: togglePlayPause,
            playSong: playSong,
            togglePlaySongSource: togglePlaySongSource,
            toggleMute: toggleMute
        }
    };

    $.html5Audio.object.animator = function () {
        //// ** CONSTRUCTOR ** ////

        var animateSongName = function () {
            var slider = $.html5Audio.element.songSlider;
            var songName = $.html5Audio.element.songName;
            var width = songName.text().length * 8;
            slider.css({ left: '62px' });
            slider.animate({ left: '-=' + (62 + width) }, 8000, 'linear', animateSongName);
        };

        var stopAnimationSongName = function () {
            var slider = $.html5Audio.element.songSlider;
            slider.stop();
            slider.css({ left: 0 });
        };

        var expandPlayer = function (autoClose) {
            var container = $.html5Audio.element.mainContainer;
            var callBack = function (){};

            if (autoClose) {
                callBack = function () { setInterval(shrinkPlayer, 5000); };
            }

            container.animate({ width: 145 }, 400, callBack);
        };

        var shrinkPlayer = function () {
            var container = $.html5Audio.element.mainContainer;
            container.animate({ width: 70 }, 400);
        };


        return {
            animateSongName: animateSongName,
            stopAnimationSongName: stopAnimationSongName,
            expandPlayer: expandPlayer,
            shrinkPlayer: shrinkPlayer
        };
    };

    $.html5Audio.object.binder = function (behavior, animator) {
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
            });
        }

        $.html5Audio.element.playPauseContainer.click(function (e) { behavior.togglePlayPause(); });
        $.html5Audio.element.volumeBtn.click(function (e) { behavior.toggleMute(); });
        $.html5Audio.element.mainContainer
            .mouseenter(function (e) { animator.expandPlayer(); })
            .mouseleave(function (e) { animator.shrinkPlayer(); });
    };

})(jQuery);