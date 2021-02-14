var ImgContainer = document.getElementById("currentImg");

var index = 0;
var memes = [];

showRelevantFilters();
getMemes();
document.getElementById("UserName3").innerHTML = "Guest";
document.getElementById("UserInteraction").style.display ="none";
if(sessionStorage.getItem('Guest')=="1"){
    var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
    document.getElementById("M3").insertAdjacentHTML( 'beforeend', text );
    document.getElementById("UserName3").innerHTML = sessionStorage.getItem('User');
    document.getElementById("UserInteraction").style.display ="inline";
}

function getMemes(){
        let XMLHTTP = new XMLHttpRequest();
        XMLHTTP.open("GET","http://localhost:3000/get_memes");
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
                ImgContainer.src =memes[index].Url;
                UpdateInfo();
            }
        }, false);

        XMLHTTP.send(null);

}



function UpdateInfo(){
    var UpB = document.getElementById("UpV").style.display;
    var DownB = document.getElementById("DownV").style.display;
    var UpS = document.getElementById("UpS").style.display;
    var DownS = document.getElementById("DownS").style.display;
    document.getElementById("MemeTitel").innerHTML  = memes[index].Titel;
    document.getElementById("ErstellInfos").innerHTML  = memes[index].Autor;
    var userid =  sessionStorage.getItem('UserID');

    //Update if Likebuttons or which Like State is shown
    if(memes[index].Likes.includes(userid)){
        console.log("Hat geliked");
        document.getElementById("UpV").style.display ="none";
        document.getElementById("DownV").style.display ="none";
        document.getElementById("UpS").style.display = "inline";
        document.getElementById("UpS").style.color="black";
        document.getElementById("UpS").style.fontSize="25px";
        document.getElementById("DownS").style.display="inline";
        document.getElementById("DownS").style.color="gray";
        document.getElementById("DownS").style.fontSize="15px";
    }
    else if(memes[index].Dislikes.includes(userid)){
        console.log("Hat gedisliked");
        document.getElementById("UpV").style.display ="none";
        document.getElementById("DownV").style.display ="none";
        document.getElementById("UpS").style.display = "inline";
        document.getElementById("UpS").style.color="gray";
        document.getElementById("UpS").style.fontSize="15px";
        document.getElementById("DownS").style.display="inline";
        document.getElementById("DownS").style.color="black";
        document.getElementById("DownS").style.fontSize="25px";
    }
    else{
        document.getElementById("UpV").style.display ="inline";
        document.getElementById("DownV").style.display ="inline";
        document.getElementById("UpS").style.display = "none";
        document.getElementById("DownS").style.display="none";
    }

    //Like Balken + Zahl
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
function PrevImg() {
    index = index - 1 + memes.length;
    index = index % memes.length;
    d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 0);
    setTimeout(() => {
        ImgContainer.src = memes[index].Url;
        d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 1);
    }, 300);
    UpdateInfo();
}

function NextImg() {
    if(document.getElementById("RandomCheck").checked){
        console.log("random order");
        index = Math.floor(Math.random()*10001);
    }
    else{

        index++;
    }
    index = index % memes.length;
    d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 0);
    setTimeout(() => {
        ImgContainer.src = memes[index].Url;
        d3.select("#currentImg").transition().duration(300).ease(d3.easeLinear).style("opacity", 1);
    }, 300);
    UpdateInfo();
}

function VoteUp(){
    var likeid = sessionStorage.getItem('UserID');
    var memeid = memes[index]._id;
    let request = "http://localhost:3000/add_like?memeid="+memeid+"&likeid="+likeid;

    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            console.log("Like Pushed");
            getMemes();
            UpdateInfo();
        }
    }, false);

    XMLHTTP.send(null);
}

function VoteDown(){
    var likeid = sessionStorage.getItem('UserID');
    var memeid = memes[index]._id;
    let request = "http://localhost:3000/add_dislike?memeid="+memeid+"&likeid="+likeid;

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



var autoplay = false;
document.getElementById("stopAp").style.display="none";


function AutoPlay() {
    document.getElementById("stopAp").style.display="inline";
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

function stopAuto(){
    document.getElementById("stopAp").style.display="none";
    document.getElementById("nextAp").style.display="inline";
    autoplay = false;
}

function ReadTitel(){
    var msg = new SpeechSynthesisUtterance();
    msg.lang = 'en-US';
    msg.text = document.getElementById("MemeTitel").innerText;
    window.speechSynthesis.speak(msg);
}

function FilterMenu(){
    var Menu = document.getElementById("FilterAuswahl");
    if(Menu.style.display =="inline"){
        Menu.style.display = "none";
    }
    else{
        Menu.style.display ="inline";
    }
}
function RemFilter(text){
    console.log(text+"remove");
    if(text=='Sort'){
        sessionStorage.setItem('Sort',"");
    }
    if(text=='Filter'){
        sessionStorage.setItem('Filter',"");
    }
    location.reload();
}
function addFilter(text){
    console.log(text);
    if(text=='Filter'){
        sessionStorage.setItem('Filter', document.getElementById("TextFilter").value);
    }
    if(text=='SL'){
        sessionStorage.setItem('Sort', "likes");
    }
    if(text=='SDN'){
        sessionStorage.setItem('Sort', "dateN");
    }
    if(text=='SDO'){
        sessionStorage.setItem('Sort', "dateO");
    }
    location.reload();
}
function showRelevantFilters(){
    document.getElementById("FT").innerHTML = sessionStorage.getItem('Filter')+"<button class=\"FilteredX\" onclick=\"RemFilter('Filter')\">x</button>";
    document.getElementById("FT").style.display = "none";
    document.getElementById("FDU").style.display = "none";
    document.getElementById("FL").style.display = "none";
    document.getElementById("FDD").style.display = "none";
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
}