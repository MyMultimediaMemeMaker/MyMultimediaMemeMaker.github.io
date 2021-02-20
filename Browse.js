// html Elemente aus Browse.html
const container = document.getElementById('container');
const loading = document.querySelector('.loading');

var index = 0; // derzeitiges Meme
var memes = []; // Array für alle relevanten/angezeigten Memes (den Filtern entsprechend)
showRelevantFilters();
loadImageUrls();
// setze User Name auf "Guest"
document.getElementById("UserName2").innerHTML = "Guest";
// falls eingeloggter User >> passe Name an und füge Optionen für eingeloggte User dem Navigationsmenü hinzu
if(sessionStorage.getItem('Guest')=="1"){
    var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
    document.getElementById("M2").insertAdjacentHTML( 'beforeend', text );
    document.getElementById("UserName2").innerHTML = sessionStorage.getItem('User');
}

// Funktion folgt dem Aufbau von loadImageUrls (Unerschied in den letzten Zeilen)
function getMemes(){
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET","https://mymultimediamememaker.herokuapp.com/get_memes");
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            const j = JSON.parse(XMLHTTP.response)
            memes = j.filter(({Public}) => Public ===true);
            if(sessionStorage.getItem('Sort')=="likes"){
                console.log("Sort by Likes");
                memes.sort((a,b)=>{return b.Likes.length - a.Likes.length});
            }
            if(sessionStorage.getItem('Sort')=="dateN"){
                console.log("Sort by date newest");
                memes.sort((a,b)=>{
                    var da = (new Date(a.createdAt)).getTime();
                    var db = (new Date(b.createdAt)).getTime();
                    return da-db;
                });
            }
            if(sessionStorage.getItem('Sort')=="dateO"){
                console.log("Sort by date oldest");
                memes.sort((a,b)=>{
                    var da = (new Date(a.createdAt)).getTime();
                    var db = (new Date(b.createdAt)).getTime();
                    return db-da;
                });
            }
            if(sessionStorage.getItem('Filter')!=''){
                var keyword = sessionStorage.getItem('Filter');
                console.log("Filter by Keyword: "+keyword);
                memes = memes.filter(m => m.Titel.indexOf(keyword)>-1);
            }
            console.log(memes);
        }
    }, false);

    XMLHTTP.send(null);
}

