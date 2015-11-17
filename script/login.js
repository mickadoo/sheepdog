function login(loginForm) {

    var username = loginForm.elements['username'].value;
    var password = loginForm.elements['password'].value;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        // state 4 = done
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var accessToken = JSON.parse(xhttp.responseText).access_token;
                localStorage.setItem('accessToken',accessToken);

                // todo remove this debug code
                debugBox = document.createElement('div');
                debugBox.innerHTML = accessToken + '<br>';
                loginForm.appendChild(debugBox);
            } else {
                alert('Login Failed: ' + xhttp.status);
            }
        }
    };

    xhttp.open("POST", "http://localhost:3000/oauth/token", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+username+"&password="+password+"&client_id=local&grant_type=password");
}