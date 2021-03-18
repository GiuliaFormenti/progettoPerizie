"use strict"
let map, infoWindow, marker;
let panel, panel2, header, msg2;
let coordP1, coordP2;
let coordA1, coordA2;
let car, _inner, _ol;
let pan;
let currentPosition;
let ok = true;
$(document).ready(function(){
  header = $("#header");
  //let button = header.children("input");
  let button = $("#btnCalcola");
  //let partenza = header.find("input").eq(0);
  let partenza = $("#txtPartenza");
  //let arrivo = header.find("input").eq(1);
  let arrivo = $("#txtArrivo");
	let wrapper = $("#wrapper");
	let map =  wrapper.children(".map")[0];   // js
	panel = wrapper.children(".panel")[0];   // js
  let msg =  wrapper.children(".msg");
  msg2 = $("#msg");
  header.hide();

  //let wrapper2 = $("#wrapper2");
	//map2 =  wrapper2.children(".map")[0];   // js
	//panel2 = wrapper2.children(".panel")[0];   // js
  //let msg22 =  wrapper2.children(".msg");

  _inner = $("#inner");
  _ol = $("#list");
  car = $("#carouselExampleIndicators");
  car.hide();

  pan = $("#pan");
  let pan2 = document.getElementById("pan");

  //wrapper2.hide();

  /*partenza.css("color", "cyan");
  arrivo.css("color", "cyan");*/
  /*userLogged(true, function(logged){
    if(logged)
    {
      console.log("ok");
      initMap();
      setMarkers();
    }
  });*/
  initMap();
  setMarkers();



  $("#home").on("mouseover", "a", function(){
    console.log($(this).find("h1").text());
    if(ok)
    {
      console.log("ok");
      $(this).find("div").addClass("ok");
    }
    else
    {
      $(this).find("div").removeClass("ok");
    }
  });
  $("#home").on("click", "a", function(){
    let _text = $(this).find("h1").text();
    //console.log(_text);
    if(_text == "HOME")
    {
      ok = true;
    }
    else
    {
      ok = false;
    }

    if((_text == "HOME") || (_text == "MAP"))
    {
      let hash = $(this).attr('href');
      $('html,body').animate({
        scrollTop: $(hash).offset().top
      }, 800);
    }
  });
	
	button.on("click", function(){
    pan.html("");
    
    if(button.text() == "Calculate")
    {
      console.log("if");
      if((partenza.val() == "") || (arrivo.val() == ""))
      {
        swal({
          title: "Warning!",
          icon: "error",
          text: "Fields uncorrect"
        });
      }
      else
      {
        car.hide();
        
        let directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer();
        currentPosition = new google.maps.LatLng(coordP1, coordP2);

        let mapOptions = 
          {
            "center":currentPosition,
            "zoom":16,
            "mapTypeId":google.maps.MapTypeId.ROADMAP
          }
        let gMap = new google.maps.Map(map, mapOptions);
        directionsRenderer.setMap(gMap);
        calculateRoute(directionsService, directionsRenderer);
        //visualizzaPercorso("(" + coordP1 + ", " + coordP2 + ")", "(" + coordA1 + ", " + coordA2 + ")");
      }
    }
    else
    {
      console.log("else");
      //wrapper2.hide();
      //wrapper.show();
      initMap();
      setMarkers();
      $("#div1").show();
      $("#div2").show();
      $("#txtArrivo").val("");
      msg.html("");
      button.text("Calculate");
    }
});

function calculateRoute(directionsService, directionsRenderer) {
  let request = {
      origin: currentPosition,
      destination: new google.maps.LatLng(coordA1, coordA2),
      travelMode: 'DRIVING'
  };
  directionsService.route(request, function (routes, status) 
    {
        if (status == 'OK') {
            directionsRenderer.setDirections(routes);
            directionsRenderer.setPanel(pan2);
        }

        let distance = routes.routes[0].legs[0].distance.text;
        let time = routes.routes[0].legs[0].duration.text;
        msg.html(`Distance: ${distance} | Time: ${time}`);
        $("#div1").hide();
        $("#div2").hide();
        button.text("Back");
        //wrapper.hide();
        //wrapper2.show();
    });
}

function visualizzaPercorso(coordP, coordA){
    console.log("Coordinate partenza: " + coordP);
    console.log("Coordinate arrivo: " + coordA);
    
    let mapOptions = {"center": coordP, "zoom": 15, "mapTypeId": google.maps.mapTypeId.ROADMAP};
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    let percorso = {"origin": coordP, "destination": coordA, "travelMode": google.maps.TravelMode.DRIVING};
    
    //calcola il percorso
    directionsService.route(percorso, function(routes, status){
        if(status == google.maps.DirectionsStatus.OK)
        {
            let mapId = new google.maps.Map(map2, mapOptions);
            
            //Disegna percorso
            directionsRenderer.setDirections(routes);
            directionsRenderer.setMap(mapId);
            directionsRenderer.detPanel(pan);
            
            //distanza e tempo di perorrenza
            let distanza = routes.routes[0].legs[0].distance.text;
            let tempo = routes.routes[0].legs[0].duration.text;
            
            msg22.html("Distanza: " + distanza + "<br> Tempo: " + tempo);
        }
    });
}
});

