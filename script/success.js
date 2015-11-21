function getParameterByName(name, defaultValue) {
    defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : "";
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? defaultValue : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var accessToken = getParameterByName('token');
    redirectUrl = getParameterByName('redirectUrl', 'http://api.yarnyard.dev/api/doc'); // todo temp value

if (!accessToken) alert ("No token found! Fail..");

document.cookie="yarnyardAccessToken=" + accessToken + "; domain=yarnyard.dev";
window.location = redirectUrl;