// Lade alle Memes die den eingestellten Filtern entsprechen
function loadImageUrls() {
        // hole komplette Meme-Liste vom Server
        let XMLHTTP = new XMLHttpRequest();
        XMLHTTP.open("GET","https://mymultimediamememaker.herokuapp.com/get_memes");
        XMLHTTP.addEventListener("readystatechange",function() {
            // Falls Erfolgreich
            if (XMLHTTP.readyState == 4) {
                // wandle in JASON um
                const j = JSON.parse(XMLHTTP.response)
                // Filter Memes nach "public" (zeige keine auf "private" gestzte Memes)
                memes = j.filter(({Public}) => Public === true);
                // Schaue welche Filter gesetzt sind und sortiere die Memes entsprechend dem Filter
                if(sessionStorage.getItem('Sort')=="likes"){
                    console.log("Sort by Likes");
                    memes.sort((a,b)=>{return b.Likes.length - a.Likes.length})
                }
                if(sessionStorage.getItem('Sort')=="dateN"){
                    console.log("Sort by date newest");
                    memes.sort((a,b)=>{
                        var da = (new Date(a.createdAt)).getTime();
                        var db = (new Date(b.createdAt)).getTime();
                        return da-db;
                    });
                }
                if(sessionStorage.getItem('Sort')=="dateO"){
                    console.log("Sort by date oldest");
                    memes.sort((a,b)=>{
                        var da = (new Date(a.createdAt)).getTime();
                        var db = (new Date(b.createdAt)).getTime();
                        return db-da;
                    });
                }
                if(sessionStorage.getItem('Filter')!=''){
                    var keyword = sessionStorage.getItem('Filter');
                    console.log("Filter by Keyword: "+keyword);
                    memes = memes.filter(m => m.Titel.indexOf(keyword)>-1);
                }
                if( sessionStorage.getItem('Type')=="Img"){}
                if( sessionStorage.getItem('Type')=="GIF"){memes=[]}
                if( sessionStorage.getItem('Type')=="Vid"){memes=[]}
                //console.log(memes);
                // erzeuge neuen umschließenden Meme container (am Anfang drei Stück)
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
    // erhöhe index auf aktuelle meme
    index = index+1;
}


// Füge bestimmte Daten zum Dokument hinzu
function addDataToDOM(data) {
    // Wenn eingeloggter User
    if(sessionStorage.getItem('Guest')=="1"){
        // hole User Informationen
        var userid =  sessionStorage.getItem('UserID');
        var NumUp = data.Likes.length;
        var NumDown=data.Dislikes.length
        // erstelle neues Post Element
        const postElement = document.createElement('div');
        var ImgId = data._id;
        // Füge neuem Post einen Blog-Post hinzu (weißes Feld um Meme / umschließender Meme Container)
        postElement.classList.add('blog-post');
        // Anzeige der Up/Down-Vote Funktion
        var VoteText = NumUp-NumDown;
        // füge ein "+" vor den Text falls > 0
        if(VoteText >0){
            VoteText = "+"+VoteText
        }
        // Erstelle html Elemement für den Meme Post bestehend aus: 1. Vorlese-Button, 2. Title des Memes, 3. Meme-Bild, 4. Benutzer Information, 5. User Interaktionen (alle haben eine eindeutige, dem Meme zugeordnete ID!), 5.1. Vote-Buttons, 5.2. Vote-Text, 5.3. Rot-Grüner Vote-Verältnis-Button
        var htmlImage = "<button class=\"Vorlesen\" onclick=\"ReadTitel('"+ImgId+"')\">🔊</button> <h2 class=\"title\">"+data.Titel+"</h2> <img class = \"MemeImages\" src="+data.Url+"> <div class=\"user-info\"><span>"+data.Autor+"</span></div> <div class=\"UserInteraction\" id=\"UserInteraction"+ImgId+"\"> <div class=\"UIaPos\"> <button class=\"Vote\" id=\"UpV"+ImgId+"\" onclick= VoteUp(\""+ImgId+"\")>▲</button> <a class=\"VoteS\" id=\"UpS"+ImgId+"\" >▲</a> <p class=\"LikeNumber\" id=\"LikeNumber"+ImgId+"\">"+VoteText+"</p> <button class=\"DownVote\"  id=\"DownV"+ImgId+"\" onclick=VoteDown(\""+ImgId+"\")>▼</button> <a class=\"DownS\"  id=\"DownS"+ImgId+"\" >▼</a> <div class=\"Red\"></div> <div class=\"Green\" id=\"Green"+ImgId+"\"></div> </div> </div>";
        // füge Element in die html Seite ein
        postElement.innerHTML = htmlImage;
        container.appendChild(postElement);
        loading.classList.remove('show');
        // "Like"-Funktionalität
        // Varibale für ID für Votes Up/Down Button wenn NOCH NICHT "geliked" wurde
        var UpV = "UpV"+ImgId;
        var DownV = "DownV"+ImgId;
        // Varibale für ID für Votes Up/Down Button wenn BEREITS "geliked" wurde
        var UpS = "UpS"+ImgId;
        var DownS = "DownS"+ImgId;
        // Abfrage ob "geliked" wurde
        if(data.Likes.includes(userid)){
            //console.log("Hat geliked");
            // ändere die Anzeige der Vote Buttons und Text entsprechend
            document.getElementById(UpV).style.display ="none";
            document.getElementById(DownV).style.display ="none";
            document.getElementById(UpS).style.display = "inline";
            document.getElementById(UpS).style.color="black";
            document.getElementById(UpS).style.fontSize="25px";
            document.getElementById(DownS).style.display="inline";
            document.getElementById(DownS).style.color="gray";
            document.getElementById(DownS).style.fontSize="15px";
        }
        // Abfrage ob "gedisliked" wurde
        else if(data.Dislikes.includes(userid)){
            //console.log("Hat gedisliked");
            // ändere die Anzeige der Vote Buttons und Text entsprechend
            document.getElementById(UpV).style.display ="none";
            document.getElementById(DownV).style.display ="none";
            document.getElementById(UpS).style.display = "inline";
            document.getElementById(UpS).style.color="gray";
            document.getElementById(UpS).style.fontSize="15px";
            document.getElementById(DownS).style.display="inline";
            document.getElementById(DownS).style.color="black";
            document.getElementById(DownS).style.fontSize="25px";
        }
        // User hat nicht gevoted >> Vote anzeige einblenden, Vote Symbols ausblenden
        else{
            document.getElementById(UpV).style.display ="inline";
            document.getElementById(DownV).style.display ="inline";
            document.getElementById(UpS).style.display = "none";
            document.getElementById(DownS).style.display="none";
        }
        // aktualisiert die Anzeige des Like-Dislike Verältnisses (immer 150 hoch, nur Verhältnis ändern!)
        var heightfactor = 75;
        if(NumUp+NumDown!=0){
            heightfactor = (NumUp/(NumUp+NumDown))*150;
        }
        var Green = "Green"+ImgId;
        document.getElementById(Green).style.height=heightfactor+"px";
    }
    // falls kein eingeloggter User:
    else{
        // erstelle neues Post Element
        const postElement = document.createElement('div');
        // Füge neuem Post einen Blog-Post hinzu (weißes Feld um Meme / umschließender Meme Container)
        postElement.classList.add('blog-post');
        // Erstelle html Elemement für den Meme Post bestehend aus: 1. Vorlese-Button, 2. Title des Memes, 3. Meme-Bild, 4. Benutzer Information
        var htmlImage = "<button class=\"Vorlesen\" onclick=\"ReadTitel('"+data._id+"')\">🔊</button> <h2 class=\"title\">"+data.Titel+"</h2> <img class = \"MemeImages\" src="+data.Url+"> <div class=\"user-info\"><span>"+data.Autor+"</span></div>";
        // füge Element in die html Seite ein
        postElement.innerHTML = htmlImage;
        loading.classList.remove('show');
        container.appendChild(postElement);
    }
}

// wird aufgerufen, wenn User auf "Vote-Up" eines Memes klickt
function VoteUp(memeid){
    // rufe die Seite "add_like" auf und füge UserID die likeid und memeid hinzu, damit der Server die Informationen dem richtigen User zuordnen kann
    var likeid = sessionStorage.getItem('UserID');
    let request = "https://mymultimediamememaker.herokuapp.com/add_like?memeid="+memeid+"&likeid="+likeid;

    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg
        if (XMLHTTP.readyState == 4) {
            // aktualisiere die Grafik
            console.log("Like Pushed");
            var UpV = "UpV"+memeid;
            var DownV = "DownV"+memeid;
            var UpS = "UpS"+memeid;
            var DownS = "DownS"+memeid;
            document.getElementById(UpV).style.display ="none";
            document.getElementById(DownV).style.display ="none";
            document.getElementById(UpS).style.display = "inline";
            document.getElementById(UpS).style.color="black";
            document.getElementById(UpS).style.fontSize="25px";
            document.getElementById(DownS).style.display="inline";
            document.getElementById(DownS).style.color="gray";
            document.getElementById(DownS).style.fontSize="15px";
            // lade memes noch einmal neu (um auf den aktuellen Stand zu kommen)
            getMemes();
            // warte bis alle Memes geladen sind, dann aktualisiere die Vote-Verhältnis Anzeige
            setTimeout(()=>{

                UpdateBarnNumber(memeid);
            },100)
        }
    }, false);


    XMLHTTP.send(null);
}

// siehe VoteUp(memeid). Funktionaltät analog. (Request an add_dislike)
function VoteDown(memeid){
    var likeid = sessionStorage.getItem('UserID');
    let request = "https://mymultimediamememaker.herokuapp.com/add_dislike?memeid="+memeid+"&likeid="+likeid;

    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            console.log("Dislike Pushed");
            var UpV = "UpV"+memeid;
            var DownV = "DownV"+memeid;
            var UpS = "UpS"+memeid;
            var DownS = "DownS"+memeid;
            document.getElementById(UpV).style.display ="none";
            document.getElementById(DownV).style.display ="none";
            document.getElementById(UpS).style.display = "inline";
            document.getElementById(UpS).style.color="gray";
            document.getElementById(UpS).style.fontSize="15px";
            document.getElementById(DownS).style.display="inline";
            document.getElementById(DownS).style.color="black";
            document.getElementById(DownS).style.fontSize="25px";
            getMemes();
            setTimeout(()=>{

                UpdateBarnNumber(memeid);
            },100)
        }
    }, false);

    XMLHTTP.send(null);
}

