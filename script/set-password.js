var accessToken = getParameterByName('token'),
    email = getParameterByName('email');

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('token').value = accessToken;
    document.getElementById('email').value = email;
});
