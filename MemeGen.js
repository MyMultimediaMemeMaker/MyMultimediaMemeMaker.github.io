// html Elemente aus MeemeGen.html
var topPlus = document.getElementsByClassName("topText");
var topText  = document.getElementsByClassName("topInput");
var topMinus  = document.getElementsByClassName("topTextRemove");
var botPlus = document.getElementsByClassName("bottomText");
var botText  = document.getElementsByClassName("bottomInput");
var botMinus  = document.getElementsByClassName("bottomTextRemove");
var topMemetext = document.getElementById("MemeTextOben");
var botMemetext = document.getElementById("MemeTextUnten");
var midText  = document.getElementsByClassName("middleInput");
var midMinus  = document.getElementsByClassName("midTextRemove");
var midPlus = document.getElementsByClassName("midText");
var midMemetext = document.getElementById("MemeTextMitte");
var galeryContainer = document.getElementsByClassName("ImageGalerie");
var UploadFormURL = document.getElementsByClassName("UploadFormURL");
var UploadFormImg = document.getElementsByClassName("UploadFormImg");
var UploadFormScreenshot =document.getElementsByClassName("UploadFormScreenshot");
var AllGalButtons = document.getElementsByClassName("AllButtons");
var APIGalButtons = document.getElementsByClassName("APIButtons");

var memes = []; // Array für alle relevanten/angezeigten Memes (den Filtern entsprechend)
var t1left = 0; // oberer Text
var t3left = 0; // unterer Text

// schreibe User Name oben rechts in die Ecke
document.getElementById("UserName4").innerHTML = sessionStorage.getItem('User');

StartConfig();

// Lade die Startkonfiguration
function StartConfig(){

    topPlus[0].style.display = "inline";
    midPlus[0].style.display = "inline";
    topText[0].style.display = "none";
    midText[0].style.display = "none";
    topMinus[0].style.display = "none";
    midMinus[0].style.display = "none";
    botPlus[0].style.display = "inline";
    botText[0].style.display = "none";
    botMinus[0].style.display = "none";
    galeryContainer[0].style.display = "none";
    UploadFormURL[0].style.display = "none";
    UploadFormImg[0].style.display = "none";
    UploadFormScreenshot[0].style.display = "none";
    APIGalButtons[0].style.display = "none";
    AllGalButtons[0].style.display = "none";
    // Informationsfeld ausblende
    xInfo();
    // Daten für Hintergrundbilder laden
    loadImageUrls();
}

// füge Bild der Hintergrundbild-Datenbank hinzu
function AddImageURLToDatabase(){
    // Anfrage an den Server (Route "add"). Übergebe "preset" = true (definiert Bild als Hintergrundbild)
    let request = "http://localhost:3000/add?url=" + document.getElementById("urlinput").value+"&preset=true";
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
        }
    }, false);

    XMLHTTP.send(null);
    // lade Hintergrundbilder neu, um Änderungen anzuzeigen
    loadImageUrls();
    // lade Startkonfiguaration
    StartConfig();
}

// Zeigt das Formular zur Eingabe eienr Bild-URL an
function UploadImageURL(){
    // lade Startkonfiguaration
    StartConfig();
    UploadFormURL[0].style.display = "inline";
}

// Zeigt das Formular zum Hochladen eines Hintergrundbildes an
function UploadImageImg(){
    // lade Startkonfiguaration
    StartConfig();
    UploadFormImg[0].style.display = "inline";
}

// beziehe alle Hintergrundbilder vom Server
function loadImageUrls() {
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET","http://localhost:3000/get_backgrounds");
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg:
        if (XMLHTTP.readyState == 4) {
            // wandle in JSON um
            const j = JSON.parse(XMLHTTP.response)
            memes = j;
            var length = memes.length;
            // wähle Bild aus wenn Bildliste nicht "0" ist.
            if(length != 0)
                document.getElementById("backImage").src = memes[length-1].Url;
        }
    }, false);

    XMLHTTP.send(null);

}

