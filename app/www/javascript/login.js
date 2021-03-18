"use strict"

let foundU = false;
let foundM = false;
    
$(document).ready(function() {
    document.addEventListener('deviceready', function() {
        let username = $("#regname");
        let mail = $("#regmail");

        let user = $("#name");
        let pass = $("#pass");
 
        $(".input input").focus(function() {

            $(this).parent(".input").each(function() {
            $("label", this).css({
                "line-height": "18px",
                "font-size": "18px",
                "font-weight": "100",
                "top": "0px"
            })
            $(".spin", this).css({
                "width": "100%"
            })
            });
        }).blur(function() {
            $(".spin").css({
            "width": "0px"
            })
            if ($(this).val() == "") {
            $(this).parent(".input").each(function() {
                $("label", this).css({
                    "line-height": "60px",
                    "font-size": "24px",
                    "font-weight": "300",
                    "top": "10px"
                })
            });
    
            }
        });
  
        $(".button").click(function(e) {
            var pX = e.pageX,
            pY = e.pageY,
            oX = parseInt($(this).offset().left),
            oY = parseInt($(this).offset().top);
    
            $(this).append('<span class="click-efect x-' + oX + ' y-' + oY + '" style="margin-left:' + (pX - oX) + 'px;margin-top:' + (pY - oY) + 'px;"></span>')
            $('.x-' + oX + '.y-' + oY + '').animate({
            "width": "500px",
            "height": "500px",
            "top": "-250px",
            "left": "-250px",
    
            }, 600);
            $("button", this).addClass('active');
        })
    
        $(".alt-2").click(function() {
            //$(this).removeClass("myClass");
            if (!$(this).hasClass('material-button'))
            {
                $(".shape").css({
                    "width": "100%",
                    "height": "100%",
                    "transform": "rotate(0deg)"
                })
        
                setTimeout(function() {
                    $(".overbox").css({
                        "overflow": "initial"
                    })
                }, 600)
        
                $(this).animate({
                    "width": "140px",
                    "height": "140px"
                }, 500, function() {
                    $(".box").removeClass("back");
        
                    $(this).removeClass('active')
                });
        
                $(".overbox .title").fadeOut(300);
                $(".overbox .input").fadeOut(300);
                $(".overbox .button").fadeOut(300);
        
                $(".alt-2").addClass('material-buton');
            }
    
        })
  
        $(".material-button").click(function() {
    
            if ($(this).hasClass('material-button')) {
            setTimeout(function() {
                $(".overbox").css({
                    "overflow": "hidden"
                })
                $(".box").addClass("back");
            }, 200)
            $(this).addClass('active').animate({
                "width": "700px",
                "height": "700px"
            });
    
            setTimeout(function() {
                $(".shape").css({
                    "width": "50%",
                    "height": "50%",
                    "transform": "rotate(45deg)"
                })
    
                $(".overbox .title").fadeIn(300);
                $(".overbox .input").fadeIn(300);
                $(".overbox .button").fadeIn(300);
            }, 700)
    
            $(this).removeClass('material-button');
    
            }
    
            if($(".alt-2").hasClass('material-buton'))
            {
                $(".alt-2").removeClass('material-buton');
                $(".alt-2").addClass('material-button');
            }
    
        });

        $("#btnRegister").on("click", function(){
            //username
            //mail
            
            if(username.val() == "" && mail.val() == "")
            {
                notifica("You have to insert username and mail");
            }
            else
            {
                if(username.val() == "")
                {
                    notifica("You have to insert username");
                }
                else
                {
                    if(mail.val() == "")
                    {
                        notifica("You have to insert mail");
                    }
                    else
                    {
                        let request = inviaRichiesta("GET", "https://formenti-progetto-perizie.herokuapp.com/api/findMail/", {"mail": mail.val()});
                        request.fail(error);

                        request.done(function(data)
                        {
                            console.log(data);
                            if(data["mail"] == "found")
                            {
                                //notifica("This mail is already used");
                                foundM = true;
                            }
                            
                            let request = inviaRichiesta("GET", "https://formenti-progetto-perizie.herokuapp.com/api/findUser/", {"username": username.val()});
                            request.fail(error);

                            request.done(function(data)
                            {
                                console.log(data);
                                if(data["username"] == "found")
                                {
                                    //notifica("This mail is already used");
                                    foundU = true;
                                }
                                
                                
                                if(!foundU && !foundM)
                                {
                                    //richiesta di registrazione
                                    let request = inviaRichiesta("POST", "https://formenti-progetto-perizie.herokuapp.com/api/signUp/",
                                    {
                                        "username": username.val(),
                                        "mail": mail.val(),
                                        "msg": "You have successfully created your account"
                                    });

                                    request.fail(function(jqXHR, testStatus, strError)
                                    {
                                        error(jqXHR, testStatus, strError);
                                    });
                                    request.done(function(data){
                                        console.log(data);
                                        notifica("Your password has been sent to your email.\n Now you can sign in");
                                        $(".alt-2").click();
                                    });
                                }
                                else
                                {
                                    if(foundU && foundM)
                                    {
                                        notifica("Both mail and username are already been used. Please insert others");
                                    }
                                    else
                                    {
                                        if(foundU)
                                        {
                                            notifica("Username is already been used. Please insert another one");
                                        }
                                        else
                                        {
                                            notifica("Mail is already been used. Please insert another one");
                                        }
                                    }
                                }
                            });
                        });
                        /*notifica("Your password has been sent to your email.\n Now you can sign in");
                        $(".alt-2").click();*/
                    }
                }
            }
            
        });
	

        $("#btnLogin").on("click", function(){
            if(user.val() == "" || pass.val() == "")
            {
                //alert("You have to insert username and password");
                if(user.val() == "" && pass.val() == "")
                {
                    /*_lblError.show();
                    _errorText.text("You have to insert username");*************/
                    //username.css({"border":`5px solid red`});
                    ///////////////username.addClass("bordo");
                    /*_lblError2.show();
                    _errorText2.text("You have to insert password");*********************/
                    //password.css({"border":`5px solid red`});
                    ///////////////password.addClass("bordo");

                    notifica("You have to insert username and password");
                    
                }
                else
                {
                    if(user.val() == "")
                    {
                        /*_lblError.show();
                        _errorText.text("You have to insert username");*********************/
                        //username.css({"border":`5px solid red`});
                        notifica("You have to insert username");
                    }
                    else
                    {
                        /*_lblError2.show();
                        _errorText2.text("You have to insert password");***********************/
                        pass.css({"border":`5px solid red`});
                        notifica("You have to insert password");
                    }
                }
            }
            else //https://palumbo-rilievi-e-perizie.herokuapp.com/
            {
                //alert("Login effettuato");
                let passMd5 = CryptoJS.MD5(pass.val()).toString();
                let request = inviaRichiesta("POST", "https://formenti-progetto-perizie.herokuapp.com/api/login",
                {
                    "username": user.val(),
                    "password": passMd5
                });

                console.log(user.val() + "   " + pass.val());
                request.fail(function(jqXHR, testStatus, strError)
                {
                    error(jqXHR, testStatus, strError);
                });
                request.done(function(data)
                {
                    //console.log("token = " + data["token"]);
                    //localStorage.setItem('logged', 'true');
                    localStorage.setItem("logged", JSON.stringify(data["user"]));
                    window.location.replace("index.html");
                });
                //window.location.href="../index.html";
                
            }
        });


    /*let username = $("#username");
    let password = $("#password");
    //For codepen header!!!
    setTimeout(() => {
        password.focus();
    }, 500);
    
    setTimeout(() => {
        username.focus();
    }, 1500);

    $("#btnSignIn").on("click", function(){
        if(username.val() == "" || username.val() == "")
        {
            if(username.val() == "" && password.val() == "")
            {
                username.addClass("bordo");
                
                password.addClass("bordo");

				notifica("You have to insert username and password");
               
            }
            else
            {
                if(username.val() == "")
                {
					username.css({"border":`5px solid red`});
					notifica("You have to insert username");
                    
                }
                else
                {
                
					password.css({"border":`5px solid red`});
					notifica("You have to insert password");
                    
                }
            }
        }
        else
        {
            if(username.val() == "admin")
            {
                if(password.val() == "adminpassword")
                {
                
                    window.location.href="../index.html";
                }
                else
                {
                    
					password.css({"border":`5px solid red`});
					notifica("Password not ok");
                    
                }
            }
            else
            {
               
				username.css({"border":`5px solid red`});
				notifica("Username not ok");
                
            }
        }
    });*/
	 
    function notifica(msg){		 
        navigator.notification.alert(
		    msg,    
		    function() {},       
		    "Info",       // Titolo finestra
		    "Ok"          // pulsante di chiusura
	    );
	}
  });  
}); 