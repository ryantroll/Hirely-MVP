/**
 * Created by bdombro on 2/27/16.
 */

var more_arrow = $("#more-arrow");
var body = getBody();
setInterval(function(){
    if( body.scrollHeight - body.scrollTop - body.clientHeight < 2) {
        more_arrow.hide();
    }
    else {
        more_arrow.show();
    }

    if (window.location.href.indexOf('apply') !== -1 || $('.position .mobile-footer').css('display') === 'block') {
        more_arrow.addClass('more-arrow-raised');
    }
    else {
        more_arrow.removeClass('more-arrow-raised');
    }

}, 100);

function isFirefox() {
    return window.navigator.userAgent.indexOf("Firefox") !== -1;
}

function getBody() {
    if (isFirefox()) {
        return document.documentElement;
    }
    return document.body;
}

function scrollToBottom() {
    body.scrollTop = body.scrollTop + body.scrollHeight;
}

function pageDown() {
    body.scrollTop = body.scrollTop + window.innerHeight;
}