// zeige oberes Testeingabefeld an
function TopPlusPressed(){
    topPlus[0].style.display = "none";
    topText[0].style.display = "inline";
    topMinus[0].style.display ="inline";
}
// zeige unteres Testeingabefeld an
function BottomPlusPressed(){
    botPlus[0].style.display = "none";
    botText[0].style.display = "inline";
    botMinus[0].style.display = "inline";
}
// blende unteres Testeingabefeld aus
function BottomMinusPressed(){
    document.getElementById("input2").value ="";
    updateBottomText();
    botPlus[0].style.display = "inline";
    botText[0].style.display = "none";
    botMinus[0].style.display = "none";

}
// blende oberes Testeingabefeld aus
function TopMinusPressed(){
    document.getElementById("input1").value ="";
    updateTopText();
    topPlus[0].style.display = "inline";
    topText[0].style.display = "none";
    topMinus[0].style.display ="none";

}
// zeige mittleres Testeingabefeld an
function MidPlusPressed(){
    midPlus[0].style.display = "none";
    midText[0].style.display = "inline";
    midMinus[0].style.display = "inline";
}
// blende mittleres Testeingabefeld aus
function MidMinusPressed(){
    document.getElementById("input3").value ="";
    updateMiddleText();
    midPlus[0].style.display = "inline";
    midText[0].style.display = "none";
    midMinus[0].style.display ="none";

}
// setzt den oberen Text auf dem Meme mit dem Texteingabefeld gleich
function updateTopText(){
    topMemetext.innerHTML = document.getElementById("input1").value;
}
// setzt den unteren Text auf dem Meme mit dem Texteingabefeld gleich
function updateBottomText(){
    botMemetext.innerHTML = document.getElementById("input2").value;
}
// setzt den mittleren Text auf dem Meme mit dem Texteingabefeld gleich
function updateMiddleText(){
    midMemetext.innerHTML = document.getElementById("input3").value;
}

// zeigt eine zufällige Auswahl von Hintergrundbildern
function showGal(){
    // lade Startkonfiguaration
    StartConfig();
    // randomisiere Gallerie
    refreshGal();
    galeryContainer[0].style.display = "inline";
    // zeigt die Info-Buttons über den einzelnen Bildern an
    showinfo(true);
    // Selektiert das erste Bild der zufälligen Auswahl als Hintergrundbild aus
    setTimeout(()=>{document.getElementById("backImage").src = document.getElementById("G1").src}
        , 300);

}

// referiert auf die aktuelle Position der Gallerie
var galerypointer = 0;

// blendet die Gallerie mit allen Bildern ein. Zeigt die Memes der Reihenfolge nach an, beginnend mit den ersten sechs.
function ShowAllGalery(){
    // lade Startkonfiguaration
    StartConfig()
    AllGalButtons[0].style.display = "inline";
    galeryContainer[0].style.display = "inline";
    // zeigt die Info-Buttons über den einzelnen Bildern an
    showinfo(true);
    galerypointer = 0;
    document.getElementById("G1").src = memes[0].Url;
    document.getElementById("G2").src = memes[1].Url;
    document.getElementById("G3").src = memes[2].Url;
    document.getElementById("G4").src = memes[3].Url;
    document.getElementById("G5").src = memes[4].Url;
    document.getElementById("G6").src = memes[5].Url;
}

// Bewege die Gallerie eins weiter
function GaleryNext(){
    var l = memes.length;
    galerypointer = galerypointer +1;
    document.getElementById("G1").src = memes[(galerypointer+0)%l].Url;
    document.getElementById("G2").src = memes[(galerypointer+1)%l].Url;
    document.getElementById("G3").src = memes[(galerypointer+2)%l].Url;
    document.getElementById("G4").src = memes[(galerypointer+3)%l].Url;
    document.getElementById("G5").src = memes[(galerypointer+4)%l].Url;
    document.getElementById("G6").src = memes[(galerypointer+5)%l].Url;
}
// Bewege die Gallerie eins zurück
function GaleryPrev(){
    var l = memes.length;
    galerypointer = galerypointer -1;
    if(galerypointer <0){
        galerypointer = galerypointer+l;
    }
    document.getElementById("G1").src = memes[(galerypointer+0)%l].Url;
    document.getElementById("G2").src = memes[(galerypointer+1)%l].Url;
    document.getElementById("G3").src = memes[(galerypointer+2)%l].Url;
    document.getElementById("G4").src = memes[(galerypointer+3)%l].Url;
    document.getElementById("G5").src = memes[(galerypointer+4)%l].Url;
    document.getElementById("G6").src = memes[(galerypointer+5)%l].Url;
}

// Randomisiert die Reihenfolge der Hintergrundbilder in der Gallerie
function refreshGal(){
    var length = memes.length;
    var chosen = [];
    // wählt 6 UNTERSCHIEDLICHE Bilder aus
    for(var i =0; i<6; i++){
        var neu = false;
        var h
        while(!neu){
            h =Math.floor(Math.random() * length);
            if(!chosen.includes(h)){
                chosen[i] = h;
                neu = true;
            }
        }
    }
    // setze die 6 zufälligen Bilder als Gallerie-Bilder
    document.getElementById("G1").src = memes[chosen[1]].Url;
    document.getElementById("G2").src = memes[chosen[2]].Url;
    document.getElementById("G3").src = memes[chosen[3]].Url;
    document.getElementById("G4").src = memes[chosen[4]].Url;
    document.getElementById("G5").src = memes[chosen[5]].Url;
    document.getElementById("G6").src = memes[chosen[0]].Url;
}

