document.getElementById("UserName5").innerHTML = sessionStorage.getItem('User');
document.getElementsByClassName("Share")[0].style.display="none";

const container = document.getElementById('container');
const loading = document.querySelector('.loading');
var index = 0;
var memes = [];
loadImageUrls();


function AddMemeToDatabase(link){
    var Titel = document.getElementById("Titel").value;
    var Autor = sessionStorage.getItem('User');
    var uid = sessionStorage.getItem('UserID');
    var pub = !document.getElementById("pub").checked;
    let request = "http://localhost:3000/add?url=" + link+"&preset=false"+"&titel="+Titel+"&autor="+Autor+"&uid="+uid+"&public="+pub;
    console.log(request);
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            console.log("Meme Uploaded");
            window.alert("Your Meme was Uploaded!");
            document.getElementById("Titel").value="";
            document.getElementById("MemeLink").innerText="Your link will appear here.";
            document.getElementById("MemeLink").href="#";
            location.reload();
        }
    }, false);

    XMLHTTP.send(null);

}

function Submit(){
    if(document.getElementById("Titel").value.length>0 && document.getElementById("MemeLink").innerText !="Your link will appear here."){
        AddMemeToDatabase(document.getElementById("MemeLink").innerText);
    }
    else{
        window.alert("Please make sure, a Meme-Title as well as a Meme-Image is provided.");
    }
}

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
function CopyClip(){
    copyStringToClipboard(document.getElementById("MemeLink").innerText);
    window.alert("A link to the Meme was copied to your clipboard: "+document.getElementById("MemeLink").innerText)
}


function loadImageUrls() {
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET","http://localhost:3000/get_memes");
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            const j = JSON.parse(XMLHTTP.response)
            console.log(j);
            var uid = sessionStorage.getItem('UserID');
            memes = j.filter(({CreatorID}) => CreatorID === uid);
            console.log(memes);
            getPost();
            getPost();
            getPost();
        }
    }, false);

    XMLHTTP.send(null);

}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;


    if(clientHeight + scrollTop >= scrollHeight - 5) {
        // show the loading animation
        if(index<memes.length)
            showLoading();
    }
});

function showLoading() {
    loading.classList.add('show');
    // load more data
    setTimeout(getPost, 500)
}

async function getPost() {

    if(index < memes.length){
        addDataToDOM(memes[index]);
    }
    index = index+1;
}
function addDataToDOM(data) {
    const postElement = document.createElement('div');
    postElement.classList.add('blog-post');
    var memeid = data._id;
    var htmlImage = "<h2 class=\"title\">"+data.Titel+"</h2> <img class = \"MemeImages\" src="+data.Url+">  <div class=\"user-info\"><span>"+data.Autor+"</span> <button class = \"DelButton\" id=\"Delete"+data._id+"\" onclick=\"delImg('"+memeid+"')\">🗑 Delete</button> </div>";
    postElement.innerHTML = htmlImage;
    loading.classList.remove('show');
    container.appendChild(postElement);
}

function delImg(memeid){
    let request = "http://localhost:3000/delete_meme?id="+memeid;
    console.log(request);


    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            console.log("Meme Deleted");
            window.alert("Your Meme was Deleted!");
        }
    }, false);

    XMLHTTP.send(null);
    location.reload();
}

function Dictate(){
    // get output div reference
    var output = document.getElementById("output");
    // get action element reference
    var action = document.getElementById("action");
    // new speech recognition object
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        action.innerHTML = "<small>listening, please speak...</small>";
    };

    recognition.onspeechend = function() {
        action.innerHTML = "<small></small>";
        recognition.stop();
    }

    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        console.log(transcript);
        document.getElementById("Titel").value = transcript;

    };

    // start recognition
    recognition.start();
}
