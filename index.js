// html Elemente aus index.html >> buttons für SignIn/Up und Logout
var SI = document.getElementById("SignIn");
var SU = document.getElementById("SignUp");
var B1 = document.getElementById("LO1");
var B2 = document.getElementById("LO2");
var B3 = document.getElementById("LI");

SI.style.display="none";
SU.style.display="none";

// Greife auf den Session Storage zu und initialisiere Filter und Sort Optionen (sonst gibt es Fehler)
sessionStorage.setItem('Filter',"");
sessionStorage.setItem('Sort',"");

// Abfrage ob der User eingeloggt ist
if(sessionStorage.getItem('Guest')=="1"){
    // kein Gast! >> Füge dem Navigastionsmenü die Optionen MemeGenerator und UploadMeme für eingeloggte User hinzu
    var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
    document.getElementById("M1").insertAdjacentHTML( 'beforeend', text );
    // Aktualisiere den User Namen
    document.getElementById("UserName1").innerHTML = sessionStorage.getItem('User');
    B1.style.display = "none";
    B2.style.display = "none";
    B3.style.display = "inline";
}
else{
    // als Gast >> Setze User Name auf "Guest"
    document.getElementById("UserName1").innerHTML = "Guest";
    B1.style.display = "inline";
    B2.style.display = "inline";
    B3.style.display = "none";
}

// Lösche alle Input Felder und blende alle Formulare aus
function cancel(){
    document.getElementById("name").value = "";
    document.getElementById("mail").value= "";
    document.getElementById("pw").value= "";
    document.getElementById("pwrep").value= "";
    document.getElementById("mailL").value= "";
    document.getElementById("pwL").value= "";
    SI.style.display="none";
    SU.style.display="none";
}
// zeige das SignIn Formular
function SignInForm(){
    SU.style.display="none";
    SI.style.display="inline";
}
// zeige das SignUp Formular
function SignUpForm(){
    SI.style.display="none";
    SU.style.display="Inline";
}

// SignUp Funktionalität
function SignUp(){

    // hole den User Input der SignUp Elemente
    var Name = document.getElementById("name").value;
    var Mail =document.getElementById("mail").value.toLowerCase();
    var PW1 =document.getElementById("pw").value;
    var PW2 =document.getElementById("pwrep").value;
    // Vergleiche Passwort Eingabe auf Übereinstimmung
    if(PW1 == PW2){

        // Eingabe Felder dürfen nicht "leer" sein
        if(!Name || !Mail || !PW1) {
            window.alert("Please enter all infos");
        }
        else{ // alle Eingabe Felder sind gesetzt
            // schicke SignIn Anfrage
            let request = "http://localhost:3000/add_user?name="+Name+"&mail="+Mail+"&pw="+PW1+"&admin=false";
            //console.log(request);
            let XMLHTTP = new XMLHttpRequest();
            XMLHTTP.open("GET",request);
            XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
            XMLHTTP.addEventListener("readystatechange",function() {
                // Bei Erfolg >> Setze User Informationen und rufe SignIn Funktion auf
                if (XMLHTTP.readyState == 4) {
                    console.log("User Uploaded");
                    sessionStorage.setItem('User', Name);
                    sessionStorage.setItem('Guest', "1");
                    document.getElementById("mailL").value = Mail;
                    document.getElementById("pwL").value = PW1;
                    SignIn();
                }
            }, false);

            XMLHTTP.send(null);
        }

    }
    else{
        window.alert("Paswords are not matching.");
    }
    // Blende Forms wieder aus
    cancel();
}
// SignIn Funktionalität
function SignIn(){
    // hole den User Input der SigIn Elemente
    var users;
    var mail = document.getElementById("mailL").value.toLowerCase();
    var pw =document.getElementById("pwL").value;
    // Hole Liste aller User, welche auf dem Server registriert sind
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET","http://localhost:3000/get_users");
    XMLHTTP.addEventListener("readystatechange",function() {
        // Bei Erfolg >> Schaue ob User existiert
        if (XMLHTTP.readyState == 4) {
            const j = JSON.parse(XMLHTTP.response)
            users = j;
            var solution = users.filter(({Email}) => Email === mail);
            solution = solution.filter(({Password}) => Password === pw);
            // Falls es eine Übereinstimmung gibt:
            if(solution.length>0){
                // Setze User Informationen
                console.log(solution[0].Name);
                sessionStorage.setItem('User', solution[0].Name);
                sessionStorage.setItem('UserID', solution[0]._id);
                sessionStorage.setItem('Guest', "1");
                // Füge dem Navigastionsmenü die Optionen MemeGenerator und UploadMeme für eingeloggte User hinzu
                var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
                document.getElementById("M1").insertAdjacentHTML( 'beforeend', text );
                document.getElementById("UserName1").innerHTML = sessionStorage.getItem('User');
                B1.style.display = "none";
                B2.style.display = "none";
                B3.style.display = "inline";
            }
            else{
                window.alert("This combimation of Email and Password does not exist. \n Please check the spelling or sign in, if not done jet.")
            }
        }
    }, false);

    XMLHTTP.send(null);

    // Blende Forms wieder aus
    cancel();
}

// SignOut Funktionalität
function signOut(){
    // setze User Informationen zurück
    B1.style.display = "inline";
    B2.style.display = "inline";
    B3.style.display = "none";
    sessionStorage.setItem('User', "");
    sessionStorage.setItem('Guest', "");
    // Lade seite neu, um Änderungen wirksam zu machen
    location.reload();
}
