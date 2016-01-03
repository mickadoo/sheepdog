var accessToken = getParameterByName('token');
    redirectUrl = getParameterByName('redirectUrl', 'http://api.yarnyard.dev/api/doc'); // todo temp value

if (!accessToken) alert ("No token found! Fail..");

document.cookie="yarnyardAccessToken=" + accessToken + "; domain=yarnyard.dev";
window.location = redirectUrl;