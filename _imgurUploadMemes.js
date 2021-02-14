var feedback = function(res) {
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
        console.log(get_link);
        var urlfield = document.getElementById("MemeLink");
        urlfield.innerText = get_link;
        urlfield.href=get_link;
        document.getElementsByClassName("Share")[0].style.display="inline";

    }
};

new Imgur({
    clientid: '4409588f10776f7', //You can change this ClientID
    callback: feedback
});