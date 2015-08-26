$(document).ready(function() {

    
    /* ======= FAQ accordion ======= */

    function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find('.panel-title a')
        .toggleClass('active')
        .find("i.fa")
        .toggleClass('fa-plus-square fa-minus-square');
    }
    $('.panel').on('hidden.bs.collapse', toggleIcon);
    $('.panel').on('shown.bs.collapse', toggleIcon);
    
    /* ======= Fixed header when scrolled ======= */
    
    $(window).bind('scroll', function() {
         if ($(window).scrollTop() > 0) {
             $('#header').addClass('navbar-fixed-top');
         }
         else {
             $('#header').removeClass('navbar-fixed-top');
         }
    });
    
    /* ======= Toggle between Signup & Login & ResetPass Modals ======= */ 
    $('#signup-link').on('click', function(e) {
        $('#signup-modal').modal();
        $('#login-modal').modal('toggle');
        e.preventDefault();
    });
    
    $('#login-link').on('click', function(e) {
        $('#login-modal').modal();
        $('#signup-modal').modal('toggle');
        e.preventDefault();
    });
    
    $('#back-to-login-link').on('click', function(e) {
        $('#login-modal').modal();
        $('#resetpass-modal').modal('toggle');
        e.preventDefault();
    });
    
    $('#resetpass-link').on('click', function(e) {
        $('#login-modal').modal('hide');
        e.preventDefault();
    });
    
    /* ======= Price Plan CTA buttons trigger signup modal ======= */ 
    
    $('#price-plan .btn-cta').on('click', function(e) {
        $('#signup-modal').modal();
        e.preventDefault();
    });


});