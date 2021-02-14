const container = document.getElementById('container');
const loading = document.querySelector('.loading');

var index = 0;
var memes = [];
showRelevantFilters();
loadImageUrls();
document.getElementById("UserName2").innerHTML = "Guest";
if(sessionStorage.getItem('Guest')=="1"){
    var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
    document.getElementById("M2").insertAdjacentHTML( 'beforeend', text );
    document.getElementById("UserName2").innerHTML = sessionStorage.getItem('User');
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
        }
    }, false);

    XMLHTTP.send(null);
}
function loadImageUrls() {
        let XMLHTTP = new XMLHttpRequest();
        XMLHTTP.open("GET","http://localhost:3000/get_memes");
        XMLHTTP.addEventListener("readystatechange",function() {
            if (XMLHTTP.readyState == 4) {
                const j = JSON.parse(XMLHTTP.response)
                memes = j.filter(({Public}) => Public === true);
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
    if(sessionStorage.getItem('Guest')=="1"){
        var userid =  sessionStorage.getItem('UserID');
        var NumUp = data.Likes.length;
        var NumDown=data.Dislikes.length
        const postElement = document.createElement('div');
        var ImgId = data._id;
        postElement.classList.add('blog-post');
        var VoteText = NumUp-NumDown;
        if(VoteText >0){
            VoteText = "+"+VoteText
        }
        var htmlImage = "<button class=\"Vorlesen\" onclick=\"ReadTitel('"+data.Titel+"')\">🔊</button> <h2 class=\"title\">"+data.Titel+"</h2> <img class = \"MemeImages\" src="+data.Url+"> <div class=\"user-info\"><span>"+data.Autor+"</span></div> <div class=\"UserInteraction\" id=\"UserInteraction"+ImgId+"\"> <div class=\"UIaPos\"> <button class=\"Vote\" id=\"UpV"+ImgId+"\" onclick= VoteUp(\""+ImgId+"\")>▲</button> <a class=\"VoteS\" id=\"UpS"+ImgId+"\" >▲</a> <p class=\"LikeNumber\" id=\"LikeNumber"+ImgId+"\">"+VoteText+"</p> <button class=\"DownVote\"  id=\"DownV"+ImgId+"\" onclick=VoteDown(\""+ImgId+"\")>▼</button> <a class=\"DownS\"  id=\"DownS"+ImgId+"\" >▼</a> <div class=\"Red\"></div> <div class=\"Green\" id=\"Green"+ImgId+"\"></div> </div> </div>";
        postElement.innerHTML = htmlImage;
        //document.getElementById("bm").src = MemeUrl;
        container.appendChild(postElement);
        loading.classList.remove('show');
        var UpV = "UpV"+ImgId;
        var DownV = "DownV"+ImgId;
        var UpS = "UpS"+ImgId;
        var DownS = "DownS"+ImgId;
        if(data.Likes.includes(userid)){
            console.log("Hat geliked");
            document.getElementById(UpV).style.display ="none";
            document.getElementById(DownV).style.display ="none";
            document.getElementById(UpS).style.display = "inline";
            document.getElementById(UpS).style.color="black";
            document.getElementById(UpS).style.fontSize="25px";
            document.getElementById(DownS).style.display="inline";
            document.getElementById(DownS).style.color="gray";
            document.getElementById(DownS).style.fontSize="15px";
        }
        else if(data.Dislikes.includes(userid)){
            console.log("Hat gedisliked");
            document.getElementById(UpV).style.display ="none";
            document.getElementById(DownV).style.display ="none";
            document.getElementById(UpS).style.display = "inline";
            document.getElementById(UpS).style.color="gray";
            document.getElementById(UpS).style.fontSize="15px";
            document.getElementById(DownS).style.display="inline";
            document.getElementById(DownS).style.color="black";
            document.getElementById(DownS).style.fontSize="25px";
        }
        else{
            document.getElementById(UpV).style.display ="inline";
            document.getElementById(DownV).style.display ="inline";
            document.getElementById(UpS).style.display = "none";
            document.getElementById(DownS).style.display="none";
        }

        var heightfactor = 75;
        if(NumUp+NumDown!=0){
            heightfactor = (NumUp/(NumUp+NumDown))*150;
        }
        var Green = "Green"+ImgId;
        document.getElementById(Green).style.height=heightfactor+"px";
    }
    else{
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');
        var htmlImage = "<button class=\"Vorlesen\" onclick=\"ReadTitel('"+data.Titel+"')\">🔊</button> <h2 class=\"title\">"+data.Titel+"</h2> <img class = \"MemeImages\" src="+data.Url+"> <div class=\"user-info\"><span>"+data.Autor+"</span></div>";
        postElement.innerHTML = htmlImage;
        loading.classList.remove('show');
        container.appendChild(postElement);
    }
}

function VoteUp(memeid){
    var likeid = sessionStorage.getItem('UserID');
    let request = "http://localhost:3000/add_like?memeid="+memeid+"&likeid="+likeid;

    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET",request);
    XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
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
            getMemes();
            setTimeout(()=>{

                UpdateBarnNumber(memeid);
            },100)
        }
    }, false);


    XMLHTTP.send(null);
}

function VoteDown(memeid){
    var likeid = sessionStorage.getItem('UserID');
    let request = "http://localhost:3000/add_dislike?memeid="+memeid+"&likeid="+likeid;

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

function ReadTitel(text){
    console.log(text);
    var msg = new SpeechSynthesisUtterance();
    msg.lang = 'en-US';
    msg.text = text;
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