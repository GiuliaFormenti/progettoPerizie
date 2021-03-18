"use script";

let rect;

$(document).ready(function()
{
    rect = document.getElementById("rect");
    let username = $("#username");
    let password = $("#password");
    /*let _lblError = $("#lblError");
    let _errorText = $("#lblError span");
    let _lblError2 = $("#lblError2");
    let _errorText2 = $("#lblError2 span");*/

    /*_lblError.hide();
    _lblError2.hide();*/
    
    //For codepen header!!!
    setTimeout(() => {
        password.focus();
    }, 500);
    
    setTimeout(() => {
        username.focus();
    }, 1500);

    $("#btnSignIn").on("click", function(){
        if(username.val() == "" || password.val() == "")
        {
            //alert("You have to insert username and password");
            if(username.val() == "" && password.val() == "")
            {
                /*_lblError.show();
                _errorText.text("You have to insert username");*************/
                //username.css({"border":`5px solid red`});
                username.addClass("bordo");
                /*_lblError2.show();
                _errorText2.text("You have to insert password");*********************/
                //password.css({"border":`5px solid red`});
                password.addClass("bordo");

                swal({
                    title: "Warning!",
                    icon: "error",
                    text: "You have to insert username and password"
                  });
            }
            else
            {
                if(username.val() == "")
                {
                    /*_lblError.show();
                    _errorText.text("You have to insert username");*********************/
                    username.css({"border":`5px solid red`});
                    swal({
                        title: "Warning!",
                        icon: "error",
                        text: "You have to insert username"
                      });
                }
                else
                {
                    /*_lblError2.show();
                    _errorText2.text("You have to insert password");***********************/
                    password.css({"border":`5px solid red`});
                    swal({
                        title: "Warning!",
                        icon: "error",
                        text: "You have to insert password"
                      });
                }
            }
        }
        else
        {
            if(username.val() == "admin")
            {
                /*if(password.val() == "adminpassword")
                {*/
                    //alert("Login effettuato");
                    let passMd5 = CryptoJS.MD5(password.val()).toString();
                    let request = inviaRichiesta("POST", "/api/login/",
                    {
                        "username": username.val(),
                        "password": passMd5
                    });

                    console.log(username.val() + "   " + password.val());
                    request.fail(function(jqXHR, testStatus, strError)
                    {
                        error(jqXHR, testStatus, strError);
                    });
                    request.done(function(data)
                    {
                        console.log(data);
                        window.location.href="../index.html";
                    });
                    //window.location.href="../index.html";
                /*}
                else
                {
                    /*_lblError2.show();
                    _errorText2.text("Password not ok");*********************
                    password.css({"border":`5px solid red`});
                    swal({
                        title: "Warning!",
                        icon: "error",
                        text: "Password not ok"
                      });
                }*/
            }
            else
            {
                /*_lblError.show();
                _errorText.text("Username not ok");*************************/
                username.css({"border":`5px solid red`});
                swal({
                    title: "Warning!",
                    icon: "error",
                    text: "Username not ok"
                  });
            }
        }
        /*let pwd = CryptoJS.MD5(password.val()).toString();
        let request = inviaRichiesta("POST", "/api/pwd/", {"password": pwd});
        request.done(function(data)
        {
            console.log(data);
            //window.location.href="../index.html";
        });*/
    });

    /*_lblError.children("button").on("click", function(){
		_lblError.hide();
    });
    _lblError2.children("button").on("click", function(){
		_lblError2.hide();
    });*/
    
    /*username.on("click", function(){
        //username.css({"border":""});
        username.removeClass("bordo");
    });
    password.on("click", function(){
        //password.css({"border":""});
        password.removeClass("bordo");
    });*/

    $(document).on('keydown', function() {
        console.log("ok");
        username.css({"border":""});
        password.css({"border":""});
     });
});

function handle1() {
    rect.setAttribute("class", "rect2");
}

function handle2() {
    rect.setAttribute("class", "rect1");
}


/*function inviaRichiesta(method, url, parameters = {}) {
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
        swal("Error!", "Connection refused or Server timeout", "error");
    }
    else if(jqXHR.status == 403)
    {
        //Token scaduto
        window.location.href="login.html";
    }
    else if (jqXHR.status == 200)
    {
        swal("Error!", "Data format uncorrect: " + jqXHR.responseText, "error");
    }
    else
    {
        swal("Error!", "Server Error: " + jqXHR.status + " - " + jqXHR.responseText, "error");
    }
}*/