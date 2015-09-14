$(document).ready(function() {

    /* ======= Fixed header when scrolled ======= */

    $(window).bind('scroll', function() {
        if ($(window).scrollTop() > 0) {
            $('#header').addClass('navbar-fixed-top');
        }
        else {
            $('#header').removeClass('navbar-fixed-top');
        }
    });

});
/* =================================
 ===  WOW ANIMATION             ====
 =================================== */

new WOW().init();