// setzt den Meme-Hintergrund bei Auswahl eines Galleribildes
function updateBackground(index){

    // wählt Bild anhand der Position in der Gallerie aus
    if(index==1) document.getElementById("backImage").src = document.getElementById("G1").src;
    if(index==2) document.getElementById("backImage").src = document.getElementById("G2").src;
    if(index==3) document.getElementById("backImage").src = document.getElementById("G3").src;
    if(index==4) document.getElementById("backImage").src = document.getElementById("G4").src;
    if(index==5) document.getElementById("backImage").src = document.getElementById("G5").src;
    if(index==6) document.getElementById("backImage").src = document.getElementById("G6").src;

    // lädt die ID des gewählten Hintergrundbildes
    var memeid = memebyindex(index)._id;
    // "likes" entspricht hier der Anzahl, wie oft ein Hintergrund als Memehintergrund ausgewählt wurde
    var likeid = "1";
    // Auswahl dem Server über "add_like" mitteilen
    let request = "http://localhost:3000/add_like?memeid="+memeid+"&likeid="+likeid;

    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            //console.log("Selecter pushed");

        }
    }, false);

    XMLHTTP.send(null);
}

// Findet ein Meme basierend auf der Gallerie-Position
function memebyindex(index){
    var url = "";
    if(index==1) url = document.getElementById("G1").src;
    if(index==2) url = document.getElementById("G2").src;
    if(index==3) url = document.getElementById("G3").src;
    if(index==4) url = document.getElementById("G4").src;
    if(index==5) url = document.getElementById("G5").src;
    if(index==6) url = document.getElementById("G6").src;
    var meme = memes.find(({Url}) => Url ===url);
    return meme;

}

// Findet Meme basierend auf Bild-URL
function memebyurl(url){
    var meme = memes.find(({Url}) => Url ===url);
    return meme;
}

// zeigt Hintergrundbilder der "ImgFlip" Gallerie an
function ShowMemeAPI(){
    // Anfrage an die "ImgFlip"-API
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET","https://api.imgflip.com/get_memes");
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg
        if (XMLHTTP.readyState == 4) {
            // wandle in JSON um
            const j = JSON.parse(XMLHTTP.response)
            memesImgFlip = j.data.memes;
            var length = memes.length;
            // setze Hintergrundbild
            if(length !=0){}
                document.getElementById("backImage").src =  memes[length-1].url;
            // lade Startkonfiguration
            StartConfig()
            APIGalButtons[0].style.display = "inline";
            galeryContainer[0].style.display = "inline";
            galerypointer = 0;
            // verstecke Infobuttons
            showinfo(false);
            // Zeigt die Memes der Reihenfolge nach an, beginnend mit den ersten sechs.
            document.getElementById("G1").src = memesImgFlip[0].url;
            document.getElementById("G2").src = memesImgFlip[1].url;
            document.getElementById("G3").src = memesImgFlip[2].url;
            document.getElementById("G4").src = memesImgFlip[3].url;
            document.getElementById("G5").src = memesImgFlip[4].url;
            document.getElementById("G6").src = memesImgFlip[5].url;
        }
    }, false);

    XMLHTTP.send(null);


}
// Bewege die Gallerie eins weiter
function GaleryNextAPI(){
    var l = memesImgFlip.length;
    galerypointer = galerypointer +1;
    document.getElementById("G1").src = memesImgFlip[(galerypointer+0)%l].url;
    document.getElementById("G2").src = memesImgFlip[(galerypointer+1)%l].url;
    document.getElementById("G3").src = memesImgFlip[(galerypointer+2)%l].url;
    document.getElementById("G4").src = memesImgFlip[(galerypointer+3)%l].url;
    document.getElementById("G5").src = memesImgFlip[(galerypointer+4)%l].url;
    document.getElementById("G6").src = memesImgFlip[(galerypointer+5)%l].url;
}
// Bewege die Gallerie eins zurück
function GaleryPrevAPI(){
    var l = memesImgFlip.length;
    galerypointer = galerypointer -1;
    if(galerypointer <0){
        galerypointer = galerypointer+l;
    }
    document.getElementById("G1").src = memesImgFlip[(galerypointer+0)%l].url;
    document.getElementById("G2").src = memesImgFlip[(galerypointer+1)%l].url;
    document.getElementById("G3").src = memesImgFlip[(galerypointer+2)%l].url;
    document.getElementById("G4").src = memesImgFlip[(galerypointer+3)%l].url;
    document.getElementById("G5").src = memesImgFlip[(galerypointer+4)%l].url;
    document.getElementById("G6").src = memesImgFlip[(galerypointer+5)%l].url;
}

// Ein/ausbelnden der Infobuttons für jedes Gallerieelement
function showinfo(bool){
    // Ein
    if(bool){
        document.getElementsByClassName("info1")[0].style.display="inline";
        document.getElementsByClassName("info2")[0].style.display="inline";
        document.getElementsByClassName("info3")[0].style.display="inline";
        document.getElementsByClassName("info4")[0].style.display="inline";
        document.getElementsByClassName("info5")[0].style.display="inline";
        document.getElementsByClassName("info6")[0].style.display="inline";
    }
    // Aus
    else{
        document.getElementsByClassName("info1")[0].style.display="none";
        document.getElementsByClassName("info2")[0].style.display="none";
        document.getElementsByClassName("info3")[0].style.display="none";
        document.getElementsByClassName("info4")[0].style.display="none";
        document.getElementsByClassName("info5")[0].style.display="none";
        document.getElementsByClassName("info6")[0].style.display="none";
    }
}

