var feedback = function(res) {
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');//Hochgeladenes Bild in URL umwandeln
        console.log(get_link);
        var urlfield = document.getElementById("MemeLink");
        urlfield.innerText = get_link; //Link in Textfeld einsetzen
        urlfield.href=get_link; //href entsprechend anpassen
        document.getElementsByClassName("Share")[0].style.display="inline"; //Nach Erhalten der URL Share-Button einblenden

    }
};

new Imgur({
    clientid: '748b784d999969e', //You can change this ClientID
    callback: feedback
});