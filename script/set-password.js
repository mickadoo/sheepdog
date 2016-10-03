var accessToken = getParameterByName('token'),
    email = getParameterByName('email');

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('token').value = accessToken;
    document.getElementById('email').value = email;
});

function getToken(passwordForm) {
    var email = passwordForm.elements['email'].value;
    var token = passwordForm.elements['token'].value;
    var password = passwordForm.elements['password'].value;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        // state 4 = done
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                console.log(xhttp);
                window.location = "/success?token=" + xhttp.response.accessToken;
            } else {
                alert('Something wrong with that: ' + xhttp.responseText);
            }
        }
    };

    // todo remove hardcoded host
    xhttp.open("POST", "https://login.yarnyard.test/set-password", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // todo what about passwords with &, must escape
    xhttp.send("email="+email+"&password="+password+"&token="+token);
}
