// html Elemente aus SingleView.html
var ImgContainer = document.getElementById("currentImg");

var index = 0;// derzeitiges Meme
var memes = []; // Array für alle relevanten/angezeigten Memes (den Filtern entsprechend)

showRelevantFilters();
getMemes();
// setze User Name auf "Guest"
document.getElementById("UserName3").innerHTML = "Guest";
// blende User Interaktion für Gäste aus
document.getElementById("UserInteraction").style.display ="none";
// falls eingeloggter User >> passe Name an und füge Optionen für eingeloggte User dem Navigationsmenü hinzu
if(sessionStorage.getItem('Guest')=="1"){
    var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
    document.getElementById("M3").insertAdjacentHTML( 'beforeend', text );
    document.getElementById("UserName3").innerHTML = sessionStorage.getItem('User');
    document.getElementById("UserInteraction").style.display ="inline";
}

// Lade alle Memes die den eingestellten Filtern entsprechen
function getMemes(){
        // hole komplette Meme-Liste vom Server
        let XMLHTTP = new XMLHttpRequest();
        XMLHTTP.open("GET","https://mymultimediamememaker.herokuapp.com/get_memes");
        XMLHTTP.addEventListener("readystatechange",function() {
            // Falls Erfolgreich
            if (XMLHTTP.readyState == 4) {
                // wandle in JASON um
                const j = JSON.parse(XMLHTTP.response)
                // Filter Memes nach "public" (zeige keine auf "private" gestzte Memes)
                memes = j.filter(({Public}) => Public ===true);
                // Schaue welche Filter gesetzt sind und sortiere die Memes entsprechend dem Filter
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
                if( sessionStorage.getItem('Type')=="Img"){}
                if( sessionStorage.getItem('Type')=="GIF"){memes=[]}
                if( sessionStorage.getItem('Type')=="Vid"){memes=[]}
                //console.log(memes);
                // angezeigtes Bild wird gesetzt
                ImgContainer.src =memes[index].Url;
                // aktualisiere Informationen zum angezeigten Bild
                UpdateInfo();
            }
        }, false);

        XMLHTTP.send(null);

}


// aktualisiere Informationen zum aktuellen Meme
function UpdateInfo(){
    // setze Titel und Ersteller-Info des Memes
    document.getElementById("MemeTitel").innerHTML  = memes[index].Titel;
    document.getElementById("ErstellInfos").innerHTML  = memes[index].Autor;
    // hole UserID aus dem Session Storage
    var userid =  sessionStorage.getItem('UserID');

    // Abfrage ob "geliked" wurde
    if(memes[index].Likes.includes(userid)){
        //console.log("Hat geliked");
        // ändere die Anzeige der Vote Buttons und Text entsprechend
        document.getElementById("UpV").style.display ="none";
        document.getElementById("DownV").style.display ="none";
        document.getElementById("UpS").style.display = "inline";
        document.getElementById("UpS").style.color="black";
        document.getElementById("UpS").style.fontSize="25px";
        document.getElementById("DownS").style.display="inline";
        document.getElementById("DownS").style.color="gray";
        document.getElementById("DownS").style.fontSize="15px";
    }
    // Abfrage ob "gedisliked" wurde
    else if(memes[index].Dislikes.includes(userid)){
        //console.log("Hat gedisliked");
        // ändere die Anzeige der Vote Buttons und Text entsprechend
        document.getElementById("UpV").style.display ="none";
        document.getElementById("DownV").style.display ="none";
        document.getElementById("UpS").style.display = "inline";
        document.getElementById("UpS").style.color="gray";
        document.getElementById("UpS").style.fontSize="15px";
        document.getElementById("DownS").style.display="inline";
        document.getElementById("DownS").style.color="black";
        document.getElementById("DownS").style.fontSize="25px";
    }
    // User hat nicht gevoted >> Vote anzeige einblenden, Vote Symbols ausblenden
    else{
        document.getElementById("UpV").style.display ="inline";
        document.getElementById("DownV").style.display ="inline";
        document.getElementById("UpS").style.display = "none";
        document.getElementById("DownS").style.display="none";
    }

    // Setze die Zahl der Up/Down-Votes und aktualisiert die Anzeige des Like-Dislike Verältnisses (immer 150 hoch, nur Verhältnis ändern!)
    var NumUp = memes[index].Likes.length;
    var NumDown = memes[index].Dislikes.length;
    var Zahl = NumUp-NumDown;
    if(Zahl>0)       document.getElementById("LikeNumber").innerText="+"+Zahl;
    else    document.getElementById("LikeNumber").innerText=Zahl;
    var heightfactor = 75;
    if(NumUp+NumDown!=0){
        heightfactor = (NumUp/(NumUp+NumDown))*150;
    }

    document.getElementById("Green").style.height=heightfactor+"px";

}

