/**
 * Created by bdombro on 2/27/16.
 */

var body = document.getElementsByTagName("BODY")[0];
var more_arrow = $("#more-arrow");
setInterval(function(){
    if( body.scrollHeight - body.scrollTop - body.clientHeight < 2) {
        more_arrow.hide();
    }
    else {
        more_arrow.show();
    }

    if (window.location.href.indexOf('apply') !== -1) {
        more_arrow.addClass('more-arrow-raised');
    }
    else {
        more_arrow.removeClass('more-arrow-raised');
    }

}, 100);