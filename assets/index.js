var isScrollLocked = false;

function runNyanimate() {
    nyanimate(document.getElementById('nyanBlock'));
}

function autoSwitch() {
    autoSwitchTimeout = setTimeout(() => {
        isScrollLocked = true;
        if ($('#final').is(':hidden')) {
            $('.slide:visible').fadeOut(function() { $('#final').fadeIn();}); } 
        },
        1000);
}

$(document).ready(function() {
    var active = $('.slide:visible');
    var scrollHintTimeout;

    function showScrollHint() {
        scrollHintTimeout = setTimeout(() => {$('.slide:visible').append('<div class="arrow"></div>')}, 1500);
    }
    showScrollHint();

    $('#repeat').on('mouseover', function() {
        $('#repeat-text').text('Seriously?');
    })
    .on('mouseout', function() {
        $('#repeat-text').text('Again?');
    })
    .on('click', function() {
        $('.slide:visible').fadeOut(function() {
            location.href = 'vue.html';
        });
    });

    function changeSlide(next, timeout) {
        if (isScrollLocked || $('#final').is(':visible')) {
            return false;
        }

        isScrollLocked = true;

        if (next) {
            active = active.next('.slide');
            if (!active.length) {
                active = $('.slide:last');
                isScrollLocked = false;
                return false;
            }
        } else {
            active = active.prev('.slide');
            if (!active.length) {
                active = $('.slide:first');
                isScrollLocked = false;
                return false;
            }
        }

        $('.slide:visible').fadeOut(function() {
            active.fadeIn(function() {
                var onstart = active.attr("data-attr-onstart");
                $('.arrow').remove();
                if (onstart) {
                    Function('"use strict";return (' + onstart + ')')();
                }
                clearTimeout(scrollHintTimeout);
                setTimeout(() => {isScrollLocked = false;}, timeout || 300);
                showScrollHint();
            });
        });
    }

    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        e.stopPropagation();

        changeSlide(e.deltaY > 0);
    }, { passive: false });

    document.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        changeSlide(true, 1);
    }, { passive: false });

    document.addEventListener('keydown', function(e) {
        if (e.key == 'ArrowUp') {
            changeSlide(false, 1);
        } else if (e.key == 'ArrowDown') {
            changeSlide(true, 1);
        }

    }, { passive: false });

    var swipeStart = null;
    window.addEventListener('touchstart', function (e) {
        swipeStart = e.changedTouches[0];
    });


    window.addEventListener('touchend', function (e) {
        var swipeEnd = e.changedTouches[0];
        if (swipeEnd.screenY - swipeStart.screenY > 0) {
            changeSlide(false);
        }
        else if (swipeEnd.screenY - swipeStart.screenY < 0) {
            changeSlide(true);
        }
    });
});