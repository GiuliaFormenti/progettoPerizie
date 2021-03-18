const ACCESS_BUTTONS=
'<li id="btnSign" class="nav-item" style=" margin-left: 750px; margin-bottom: 0.5%";">'
+'<a class="btn btn-primary noselect" href="signUp.html" style = "width: auto">Sign Up</a>'
+'</li>'

+'<li id="btnLogg" class="nav-item"  style="margin-left: 10px; ;">'
+'<a class="btn btn-success noselect" href="login.html">Login</a>'
+'</li>';//style="margin-left: 10%         style=" margin-left: 750px; margin-bottom: 0.5%";"           style="margin-left: 10px; ;"

const LOGGED_BUTTONS=
'<li id="btnDisc" class="nav-item" style=" margin-left: 750px;">'
+'<a class="btn btn-danger  noselect" id="btnDisconnect" style="margin-top: 5%";">Disconnect</a>'
+'</li>'

+'<li id="btnProfile"class="nav-item" >'
+'<a  class="noselect" id="userMan" href="userManagement.html" style="margin-left: 10%";">' 
+'<img id="userImage">'
+'</a>'
+'</li>';//style="margin-top: 5%";"        style="margin-left: 10%";"                 style="display: inline-block; margin-left: 10%

const LI_NOT_LOGGED =
'<li id = "linkSignUp" class="nav-item active">'
+'<a class="nav-link noselect" href="signUp.html">Sign Up</a>'
+'</li>'

+'<li id = "linkLogin" class="nav-item active">'
+'<a class="nav-link noselect" href="login.html">Login</a>'
+'</li>';

const LI_LOGGED =
'<li id = "linkDisc" class="nav-item active">'
+'<a class="nav-link noselect" >Disconnect</a>'
+'</li>'

+'<li id = "linkUser" class="nav-item active">'
+'<a class="nav-link noselect" href="userManagement.html>Profile</a>'
+'</li>';

function inviaRichiesta(method, url, parameters = {}) {
    let contentType;
    if (method.toUpperCase() == "GET")
    {
        contentType = "application/x-www-form-urlencoded; charset=UTF-8"
    }
    else
    {
        contentType = "application/json; charset=UTF-8"
        parameters = JSON.stringify(parameters);
    }

    return $.ajax({
        url: url, //default: currentPage
        type: method,
        data: parameters,
        contentType: contentType,
        dataType: "json",
        timeout: 500000
    });
}


function error(jqXHR, testStatus, strError) {
    if (jqXHR.status == 0)
    {
        console.log("nok");
        //swal("Error!", "Connection refused or Server timeout", "error");
    }
    else if(jqXHR.status == 403)
    {
        //Token scaduto
        console.log("nok");
        window.location.href="login.html";
    }
    else if (jqXHR.status == 200)
    {
        console.log("nok");
        //swal("Error!", "Data format uncorrect: " + jqXHR.responseText, "error");
    }
    else
    {
        console.log("nok");
        //swal("Error!", "Server Error: " + jqXHR.status + " - " + jqXHR.responseText, "error");
    }
}

function doned(data) {
    console.log(data);
}

function userLogged(login=false, callback=null)
{
    let request = inviaRichiesta("POST", "/api/checkToken");
    let logged;
    request.fail(function()
    {
        console.log("request fail")
        logged=false;
        if (typeof callback === 'function') {
            callback(logged);
        }
        return logged;
    });
    request.done(function(data){
        console.log("request done");
        if(data["ris"] != "noToken")
        {
            /*//$("#btnContainer").html($("#btnContainer").html() + LI_LOGGED);
            $("#btnContainer").html($("#btnContainer").html() + LOGGED_BUTTONS);
            $("#btnDisconnect").on("click", function()
            {
                let logoutRequest=makeRequest("POST", "/api/logout");
                logoutRequest.fail(error);
                logoutRequest.done(function()
                {
                    let path = window.location.pathname;
                    let page = path.split("/").pop();
                    if(page!="userManagement.html")
                    {
                        window.location.reload(true);
                    }
                    else
                    {
                        window.location.href="../index.html";
                    }
                });
            });
            $("#userImage").prop({
                "src":`img/User-${data.gender}.png`,
                "alt":"Avatar",
                "class":"avatar"
            });*/
            console.log("data[ris] != noToken");

            logged=true;
            
        }
        else if (login)
        {
            console.log("login == true")
            window.location.href="../login.html";
        }
        else
        {
            console.log("login == false");
            //$("#btnContainer").html($("#btnContainer").html() + LI_NOT_LOGGED);
            /////$("#btnContainer").html($("#btnContainer").html() + ACCESS_BUTTONS);
            logged=false;
        }
        if (typeof callback === 'function') {
            callback(logged);
        }       
    });
    /*console.log("logged = " + logged);
    return logged;*/
}

function getParameters()
{
    let params=window.location.search.replace("?", "").split("&");
    let returnedParams={};

    for(let i=0; i<params.length;i++)
    {
        let thisParameter=params[i].split("=");
        returnedParams[thisParameter[0]]=thisParameter[1];
    }
    return returnedParams;
}