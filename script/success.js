var accessToken = getParameterByName('token');
    redirectUrl = getParameterByName('redirectUrl', 'https://api.yarnyard.test/api/doc'); // todo temp value

if (!accessToken) alert ("No token found! Fail..");

document.cookie="yarnyardAccessToken=" + accessToken + "; domain=yarnyard.test";
window.location = redirectUrl;