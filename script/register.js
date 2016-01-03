function register(loginForm) {

    var email = loginForm.elements['email'].value;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        // state 4 = done
        if (xhttp.readyState === 4) {
            if (xhttp.status === 204) {
                alert("Check ya email!");
            } else {
                alert('Registration Failed: ' + xhttp.responseText);
            }
        }
    };

    xhttp.open("POST", "http://login.yarnyard.dev/register", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("email="+email);
}