// zeige vorheriges Meme
function PrevImg() {
    index = index - 1 + memes.length;
    index = index % memes.length;
    // Auswahl mit Animation
    d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 0);
    setTimeout(() => {
        ImgContainer.src = memes[index].Url;
        d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 1);
    }, 300);
    UpdateInfo();
}

// zeige nächstes Meme
function NextImg() {
    // prüfe ob ein zufälliges Bild angezeigt werden soll
    if(document.getElementById("RandomCheck").checked){
        console.log("random order");
        index = Math.floor(Math.random()*10001);
    }
    else{

        index++;
    }
    index = index % memes.length;
    // Auswahl mit Animation
    d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 0);
    setTimeout(() => {
        ImgContainer.src = memes[index].Url;
        d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 1);
    }, 300);
    UpdateInfo();
}

// wird aufgerufen, wenn User auf "Vote-Up" eines Memes klickt
function VoteUp(){
    // rufe die Seite "add_like" auf und füge UserID die likeid und memeid hinzu, damit der Server die Informationen dem richtigen User zuordnen kann
    var likeid = sessionStorage.getItem('UserID');
    var memeid = memes[index]._id;
    let request = "https://mymultimediamememaker.herokuapp.com/add_like?memeid="+memeid+"&likeid="+likeid;

    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg
        if (XMLHTTP.readyState == 4) {
            console.log("Like Pushed");
            // lade memes noch einmal neu (um auf den aktuellen Stand zu kommen)
            getMemes();
            // aktualisiere die Grafik
            UpdateInfo();
        }
    }, false);

    XMLHTTP.send(null);
}

// siehe VoteUp(memeid). Funktionaltät analog. (Request an add_dislike)
function VoteDown(){
    var likeid = sessionStorage.getItem('UserID');
    var memeid = memes[index]._id;
    let request = "https://mymultimediamememaker.herokuapp.com/add_dislike?memeid="+memeid+"&likeid="+likeid;

    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            console.log("Dislike Pushed");
            getMemes();
            UpdateInfo();

        }
    }, false);

    XMLHTTP.send(null);
}


// setze Auto-Play standardmäßig auf "aus" 
var autoplay = false;
// Stop-Auto-Play Button deshalb nicht angezeigt
document.getElementById("stopAp").style.display="none";

// Rekursive Funktion, welche sich alle x Sekunden aufruft (x wird dabei vom Timer-Feld festgelegt)
function AutoPlay() {
    // blende Stop Auto-Play Button ein
    document.getElementById("stopAp").style.display="inline";
    // blende Auto-Play Button aus
    document.getElementById("nextAp").style.display="none";
    autoplay = true;
    var timer = document.getElementById("timer").value;;
    setTimeout(()=>{
        if(autoplay){
            NextImg();
            AutoPlay();
        }
    },timer*1000)
}

// beende Auto-Play Funktion
function stopAuto(){
    // blende Stop Auto-Play Button aus
    document.getElementById("stopAp").style.display="none";
    // blende Auto-Play Button ein
    document.getElementById("nextAp").style.display="inline";
    autoplay = false;
}

// Lese den Meme Titel vor
function ReadTitel(){
    // gneriere neues Vorlese-Objekt
    var msg = new SpeechSynthesisUtterance();
    // stelle Sprache auf Englisch
    msg.lang = 'en-US';
    // Text, welcher vorgelesen werden soll
    console.log(memes[index]);
    msg.text = "Titel: "+memes[index].Titel+". Description: "+ memes[index].Description+". Author: "+memes[index].Autor;
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
    //console.log(text);
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