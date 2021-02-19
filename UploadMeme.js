// setze Name oben rechts auf den User-Namen
document.getElementById("UserName5").innerHTML = sessionStorage.getItem('User');
// blende Share Button standardmäßig aus
document.getElementsByClassName("Share")[0].style.display="none";

// html Elemente aus UploadMeme.html
const container = document.getElementById('container');
const loading = document.querySelector('.loading');
var index = 0;// derzeitiges Meme
var memes = []; // Array für alle relevanten/angezeigten Memes (den Filtern entsprechend)
loadImageUrls();

// Füge Meme der Datenbank hinzu
function AddMemeToDatabase(link){
    // bekomme die Meme Informationen aus dem html
    var Titel = document.getElementById("Titel").value;
    var description = document.getElementById("description").value;
    var Autor = sessionStorage.getItem('User');
    var uid = sessionStorage.getItem('UserID');
    var pub = !document.getElementById("pub").checked;
    // sende Anfrage an den Server und übergebe Informationen
    let request = "http://localhost:3000/add?url=" + link+"&preset=false"+"&titel="+Titel+"&autor="+Autor+"&uid="+uid+"&public="+pub+"&description="+description;
    //console.log(request);
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg:
        if (XMLHTTP.readyState == 4) {
            //console.log("Meme Uploaded");
            // Nutzer über das Hochladen des Memes informieren
            window.alert("Your Meme was Uploaded!");
            // Informationen aus html Eingabefeldern löschen
            document.getElementById("Titel").value="";
            document.getElementById("MemeLink").innerText="Your link will appear here.";
            document.getElementById("MemeLink").href="#";
            // lade Seite neu um Änderungen anzuzeigen
            location.reload();
        }
    }, false);

    XMLHTTP.send(null);

}

// Löst das Hochaden aus
function Submit(){
    // Überprüfung ob alle Eingaben gesetzt sind
    if(document.getElementById("description").value.length>0 &&  document.getElementById("Titel").value.length>0 && document.getElementById("MemeLink").innerText !="Your link will appear here."){
        // Füge das Meme der Datenbank hinzu
        AddMemeToDatabase(document.getElementById("MemeLink").innerText);
    }
    else{
        window.alert("Please make sure, a Meme-Title, Meme-Description as well as a Meme-Image is provided.");
    }
}

// Kopiere den Link zum Bild in die Zwischenablage
function copyStringToClipboard (str) {
    // Temporäres Element erzeugen
    var el = document.createElement('textarea');
    // Den zu kopierenden String dem Element zuweisen
    el.value = str;
    // Element nicht editierbar setzen und aus dem Fenster schieben
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Text innerhalb des Elements auswählen
    el.select();
    // Ausgewählten Text in die Zwischenablage kopieren
    document.execCommand('copy');
    // Temporäres Element löschen
    document.body.removeChild(el);
}

// Funktionalität des CopyClip Button
function CopyClip(){
    // hole Text aus dem html
    copyStringToClipboard(document.getElementById("MemeLink").innerText);
    window.alert("A link to the Meme was copied to your clipboard: "+document.getElementById("MemeLink").innerText)
}

// Lade alle Memes
function loadImageUrls() {
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET","http://localhost:3000/get_memes");
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg
        if (XMLHTTP.readyState == 4) {
            // wandle in JSON um
            const j = JSON.parse(XMLHTTP.response)
            //console.log(j);
            // filtere nach UserID
            var uid = sessionStorage.getItem('UserID');
            memes = j.filter(({CreatorID}) => CreatorID === uid);
            //console.log(memes);
            // zeige Memes auf der rechten Seite an (am Anfang drei Stück)
            getPost();
            getPost();
            getPost();
        }
    }, false);

    XMLHTTP.send(null);

}

// aktiviert, wenn der User beim Scrollen unten an der Seite angekommen
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // überprüfe, ob neue Memes geladen werden
    if(clientHeight + scrollTop >= scrollHeight - 5) {
        // zeige die "Lade"-Animation
        if(index<memes.length)
            showLoading();
    }
});

// zeige "Loading"-Animation und zeige neue Meme-Box nach einer fiktiven Ladezeit von 0.5s (um Animation zumindest kurz zu zeigen)
function showLoading() {
    loading.classList.add('show');
    // lade mehr Posts
    setTimeout(getPost, 500)
}

// überprüft ob weiter Memes zum anzeigen vorhanden sind und übergibt das als nchstes anzuzeigende Meme
async function getPost() {

    if(index < memes.length){
        addDataToDOM(memes[index]);
    }
    index = index+1;
}

// Füge bestimmte Daten zum Dokument hinzu
function addDataToDOM(data) {
    // erstelle neues Post Element
    const postElement = document.createElement('div');
    // Füge neuem Post einen Blog-Post hinzu (weißes Feld um Meme / umschließender Meme Container)
    postElement.classList.add('blog-post');
    var memeid = data._id;
    // Erstelle html Elemement für den Meme Post bestehend aus: 1. Title des Memes, 2. Meme-Bild, 3. Benutzer Information, 4. Delete-Button
    var htmlImage = "<h2 class=\"title\">"+data.Titel+"</h2> <img class = \"MemeImages\" src="+data.Url+">  <div class=\"user-info\"><span>"+data.Autor+"</span> <button class = \"DelButton\" id=\"Delete"+data._id+"\" onclick=\"delImg('"+memeid+"')\">🗑 Delete</button> </div>";
    // füge Element in die html Seite ein
    postElement.innerHTML = htmlImage;
    loading.classList.remove('show');
    container.appendChild(postElement);
}

// löscht das Bild mit der angegebenen MemeID
function delImg(memeid){
    // sendet Lösch-Anfrage an den Server
    let request = "http://localhost:3000/delete_meme?id="+memeid;
    //console.log(request);
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg
        if (XMLHTTP.readyState == 4) {
            // User über das Entfernen des Memes informieren
            //console.log("Meme Deleted");
            window.alert("Your Meme was Deleted!");
        }
    }, false);

    XMLHTTP.send(null);
    // lade Seite neu um Änderungen anzuzeigen
    location.reload();
}

// Diktier-Funktionalität
function Dictate(num){
    // hole die Referenz auf das "action"-Element
    if(num==1) var action = document.getElementById("action");
    if(num==2) var action = document.getElementById("action2");
    // generiere neues SpeechRecognition Objekt
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // Wird ausgeführt, wenn der Speech Recognition Service startet
    recognition.onstart = function() {
        action.innerHTML = "<small>listening, please speak...</small>";
    };

    recognition.onspeechend = function() {
        action.innerHTML = "<small></small>";
        recognition.stop();
    }

    // Wird ausgeführt, wenn der Speech Recognition Service ein Ergibnis zurück gibt
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        console.log(transcript);
        if(num==1)        document.getElementById("Titel").value = transcript;
        if(num==2)        document.getElementById("description").value = transcript;

    };

    // Starte den Speech Recognition Service
    recognition.start();
}