// Erstellt das fertige Meme inklusive TEx tund lädt dieses als png herunter. --
function CreateClient(){

    //Disliked wurde mit diesem Hintergrund generiert.
    var memeid = memebyurl(document.getElementById("backImage").src)._id;
    var dislikeid = "1";
    let request = "http://localhost:3000/add_dislike?memeid="+memeid+"&likeid="+dislikeid;
    
    //Dem Expres-Server wird mitgeteit, dass das Meme mit diesem Hintergrund erstellt wurde
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            console.log("Generated pushed");
        }
    }, false);

    XMLHTTP.send(null);

    
    var MemeDiv = document.getElementById("rendern"); //Render-Bereich für das Bild
    var Meme = document.getElementById("Meme");
    var MemeImg = document.getElementById("backImage");
    
    //Render-Bereich an Bildgröße anpassen
    MemeDiv.style.width = MemeImg.width+"px";
    MemeDiv.style.height = MemeImg.height+"px";
    MemeDiv.style.left = MemeImg.offsetLeft+"px";
    Meme.style.left=((-1)*MemeImg.offsetLeft)+"px"; //Meme im render-Bereich positionieren
    
    // Bild aus Render-<div> erstellen
    html2canvas(MemeDiv, {allowTaint: true,  useCORS:true}).then(function (canvas){
        var link = document.getElementById('link');
        link.setAttribute('download', 'MyMultiMediaMeme.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
            MemeDiv.style.left = "0px";
            Meme.style.left="0px";
            //Default-Positionen werden wiederhergestellt
    });


}

// Übersetzungsfunktionen RGB >> Hex
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "%23" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}
var hexDigits = new Array
("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");


// Bild im Server-Side generieren und herunterladen
function CreateServer(){
    console.log("SCreate");
    //Meme-Text-Elemente aus html beziehen
    var text1 = document.getElementById('MemeTextOben');
    var text2 = document.getElementById('MemeTextMitte');
    var text3 = document.getElementById('MemeTextUnten');
    //Request an Server erstellen. Texte und Hintergrundbild angeben
    let request = "http://localhost:3000/create_meme?text1="+text1.innerText+"&text2="+text2.innerText+"&text3="+text3.innerText+"&url="+document.getElementById("backImage").src;
    //Positionierung der Texte
    request +="&t2left=0&t1left="+t1left+"&t3left="+t3left;
    //Formatierung bekommen für 1,2 und 3
        //Text Oben
    request += "&style1=";
    if(text1.style.fontWeight == "bold") request += "bold%20";
    if(text1.style.fontStyle == "italic") request += "italic%20";
    request += (window.getComputedStyle(text1, null).getPropertyValue('font-size'));
    request += "%20sans"
    request += "&color1=";
    if(text1.style.color != "") request += rgb2hex(text1.style.color);
    else request +="%23fff";
        //Text Mitte
    request += "&style2=";
    if(text2.style.fontWeight == "bold") request += "bold%20";
    if(text2.style.fontStyle == "italic") request += "italic%20";
    request += (window.getComputedStyle(text2, null).getPropertyValue('font-size'));
    request += "%20sans"
    request += "&color2=";
    if(text2.style.color != "") request += rgb2hex(text2.style.color);
    else request +="%23fff";
        //Text Unten
    request += "&style3=";
    if(text3.style.fontWeight == "bold") request += "bold%20";
    if(text3.style.fontStyle == "italic") request += "italic%20";
    request += (window.getComputedStyle(text3, null).getPropertyValue('font-size'));
    request += "%20sans"
    request += "&color3=";
    if(text3.style.color != "") request += rgb2hex(text3.style.color); //Textfarbe übergeben !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    else request +="%23fff";


    console.log(request);
    //Request an Express-Server senden
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            //Zurückgegebene Bilddatei automatisch herunterladen
            var link = document.getElementById('link');
            link.setAttribute('download', 'MyMultiMediaMeme.png');
            link.setAttribute('href', this.responseText);
            link.click();
        }
    }, false);

    XMLHTTP.send(null);
}

// blendet Infotafel mit Infos zum Hintergrund ein
function Info(pos){
    // beziehen des Memes basierend auf der Position in der Gallerie
    var meme = memebyindex(pos);
    //console.log(meme);
    document.getElementById("url").innerText = meme.Url;
    document.getElementById("url").href = meme.Url;
    document.getElementById("Nrselected").innerText =meme.Likes.length; // "likes" = Anzahl der Auswahlen (des Bildes)
    document.getElementById("Nrgenerate").innerText =meme.Dislikes.length; // "dislikes" = Anzahl der Generierungen (mit diesem Bild)
    document.getElementById("InfoFeld").style.display = "inline";
}
// Ausblenden der Infotafel
function xInfo(){
    document.getElementById("InfoFeld").style.display = "none";
}

