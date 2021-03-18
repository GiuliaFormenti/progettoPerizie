"use script";

let rect;
let foundU = false;
let foundM = false;

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

    $("#back").on("click", function(){
        window.location.href = "./index.html";
    });
    $("#back").on("mouseover", function(){
        $("#back").css("cursor", "pointer");
    });

    $("#btnSignIn").on("click", function(){
        foundU = false;
        foundM = false;
        console.log("username == " + username.val());
        console.log("mail == " + password.val());
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
                    text: "You have to insert username and mail"
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
                        text: "You have to insert mail"
                      });
                }
            }
        }
        else
        {
           
            let request = inviaRichiesta("GET", "/api/findMail/", {"mail": password.val()});
            request.fail(error);

            request.done(function(data)
            {
                console.log(data);
                if(data["ris"] == "nok")
                {
                    //notifica("This mail is already used");
                    foundM = true;
                }
                
                let request = inviaRichiesta("GET", "/api/findUser/", {"username": username.val()});
                request.fail(error);

                request.done(function(data)
                {
                    console.log(data);
                    if(data["ris"] == "nok")
                    {
                        //notifica("This mail is already used");
                        foundU = true;
                    }
                    
                    
                    if(!foundU && !foundM)
                    {
                        //richiesta di registrazione
                        
                        let request = inviaRichiesta("POST", "/api/signUp/",
                        {
                            "username": username.val(),
                            "mail": password.val(),
                            "msg": "Admin has created your account."
                        });

                        request.fail(function(jqXHR, testStatus, strError)
                        {
                            error(jqXHR, testStatus, strError);
                        });
                        request.done(function(data){
                            console.log(data);
                            //notifica("The temporary password has been sent to user's email.");
                            swal("The temporary password has been sent to user's email.", {
                                icon: "success",
                                title: "Good!",
                                buttons: {
                                    cancel: false,
                                    confirm: "Login"
                                }
                              }).then((value) => {
                                window.location.href = "./index.html";
                              });
                        });
                    }
                    else
                    {
                        if(foundU && foundM)
                        {
                            
                            swal({
                                title: "Error!",
                                icon: "error",
                                text: "Both mail and username are already been used. Please insert others."
                            });
                        }
                        else
                        {
                            if(foundU)
                            {
                                //notifica("Username is already been used. Please insert another one");
                                swal({
                                    title: "Error!",
                                    icon: "error",
                                    text: "Username is already been used. Please insert another one"
                                });
                            }
                            else
                            {
                                //notifica("Mail is already been used. Please insert another one");
                                swal({
                                    title: "Error!",
                                    icon: "error",
                                    text: "Mail is already been used. Please insert another one"
                                });
                            }
                        }
                    }
                });
            });
        }
    });

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