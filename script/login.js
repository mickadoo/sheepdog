function login(loginForm) {

    var email = loginForm.elements['email'].value;
    var password = loginForm.elements['password'].value;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        // state 4 = done
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var accessToken = JSON.parse(xhttp.responseText).access_token;
                window.location = "/success?token="+accessToken;
            } else {
                alert('Login Failed: ' + xhttp.responseText);
            }
        }
    };

    xhttp.open("POST", "https://login.yarnyard.test/oauth/token", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+email+"&password="+password+"&client_id=local&grant_type=password");
}