// ezrzeugt Screenshot von angebebener URL
function ScreenshotUrl(){
    // hole URL aus dem html Input
    var url = document.getElementById("screenshotinput").value;
    if(url.length >4){
        // Spreche die "apiflash"-API an
        var request = "https://api.apiflash.com/v1/urltoimage?access_key=bc242f38c11b4a0aabf724d5a8426ab3&url="+url;
        document.getElementById("screenshotinput").value ="";
        // setze Rückgabe (Screenshot) als Hintergrundbild
        document.getElementById("backImage").src = request;
        // blende screenshot Form wieder aus
        UploadFormScreenshot[0].style.display = "none";
    }
}

// zeigt das ScreenshotURL Forular an
function ScreenshotUrlLayout(){
        StartConfig();
        UploadFormScreenshot[0].style.display = "inline";
}

// Meme Text oben, mitte, unten fett
var Bold1 = false;
var Bold2 = false;
var Bold3 = false;
function Bold(num){
    // oben/mitte/unten?
    if(num==1){
        // fett ja/nein
        if(!Bold1){
            document.getElementById("MemeTextOben").style.fontWeight = "bold";
            Bold1 = true;
        } else{
            document.getElementById("MemeTextOben").style.fontWeight = "normal";
            Bold1 = false;}
    }
    if(num==2){
        if(!Bold2){
            document.getElementById("MemeTextUnten").style.fontWeight = "bold";
            Bold2 = true;
        } else{
            document.getElementById("MemeTextUnten").style.fontWeight = "normal";
            Bold2 = false;}
    }
    if(num==3){
        if(!Bold3){
            document.getElementById("MemeTextMitte").style.fontWeight = "bold";
            Bold3 = true;
        } else{
            document.getElementById("MemeTextMitte").style.fontWeight = "normal";
            Bold3 = false;}
    }
}

// Meme Text oben, mitte, unten kursiv
var Ital1 = false;
var Ital2 = false;
var Ital3 = false;
function Italic(num){
    // oben/mitte/unten?
    if(num==1){
        // kursiv ja/nein
        if(!Ital1){
            document.getElementById("MemeTextOben").style.fontStyle = "italic";
            Ital1 = true;
        } else{
            document.getElementById("MemeTextOben").style.fontStyle = "normal";
            Ital1 = false;}
    }
    if(num==2){
        if(!Ital2){
            document.getElementById("MemeTextUnten").style.fontStyle = "italic";
            Ital2 = true;
        } else{
            document.getElementById("MemeTextUnten").style.fontStyle = "normal";
            Ital2 = false;}
    }
    if(num==3){
        if(!Ital3){
            document.getElementById("MemeTextMitte").style.fontStyle = "italic";
            Ital3 = true;
        } else{
            document.getElementById("MemeTextMitte").style.fontStyle = "normal";
            Ital3 = false;}
    }
}

// Meme Text oben, mitte, unten unterstrichen
var UL1 = false;
var UL2 = false;
var UL3 = false;
function UL(num){
    // oben/mitte/unten?
    if(num==1){
        // unterstrichen ja/nein
        if(!UL1){
            document.getElementById("MemeTextOben").style.textDecoration = "underline";
            UL1 = true;
        } else{
            document.getElementById("MemeTextOben").style.textDecoration = "none";
            UL1 = false;}
    }
    if(num==2){
        if(!UL2){
            document.getElementById("MemeTextUnten").style.textDecoration = "underline";
            UL2 = true;
        } else{
            document.getElementById("MemeTextUnten").style.textDecoration = "none";
            UL2 = false;}
    }
    if(num==3){
        if(!UL3){
            document.getElementById("MemeTextMitte").style.textDecoration = "underline";
            UL3 = true;
        } else{
            document.getElementById("MemeTextMitte").style.textDecoration = "none";
            UL3 = false;}
    }
}


