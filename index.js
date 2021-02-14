var SI = document.getElementById("SignIn");
var SU = document.getElementById("SignUp");
var B1 =document.getElementById("LO1");
var B2 = document.getElementById("LO2");
var B3 = document.getElementById("LI");

SI.style.display="none";
SU.style.display="none";

sessionStorage.setItem('Filter',"");
sessionStorage.setItem('Sort',"");


if(sessionStorage.getItem('Guest')=="1"){
    //noguest
    var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
    document.getElementById("M1").insertAdjacentHTML( 'beforeend', text );
    document.getElementById("UserName1").innerHTML = sessionStorage.getItem('User');
    B1.style.display = "none";
    B2.style.display = "none";
    B3.style.display = "inline";
}
else{
    document.getElementById("UserName1").innerHTML = "Guest";
    B1.style.display = "inline";
    B2.style.display = "inline";
    B3.style.display = "none";
}

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
function SignInForm(){
    SU.style.display="none";
    SI.style.display="inline";
}
function SignUpForm(){
    SI.style.display="none";
    SU.style.display="Inline";
}

function SignUp(){

    var Name = document.getElementById("name").value;
    var Mail =document.getElementById("mail").value;
    var PW1 =document.getElementById("pw").value;
    var PW2 =document.getElementById("pwrep").value;
    if(PW1 == PW2){

        if(!Name || !Mail || !PW1) {
            window.alert("Please enter all infos");
        }
        else{
            let request = "http://localhost:3000/add_user?name="+Name+"&mail="+Mail+"&pw="+PW1+"&admin=false";
            console.log(request);
            let XMLHTTP = new XMLHttpRequest();
            XMLHTTP.open("GET",request);
            XMLHTTP.setRequestHeader('Content-Type', 'text/plain')
            XMLHTTP.addEventListener("readystatechange",function() {
                if (XMLHTTP.readyState == 4) {
                    console.log("User Uploaded");
                    sessionStorage.setItem('User', Name);
                    sessionStorage.setItem('Guest', "1");
                    var text = "<a href=\"MeemeGen.html\">MemeGenerator</a>\n" + " <a href=\"UploadMeme.html\">Upload</a>"
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

    cancel();
}
function SignIn(){
    var users;
    var mail = document.getElementById("mailL").value;
    var pw =document.getElementById("pwL").value;
    let XMLHTTP = new XMLHttpRequest();
    XMLHTTP.open("GET","http://localhost:3000/get_users");
    XMLHTTP.addEventListener("readystatechange",function() {
        if (XMLHTTP.readyState == 4) {
            const j = JSON.parse(XMLHTTP.response)
            users = j;
            var solution = users.filter(({Email}) => Email === mail);
            solution = solution.filter(({Password}) => Password === pw);
            if(solution.length>0){
                console.log(solution[0].Name);
                sessionStorage.setItem('User', solution[0].Name);
                sessionStorage.setItem('UserID', solution[0]._id);
                sessionStorage.setItem('Guest', "1");
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
    cancel();
}

function signOut(){
    B1.style.display = "inline";
    B2.style.display = "inline";
    B3.style.display = "none";
    sessionStorage.setItem('User', "");
    sessionStorage.setItem('Guest', "");
    location.reload();
}
