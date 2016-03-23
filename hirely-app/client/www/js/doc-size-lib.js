
function isFirefox() {
    return window.navigator.userAgent.indexOf("Firefox") !== -1;
}

function getBody() {
    if (isFirefox()) {
        return document.documentElement;
    }
    return document.body;
}