var firstinit1 = true; // wurde der obere Positions.Slider bereits bewegt? true = original-Position
var firstinit2 = true; // wurde der untere Positions.Slider bereits bewegt? true = original-Position
// slider 1 / oberer Slider
var slider = {

    // generiert eine Slider, welcher die Position des oberen Textes bestimmt // Quelle: 
    get_position: function() {
        var marker_pos = $('#marker').position();
        var left_pos = marker_pos.left + slider.marker_size / 20;
        var top_pos = marker_pos.top + slider.marker_size / 20;

        slider.position = {
            left: left_pos,
            top: top_pos,
            x: Math.round(slider.round_factor.x * (left_pos * slider.xmax / slider.width)) / slider.round_factor.x,
            y: Math.round((slider.round_factor.y * (slider.height - top_pos) * slider.ymax / slider.height)) / slider.round_factor.y,
        };

    },

    display_position: function() {
        if(firstinit1) firstinit1 =false
        else reposText(slider.position.x.toString(), slider.position.y.toString(), 1);
    },

    draw: function(x_size, y_size, xmax, ymax, marker_size, round_to) {

        if ((x_size === undefined) && (y_size === undefined) && (xmax === undefined) && (ymax === undefined) && (marker_size === undefined) && (round_to === undefined)) {
            x_size = 150;
            y_size = 150;
            xmax = 1;
            ymax = 1;
            marker_size = 20;
            round_to = 2;
        };

        slider.marker_size = marker_size;
        slider.height = y_size;
        slider.width = x_size;
        slider.xmax = xmax;
        slider.ymax = ymax;
        round_to = Math.pow(10, round_to);
        slider.round_factor = {
            x: round_to,
            y: round_to,
        };

        $("#markerbounds").css({
            "width": (x_size + marker_size).toString() + 'px',
            "height": (y_size + marker_size).toString() + 'px',
        });
        $("#box").css({
            "width": x_size.toString() + 'px',
            "height": y_size.toString() + 'px',
            "top": marker_size / 2,
            "left": marker_size / 2,
        });
        $("#marker").css({
            "width": marker_size.toString() + 'px',
            "height": marker_size.toString() + 'px',
            "left":'42px',
            "top":'14px'
        });

        $("#coord").css({
            "top": x_size + marker_size / 2
        });

        $("#widget").css({
            "width": (x_size + marker_size).toString() + 'px',
        });

        slider.get_position();
        slider.display_position();

    },

};

$("#marker").draggable({
    containment: "#markerbounds",
    drag: function() {
        slider.get_position();
        slider.display_position();
    },
});

slider.draw(100,100,1,1,16,2);


// slider 1 / oberer Slider
var slider2 = {

    // generiert eine Slider, welcher die Position des unteren Textes bestimmt // Quelle:
    get_position: function() {
        var marker_pos = $('#marker2').position();
        var left_pos = marker_pos.left + slider2.marker_size / 2;
        var top_pos = marker_pos.top + slider2.marker_size / 2;

        slider2.position = {
            left: left_pos,
            top: top_pos,
            x: Math.round(slider2.round_factor.x * (left_pos * slider2.xmax / slider2.width)) / slider2.round_factor.x,
            y: Math.round((slider2.round_factor.y * (slider2.height - top_pos) * slider2.ymax / slider2.height)) / slider2.round_factor.y,
        };

    },

    display_position: function() {

        if(firstinit2) firstinit2 =false
        else reposText(slider2.position.x.toString(), slider2.position.y.toString(), 2);
    },

    draw: function(x_size, y_size, xmax, ymax, marker_size, round_to) {

        if ((x_size === undefined) && (y_size === undefined) && (xmax === undefined) && (ymax === undefined) && (marker_size === undefined) && (round_to === undefined)) {
            x_size = 150;
            y_size = 150;
            xmax = 1;
            ymax = 1;
            marker_size = 20;
            round_to = 2;
        };

        slider2.marker_size = marker_size;
        slider2.height = y_size;
        slider2.width = x_size;
        slider2.xmax = xmax;
        slider2.ymax = ymax;
        round_to = Math.pow(10, round_to);
        slider2.round_factor = {
            x: round_to,
            y: round_to,
        };

        $("#markerbounds2").css({
            "width": (x_size + marker_size).toString() + 'px',
            "height": (y_size + marker_size).toString() + 'px',
        });
        $("#box2").css({
            "width": x_size.toString() + 'px',
            "height": y_size.toString() + 'px',
            "top": marker_size / 2,
            "left": marker_size / 2,
        });
        $("#marker2").css({
            "width": marker_size.toString() + 'px',
            "height": marker_size.toString() + 'px',
            "left":'42px',
            "top":'70px'
        });

        $("#coord2").css({
            "top": x_size + marker_size / 2
        });

        $("#widget2").css({
            "width": (x_size + marker_size).toString() + 'px',
        });

        slider2.get_position();
        slider2.display_position();

    },

};

$("#marker2").draggable({
    containment: "#markerbounds2",
    drag: function() {
        slider2.get_position();
        slider2.display_position();
    },
});

slider2.draw(100,100,1,1,16,2);


