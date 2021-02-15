var feedback = function(res) {
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://'); //Hochgeladenes Bild in URL umwandeln
        console.log(get_link);
        document.getElementById("urlinput").value=get_link;
        AddImageURLToDatabase(); //Bild mit erhaltener URL der Datenbank hinzufügen

    }
};

new Imgur({
    clientid: '748b784d999969e', //You can change this ClientID
    callback: feedback
});