// Aktualsiert die Vote-Verhültnis einzeige, welche zu "memeid" gehört
function UpdateBarnNumber(memeid){
    for(var i = 0; i<memes.length;i++){
        if(memes[i]._id ==""+memeid){
            var data = memes[i];
            var NumUp = data.Likes.length;
            var NumDown=data.Dislikes.length;
            var VoteText = NumUp-NumDown;
            if(VoteText >0){
                VoteText = "+"+VoteText
            }
            var LikeNumber = "LikeNumber"+memeid;
            document.getElementById(LikeNumber).innerText=VoteText;
            var heightfactor = 75;
            if(NumUp+NumDown!=0){
                heightfactor = (NumUp/(NumUp+NumDown))*150;
            }
            var Green = "Green"+memeid;
            document.getElementById(Green).style.height=heightfactor+"px";
        }
   }
}

// Lese den Meme Titel vor
function ReadTitel(memeid){
    var meme = memes.find(({_id}) => _id == memeid);
    //console.log(text);
    // generiere neues Vorlese-Objekt
    var msg = new SpeechSynthesisUtterance();
    // stelle Sprache auf Englisch
    msg.lang = 'en-US';
    // Text, welcher vorgelesen werden soll
    msg.text = "Titel: "+meme.Titel+". Description: "+ meme.Description+". Author: "+meme.Autor;
    // lese Text vor
    window.speechSynthesis.speak(msg);
}