function logout(){
  let request = inviaRichiesta("POST", "/api/logout");
    request.fail(error);
    request.done(function(data){
      console.log(data);
      window.location.reload();
  });
}

 
  
  
function initMap() {
    map = new google.maps.Map($("#wrapper").children(".map")[0], {
        center: { lat: 42.088923, lng: 12.063364 },
        zoom: 6,
      });
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              /*map = new google.maps.Map($("#wrapper").children(".map")[0], {
                  center: { lat: position.coords.latitude, lng: position.coords.longitude },
                  zoom: 4,
                });*/
                infoWindow = new google.maps.InfoWindow();
                header.show();
                msg2.hide();
                $("#txtPartenza").val("Current position");
                coordP1 = position.coords.latitude;
                coordP2 = position.coords.longitude;
                //msg2.text("");
              //infoWindow.setPosition(pos);
              //infoWindow.setContent("Location found.");
              //infoWindow.open(map);
              map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );

        
    }
    else
    {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
   
  }
  
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  function setMarkers(){
      //const myLatLng = { lat: -25.363, lng: 131.044 };
      let request = inviaRichiesta("GET", "/api/findAll/");
      request.done(function(data){
          console.log(data);
          let record = data["data"];
          const svgMarker = {
            path:
              "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "blue",
            fillOpacity: 0.6,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
          };
          if(data["data"] != "no-data")
          {
              for(let i = 0; i < data["data"].length; i++)
              {
                let marker = new google.maps.Marker({
                    position: {lat: parseFloat(data["data"][i]["lat"]), lng: parseFloat(data["data"][i]["lng"])},
                    icon: svgMarker,
                    map,
                    title: data["data"][i]["username"]
                  });
                  marker.addListener("click", function(){
                    coordA1 = data["data"][i]["lat"];
                    coordA2 = data["data"][i]["lng"];

                    $("#txtArrivo").val(coordA1 + " - " + coordA2);

                    //panel.innerHTML = "";
                    _ol.html("");
                    _inner.html("");
                    pan.html("");

                    //panel.prop("id", data["data"][i]["_id"]);
                    let _div = $("<div>").appendTo(pan);/*.css({"weight": "150px", "height": "150px"})*/
                    carousel(_div, data["data"][i]["image"]);
                    //let _img = $("<img>").css({"weight": "150px", "height": "150px"}).prop("src", "data:image/jpeg;base64," + data["data"][i]["image"]).appendTo(_div);
                    $("<br>").appendTo(pan);
                    let _p = $("<p>").html("<b>Latitudine:</b> " + data["data"][i]["lat"]).appendTo(pan);
                    $("<br>").appendTo(pan);
                    _p = $("<p>").html("<b>Longitudine:</b> " + data["data"][i]["lng"]).appendTo(pan);
                    $("<br>").appendTo(pan);
                    _p = $("<p>").html("<b>User:</b> " + data["data"][i]["username"]).appendTo(pan);
                    $("<br>").appendTo(pan);
                    _p = $("<p>").html("<b>Data e ora:</b> " + data["data"][i]["dataOra"]).appendTo(pan);
                    $("<br>").appendTo(pan);
                    _p = $("<p style='display:inline-blockM'>").html("<b>Note:</b> <p id='pNote' style='display:inline-block;'>" + data["data"][i]["note"] + "</p>").appendTo(pan);

                    let _pNote = $("#pNote");
                    let _br = $("<br>").appendTo(_p);
                    _br.hide();
                    let _txt = $("<textarea>").appendTo(_p);
                    _txt.hide();

                    let _i = $("<i style='margin-left:3%;'>").addClass("fas fa-pen").appendTo(_p);
                    let _i2 = $("<i style='margin-left:3%;'>").addClass("fas fa-check").appendTo(_p);
                    _i2.hide();

                    _i.on("mouseover", function(){
                      _i.css("cursor", "pointer");
                    });
                    _i2.on("mouseover", function(){
                      _i2.css("cursor", "pointer");
                    });
                    _i.on("click", function(){
                      _br.show();
                      _pNote.hide();
                      _txt.show();
                      _txt.val(_pNote.text());
                      _i.hide();
                      _i2.show();
                    });
                    _i2.on("click", function(){
                      _br.hide();
                      _pNote.show();
                      _txt.hide();
                      _pNote.text(_txt.val());
                      _i2.hide();
                      _i.show();

                      //api update
                      let request = inviaRichiesta("POST", "/api/updateNote/", {"oId": data["data"][i]["_idUser"], "note": _txt.val()});
                      request.done(function(data){
                          console.log(data);
                      });
                    });
                    /*let _p2 = $("<p>");
                    let _i = $("<i>").addClass("fas fa-pen");
                    _i.appendTo(_p2);
                    _p2.appendTo(_p);*/
                });
              }
          }
      });
  }

  function carousel(_d, images){
    console.log("images length == " + images.length);

    car.show();
    for(let i = 0; i < images.length; i++)
    {
      let _li = $("<li>").prop({"data-target": "#carouselExampleIndicators", "data-slide-to": i.toString()}).appendTo(_ol);
      if(i == 0)
      {
        _li.prop("class", "active");
      }
    }

    
    let _div = $("<div>").prop("class", "carousel-item active").appendTo(_inner);
    let _img = $("<img>").prop({"class": "d-block w-100", "src": images[0], "alt": "1^ slide"}).appendTo(_div);
    if(images.length > 1)//width: auto;
    {
      for(let i = 1; i < images.length; i++)
      {
        let _div2 = $("<div>").prop("class", "carousel-item").appendTo(_inner);
        let _img2 = $("<img>").prop({"class": "d-block w-100", "src": images[i], "alt": i + 1 + "^ slide"}).appendTo(_div2);
      }
    }

  }