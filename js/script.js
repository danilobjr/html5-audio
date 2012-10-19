$(function () {

    var player = $('#player');

    $('<audio>').attr({ controls: 'controls', src: '' }).appendTo(player);

    $('.song').click(function (e) {
        e.preventDefault();
        var _this = $(this);

        player.find('audio').remove();

        var musicFilePath = _this.attr('href');
        var audio = $('<audio>').attr({ controls: 'controls', src: musicFilePath }).appendTo(player).get(0);

        audio.load();
        audio.play();
    });

});