// blendet Filter Dropdwon ein/aus
function FilterMenu(){
    var Menu = document.getElementById("FilterAuswahl");
    if(Menu.style.display =="inline"){
        Menu.style.display = "none";
    }
    else{
        Menu.style.display ="inline";
    }
}

// entferne einen Filter. "text" gibt an, ob die Sortierung gelöscht werden soll oder der Text-Filter
function RemFilter(text){
    console.log(text+"remove");
    if(text=='Sort'){
        sessionStorage.setItem('Sort',"");
    }
    if(text=='Filter'){
        sessionStorage.setItem('Filter',"");
    }
    if(text=='Type'){
        sessionStorage.setItem('Type',"");
    }
    // lade Seite neu um Änderungen anzuzeigen
    location.reload();
}
// füge Filter hinzu
function addFilter(text){
    // filter nach Text
    if(text=='Filter'){
        sessionStorage.setItem('Filter', document.getElementById("TextFilter").value);
    }
    // sortiert nach Likes
    if(text=='SL'){
        sessionStorage.setItem('Sort', "likes");
    }
    // sortiert nach Datum "neu"
    if(text=='SDN'){
        sessionStorage.setItem('Sort', "dateN");
    }
    // sortiert nach Datum "alt"
    if(text=='SDO'){
        sessionStorage.setItem('Sort', "dateO");
    }
    //Sortieren Nach Typ
    if(text=='SImg'){
        sessionStorage.setItem('Type', "Img");
    }
    if(text=='SGIF'){
        sessionStorage.setItem('Type', "GIF");
    }
    if(text=='SVid'){
        sessionStorage.setItem('Type', "Vid");
    }
    // lade Seite neu um Änderungen anzuzeigen
    location.reload();
}

// Zeige die Filter, welche angezeigt werden sollen
function showRelevantFilters(){
    // bekomme Filter aus dem Session Storage
    document.getElementById("FT").innerHTML = sessionStorage.getItem('Filter')+"<button class=\"FilteredX\" onclick=\"RemFilter('Filter')\">x</button>";
    // blende zuerst alle Filter aus
    document.getElementById("FT").style.display = "none";
    document.getElementById("FDU").style.display = "none";
    document.getElementById("FL").style.display = "none";
    document.getElementById("FDD").style.display = "none";
    document.getElementById("FImg").style.display = "none";
    document.getElementById("FGIF").style.display = "none";
    document.getElementById("FVid").style.display = "none";
    // blende gesetzte Filter ein
    if(sessionStorage.getItem('Filter')!=""){
        document.getElementById("FT").style.display = "inline";
    }
    if(sessionStorage.getItem('Sort')=="likes"){
        document.getElementById("FL").style.display = "inline";
    }
    if(sessionStorage.getItem('Sort')=="dateN"){
        document.getElementById("FDD").style.display = "inline";
    }
    if(sessionStorage.getItem('Sort')=="dateO"){
        document.getElementById("FDU").style.display = "inline";
    }
    if(sessionStorage.getItem('Type')=="Img"){
        document.getElementById("FImg").style.display = "inline";
    }
    if(sessionStorage.getItem('Type')=="GIF"){
        document.getElementById("FGIF").style.display = "inline";
    }
    if(sessionStorage.getItem('Type')=="Vid"){
        document.getElementById("FVid").style.display = "inline";
    }
}