// repositioniert den Text basierend auf X und Y Koordinate der Slider
function reposText(x,y,num){
    x*=100; // Skalierung auf ganze Zahlen
    y*=100; // Skalierung auf ganze Zahlen
    if(num==1)t1left = (x+7.1)*2 // Position des oberen Textes anpassen (für Serverside Generierung)
    if(num==2)t3left = (x+7.1)*2 // Position des unteren Textes anpassen (für Serverside Generierung)
    //console.log("t1left:"+t1left+", t3left"+t3left);
    if(num==1){ // tatsächliche Neupositionierung des oberen Textes auf dem Bild
        x -= 42;
        y -= 86;
        //console.log(x+", "+y)
        document.getElementsByClassName("MemeTextTop")[0].style.left=(x*3.6)+100+"px";
        document.getElementsByClassName("MemeTextTop")[0].style.top=-y-20+"px";
    }
    if(num==2){ // tatsächliche Neupositionierung des unteren Textes auf dem Bild
        x -=50;
        y -=22;
        //console.log(x+", "+y+", 2")
        document.getElementsByClassName("MemeTextBottom")[0].style.left=(x*3.6)+100+"px";
        document.getElementsByClassName("MemeTextBottom")[0].style.top=-(y*1.4)+235+"px";
    }
}

// Funktion für Speech to Text // Quelle:
var answerTxT = "";
function voicetotex(){
     // hole die Referenz auf das "output"-Element
    var output = document.getElementById("output");
     // hole die Referenz auf das "action"-Element
    var action = document.getElementById("action");
    // generiere neues SpeechRecognition Objekt
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // Wird ausgeführt, wenn der Speech Recognition Service startet
    recognition.onstart = function() {
        action.innerHTML = "<small>listening, please speak...</small>";
    };

    recognition.onspeechend = function() {
        action.innerHTML = "<small>stopped listening, hope you are done...</small>";
        recognition.stop();
    }

    // Wird ausgeführt, wenn der Speech Recognition Service ein Ergibnis zurück gibt
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        console.log(transcript);
        // stuerlogik für die Voice-Kontrolle, basierend auf gesprochenem Text
        if(transcript.toLowerCase()=="stop it please") runSpeechRecognition(1);
        else if(transcript.toLowerCase()=="set the background") runSpeechRecognition(2);
            else if(transcript.toLowerCase()=="random") runSpeechRecognition(21);
            else if(transcript.toLowerCase()=="select") runSpeechRecognition(22);
                else if(transcript.toLowerCase()=="number one") runSpeechRecognition(221);
                else if(transcript.toLowerCase()=="number two") runSpeechRecognition(222);
                else if(transcript.toLowerCase()=="number three") runSpeechRecognition(223);
                else if(transcript.toLowerCase()=="number four") runSpeechRecognition(224);
                else if(transcript.toLowerCase()=="number five") runSpeechRecognition(225);
                else if(transcript.toLowerCase()=="number six") runSpeechRecognition(226);
                else if(transcript.toLowerCase()=="go left") runSpeechRecognition(227);
                else if(transcript.toLowerCase()=="go right") runSpeechRecognition(228);
        else if(transcript.toLowerCase()=="change the top text") runSpeechRecognition(3);
        else if(transcript.toLowerCase()=="change the middle text") runSpeechRecognition(4);
        else if(transcript.toLowerCase()=="change the bottom text") runSpeechRecognition(5);
        else if(transcript.toLowerCase()=="download the image") runSpeechRecognition(6);
            else if(transcript.toLowerCase()=="client") runSpeechRecognition(61);
            else if(transcript.toLowerCase()=="server") runSpeechRecognition(62);
        else if(transcript.toLowerCase()=="hey laura") runSpeechRecognition(1337);
        else{
            answerTxT=transcript;
            runSpeechRecognition(999); // Keiner der oben aufgeführten Fälle ist eingetreten >> kein Kommando erkannt
        }
        output.classList.remove("hide");

    };

    // Starte den Speech Recognition Service
    recognition.start();
}

// Vorlesen eines angegebenen Textes
function ReadText(text){
    // generiere neues Vorlese-Objekt
    var msg = new SpeechSynthesisUtterance();
    // stelle Sprache auf Englisch
    msg.lang = 'en-US';
    // Text, welcher vorgelesen werden soll
    msg.text = text;
    // lese Text vor
    window.speechSynthesis.speak(msg);
}


