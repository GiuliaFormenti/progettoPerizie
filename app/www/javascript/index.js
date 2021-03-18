"use strict"

let images = [];
let user = {};
let links = [];

$(document).ready(function(){
	if(!localStorage.getItem("logged"))
	{
		window.location.replace("login.html");
	}
	//Aggancio dei sensori. Qui cordova plugin add cordova-plugin-dialogs      e      cordova plugin add cordova-plugin-camera
	document.addEventListener("deviceready", function(){
		/*let request = inviaRichiesta("POST", "https://formenti-progetto-perizie.herokuapp.com/api/check");
		request.fail(error);
		request.done(function(data){
			console.log("ok");
		});*/
		
		user = JSON.parse(localStorage.getItem("logged"));
		/*userLogged(function(logged){
			if(!logged)
			{
				window.location.href = "login.html";
			}
		});*/
		let _wrapper = $("#wrapper");
		let _photo = $("#photo")
		let cameraOptions = {"quality":  50};
		let watchId = null;
		let dataOra;
		let lat;
		let lng;
		images = [];

		$('[has-ripple="true"]').click(function () {
			$(this).toggleClass('clicked');
			$('.menu').toggleClass('open');
		  });
		  
		  $('.menu a').each(function (index) {
			let thismenuItem        = $(this);
			
			thismenuItem.click(function (event) {
				console.log("OK");
			  event.preventDefault(); //l'evento di default non viene triggerato
			  
			  $('.menuitem-wrapper').eq(index).addClass('spin');
			  
			  let timer = setTimeout(function () {
				$('body').removeAttr('class').addClass('bg-'+index);
				$('.menuitem-wrapper').eq(index).removeClass('spin');
				$('.menu').removeClass('open');
				$('.menu-btn').removeClass('clicked');

				links = [];
				switch (index) {
					case 0:
						//_div1.html("");
						/*$("<h1>").text("HOME PAGE!").appendTo(_div1);
						$("<p>").text("Click the menu button in the bottom.").appendTo(_div1);*/
						console.log(index + " ok");
						$("#divHome").show();
						$("#divScatta").hide();
						$("#divScegli").hide();
						$("#divUser").hide();
						break;
					case 1:
						//_div1.html("");
						/*$("<h1>").text("UPLOAD PHOTO").appendTo(_div1);
						$("<div>").prop("id", "photo").css("display", "inline-block").appendTo(_div1);
						//let _divPlus = $("<div>").prop("id", "plus").css("display", "inline-block").appendTo(_div1);
						$("<br>").appendTo(_div1);
						$("<p>").appendTo(_div1);*/
						console.log(index + " ok");
						$("#divHome").hide();
						$("#divScatta").show();
						$("#divScegli").hide();
						$("#divUser").hide();
						scattaFoto();
						break;
					case 2:
						//_div1.html("");
						/*$("<h1>").text("UPLOAD PHOTO").appendTo(_div1);
						$("<div>").prop("id", "photo").css("display", "inline-block").appendTo(_div1);
						//let _divPlus = $("<div>").prop("id", "plus").css("display", "inline-block").appendTo(_div1);
						$("<br>").appendTo(_div1);
						$("<p>").appendTo(_div1);*/
						console.log(index + " ok");
						$("#divHome").hide();
						$("#divScatta").show();
						$("#divScegli").hide();
						$("#divUser").hide();
						cercaFoto();
						break;
					case 3:
						//_div1.html("");
						/*$("<h1>").text("UPLOAD PHOTO").appendTo(_div1);
						$("<div>").prop("id", "photo").css("display", "inline-block").appendTo(_div1);
						//let _divPlus = $("<div>").prop("id", "plus").css("display", "inline-block").appendTo(_div1);
						$("<br>").appendTo(_div1);
						$("<p>").appendTo(_div1);*/
						console.log(index + " ok");
						$("#divHome").hide();
						$("#divScatta").hide();
						$("#divScegli").hide();
						$("#divUser").show();
						
						let _txtUser = $("#txtUser");
						let _txtPass =$("#txtPassword");
						let _txtMail =$("#txtMail");
						_txtUser.val(user["username"]);
						_txtMail.prop("placeholder", user["mail"]);
						
						$("#btnUpdate").on("click", function(){
							let request = inviaRichiesta("POST", "https://formenti-progetto-perizie.herokuapp.com/api/updateUser",
								{
									"mail": _txtMail.prop("placeholder"),
									"username": _txtUser.val(),
									"password": _txtPass.val() == ""? "": CryptoJS.MD5(_txtPass.val()).toString()
								} 
							);
							request.fail(error);
							request.done(function(data){
								console.log(data);
								localStorage.setItem("logged", JSON.stringify(data));
								notifica("Your details have just been modified.");
								$("#home").click();
							});
						});
						break;
					case 4:
						//_div1.html("");
						/*$("<h1>").text("UPLOAD PHOTO").appendTo(_div1);
						$("<div>").prop("id", "photo").css("display", "inline-block").appendTo(_div1);
						//let _divPlus = $("<div>").prop("id", "plus").css("display", "inline-block").appendTo(_div1);
						$("<br>").appendTo(_div1);
						$("<p>").appendTo(_div1);*/
						console.log(index + " ok");
						localStorage.removeItem("logged");
						window.location.replace("login.html");
						break;
					default:
						console.log("NOK");
						break;
				}
			  }, 800);
			});
		  });

		$("#divHome").hide();
		$("#divScatta").hide();
		$("#divScegli").hide();
		$("#divUser").hide();

		$("#home").click();

		$(".myClass").on("focus", function(){
			$("#btnMenu").hide();
		});
		$(".myClass").on("blur", function(){
			$("#btnMenu").show();
		});
		
		function scattaFoto(){
			let options = {"enableHeighAccuracy": false, "timeout": 5000, "maximumAge": 0, "frequency": 5000};
			navigator.geolocation.getCurrentPosition(successGps, errorGps, options);
			cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
			cameraOptions.destinationType = Camera.DestinationType.DATA_URL;
			navigator.camera.getPicture(success, error, cameraOptions);
		}
		/*$("#btnScatta").on("click", function(){
			//notifica("ok");
			//startWatch();
			//let options = {"enableHeighAccuracy": false, "timeout": 5000, "maximumAge": 0, "frequency": 5000};
			//navigator.geolocation.getCurrentPosition(successGps, errorGps, options);
				cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
				cameraOptions.destinationType = Camera.DestinationType.DATA_URL;
				navigator.camera.getPicture(success, error, cameraOptions);
		});*/

		function cercaFoto(){
			let options = {"enableHeighAccuracy": false, "timeout": 5000, "maximumAge": 0, "frequency": 5000};
			navigator.geolocation.getCurrentPosition(successGps, errorGps, options);
			cameraOptions.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
			cameraOptions.destinationType = Camera.DestinationType.DATA_URL;
			navigator.camera.getPicture(success, error, cameraOptions);
		}

		$("#gallery").on("click", function(){
			//notifica("ok");
			cameraOptions.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
			cameraOptions.destinationType = Camera.DestinationType.DATA_URL;
			navigator.camera.getPicture(success, error, cameraOptions);
		});

		function startWatch(){
			let options = {"enableHighAccuracy": false, "timeout": 600000, "maximumAge": 0, "frequency": 5000};
			navigator.geolocation.getCurrentPosition(successGps, errorGps, options);
			//watchId = navigator.geolocation.watchPosition(successGps, errorGps, options);
			if(watchId != null)
			{
				console.log("Lettura avviata");
			}
		}

		function stopWatch(){
			if(watchId != null)
			{
				navigator.accelerometer.clearWatch(watchId);
				watchId = null;
				console.log("Lettura terminata");
			}
		}

		function successGps(position){
			console.log("Finalmente");
			//dataOra = (new Date(position.timestamp)).toLocaleTimeString("it-IT", {"hours12": false});
			dataOra = (new Date).toISOString()
			lat = position.coords.latitude;
			lng = position.coords.longitude;
		}

		function errorGps(err){
			notifica("Errore GPS: " + err.code + " - " + err.message);
		}


		//gli viene iniettata l'immagine
		function success(image){
			_photo.html("");
			//photo(image);
			images.push(image);
			$("#nPhoto").text(images.length + " photos chosen");
			//console.log("-->" + image);
			let _img = $("<img>");
			_img.css({"height": 150, "width": "auto"});
			if(cameraOptions.destinationType == Camera.DestinationType.DATA_URL)
			{
				_img.prop("src", "data:image/jpeg;base64," + image);
			}
			else
			{
				_img.prop("src", image);
			}
			_img.appendTo(_photo);

			let req = inviaRichiesta("POST", "https://formenti-progetto-perizie.herokuapp.com/api/uploadImage", {"image": image});
			req.fail(error);
			req.done(function(result){
				links.push(result["result"]["secure_url"]);
			});

			//$("<br>").appendTo(_photo);
			//let _txt = $("<input type='text'>").appendTo(_photo);
			//$("<br>").appendTo(_photo);
			//let _btn = $("<button type='button'>").text("Invia").appendTo(_photo);
		}

		$("#btnSend").on("click", function(){
			//stopWatch();
			/*console.log("val: " + _txt.val());
			console.log("lat: " + lat);
			console.log("lng: " + lng);
			console.log("dataOra: " + dataOra);*/
			
			let request = inviaRichiesta("POST", "https://formenti-progetto-perizie.herokuapp.com/api/upPhoto",
			{
				"images": links,
				"id": user["_id"],
				"lat": lat,//lat,
				"lng": lng,//lng,
				"username": user["username"],
				"dataOra": dataOra,
				"note": $("#txtNote").val()
			});
			request.fail(function(jqXHR, testStatus, strError)
			{
				error(jqXHR, testStatus, strError);
			});
			request.done(function(data)
			{
				console.log(data);
				_photo.html("");
				$("#nPhoto").text("");
				$("#txtNote").val("");
				notifica("Photos saved successfully");
				$("#home").click();
			});
		});
		$("#anotherPhoto").on("click", function(){
			scattaFoto();
		});

		function photo(){
			images.push(image);
			console.log("-->" + image);
			let _img = $("<img>");
			_img.css("height", 150);
			if(cameraOptions.destinationType == Camera.DestinationType.DATA_URL)
			{
				_img.prop("src", "data:image/jpeg;base64," + image);
			}
			else
			{
				_img.prop("src", image);
			}
			_img.appendTo(_photo);

			//$("<br>").appendTo(_photo);
			//let _txt = $("<input type='text'>").appendTo(_photo);
			//$("<br>").appendTo(_photo);
			//let _btn = $("<button type='button'>").text("Invia").appendTo(_photo);
		}

		function error(err){
			if(err.code)
			{
				notifica("Errore FOTO: " + err.code + " - " + err.message);
			}
		}

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