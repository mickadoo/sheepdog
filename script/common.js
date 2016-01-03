function getParameterByName(name, defaultValue) {
    defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : "";
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? defaultValue : decodeURIComponent(results[1].replace(/\+/g, " "));
}