var TextBox = ""; // wichtig für Eingabe der Meme-Texte
// Verarbeitung einer Spracheingabe und Folgelogik
function runSpeechRecognition(num){
    var action = document.getElementById("action");
    if(num==0){
        ReadText("Welcome to Voice Controll. Pleas tell me, what you'd like to do.");
        setTimeout(()=> {
            voicetotex();
        },4700);
    }
    if(num==1){
        ReadText("Ok, bye. I hope I could help.")
        TextBox = "";
        TopMinusPressed(); MidMinusPressed(); BottomMinusPressed();
        action.innerHTML = "<small></small>";
    }
    if(num==2){
        ReadText("If you want a random Background say random. If you'd like to select a Background, say select. ");
        setTimeout(()=> {
            voicetotex();
        },6500);
    }
        if(num==21){
            showGal();
            setTimeout(()=>{
                updateBackground(1);
                galeryContainer[0].style.display = "none";

            },500)
            ReadText("A random background has been selected. What else can I do for you? ");
            setTimeout(()=> {
                voicetotex();
            },4300);
        }
        if(num==22){
            ShowAllGalery();
            ReadText("Say number one, number two and so on to select the according background or say go left or go right to go through all backgrounds");
            setTimeout(()=> {
                voicetotex();
            },7200);
        }
            if(num==221){
                updateBackground(1);
                galeryContainer[0].style.display = "none";
                AllGalButtons[0].style.display = "none";
                ReadText("First background selected. What else can I do for you? ");
                setTimeout(()=> {
                    voicetotex();
                },4300);
            }
            if(num==222){
                updateBackground(2);
                galeryContainer[0].style.display = "none";
                AllGalButtons[0].style.display = "none";
                ReadText("Second background selected. What else can I do for you? ");
                setTimeout(()=> {
                    voicetotex();
                },4300);
            }
            if(num==223){
                updateBackground(3);
                galeryContainer[0].style.display = "none";
                AllGalButtons[0].style.display = "none";
                ReadText("Third background selected. What else can I do for you? ");
                setTimeout(()=> {
                    voicetotex();
                },4300);
            }
            if(num==224){
                updateBackground(4);
                galeryContainer[0].style.display = "none";
                AllGalButtons[0].style.display = "none";
                ReadText("Forth background selected. What else can I do for you? ");
                setTimeout(()=> {
                    voicetotex();
                },4300);
            }
            if(num==225){
                updateBackground(5);
                galeryContainer[0].style.display = "none";
                AllGalButtons[0].style.display = "none";
                ReadText("Fifth background selected. What else can I do for you? ");
                setTimeout(()=> {
                    voicetotex();
                },4300);
            }
            if(num==226){
                updateBackground(6);
                galeryContainer[0].style.display = "none";
                AllGalButtons[0].style.display = "none";
                ReadText("Sixth background selected. What else can I do for you? ");
                setTimeout(()=> {
                    voicetotex();
                },4300);
            }
            if(num==227){
                GaleryPrev();
                ReadText("Left");
                setTimeout(()=> {
                    voicetotex();
                },500);
            }
            if(num==228){
                GaleryNext();
                ReadText("Right");
                setTimeout(()=> {
                    voicetotex();
                },500);
            }
    if(num==3){
        TopPlusPressed()
        TextBox = "top";
        ReadText("Please dictate, what the top caption should be.");
        setTimeout(()=> {
            voicetotex();
        },3100);
    }
    if(num==4){
        MidPlusPressed()
        TextBox = "mid";
        ReadText("Please dictate, what the middle caption should be.");
        setTimeout(()=> {
            voicetotex();
        },3200);
    }
    if(num==5){
        BottomPlusPressed()
        TextBox = "bot";
        ReadText("Please dictate, what the bottom caption should be.");
        setTimeout(()=> {
            voicetotex();
        },3200);
    }
    if(num==6){
        ReadText("Would you like to generate the image Server or Client side? Say ether server or client");
        setTimeout(()=> {
            voicetotex();
        },5400);
    }
        if(num==61){
            CreateClient();
            ReadText("Your Image was generated and is now ready for download. Good Bye.");
            TextBox = "";
            TopMinusPressed(); MidMinusPressed(); BottomMinusPressed();
            action.innerHTML = "<small></small>";
        }
        if(num==62){
            CreateServer();
            ReadText("Your Image was generated and is now ready for download. Good Bye.");
            TextBox = "";
            TopMinusPressed(); MidMinusPressed(); BottomMinusPressed();
            action.innerHTML = "<small></small>";
        }
    if(num==999 && TextBox==""){ // Kein Kommando erkannt und kein Text einzugeben
        ReadText("I'm sorry but I didn't get that. Please try again.");
        setTimeout(()=> {
            voicetotex();
        },5000);
    }
    if(num==999 && TextBox=="top"){ // Text ist kein Kommando, sondern diktierter Text für die obere Textbox
        document.getElementById("input1").value = answerTxT;
        updateTopText();
        TextBox = "";
        ReadText("Top text changed. What's next?");
        setTimeout(()=> {
            voicetotex();
        },4500);
    }
    if(num==999 && TextBox=="mid"){ // Text ist kein Kommando, sondern diktierter Text für die mittlere Textbox
        document.getElementById("input3").value = answerTxT;
        updateMiddleText();
        TextBox = "";
        ReadText("Middle text changed. What's next?");
        setTimeout(()=> {
            voicetotex();
        },4500);
    }
    if(num==999 && TextBox=="bot"){ // Text ist kein Kommando, sondern diktierter Text für die untere Textbox
        document.getElementById("input2").value = answerTxT;
        updateBottomText();
        TextBox = "";
        ReadText("Bottom text changed. What's next?");
        setTimeout(()=> {
            voicetotex();
        },4500);
    }
    if(num==1337){ // Easteregg
        ReadText("You have noodles or fries ? No? Better try another command then.");
        setTimeout(()=> {
            voicetotex();
        },6000);
    }

    // nächstes mal Imgur/Express Server und MemeGen.css dokumentieren
}