var http = location.protocol;
var slashes = http.concat("//");

var server = slashes.concat(window.location.hostname) + '/es/';

//console.log(server);
var lat = lng = deslat = destlng = 0;
var scode = null;
var user = null;
var localizationDemonId;
var updateLocationDemonId;
var verification_interval = null;
var updatelocation_interval = null;
var verifyServiceDemonId;
var verifyServiceStateDemonId;
var WaitVeryServiceDemonid;
var geoOptions = { timeout: verification_interval };
var ubicacionServicio = null;
var request_id = null;
var username = null;
var password = null;
var switchBgDemon = null;
var lat_user = null;
var lng_user = null;
var placa = null;
var fecha_sos = null;

var styles = [
                  {
                        "featureType": "poi",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "transit",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "landscape.man_made",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      }
                    ];
    
var map;
//var latitud;
//var longitud;
//var geocoder = new google.maps.Geocoder();


$(document).ready(function() {
    
    $.mobile.loading( "show" );
    
    
    init();
	
    $('#do-login').click(function(e){
		e.preventDefault();
        username = $('#username').val();
        password = $('#password').val();
        login(username, password);
    });
    
    $('#btn-cancelar').click(function(e){
		e.preventDefault();
   		//play_sound('alerta'); 
 		cancel_service();
    });
    
    $('#btn-entregado').click(function(e){
		e.preventDefault();
		//play_sound('alerta'); 
        service_delivered();
    });
    
    $('#btn-llego').click(function(e){
		e.preventDefault();
 		play_sound('pito'); 
 		arrival_confirmation();
    });
    

});


$( document ).bind( "pageshow", function( event, data ){
google.maps.event.trigger(map_canvas, 'resize');
});

$(document).on('pagebeforeshow', '#maps-modal', function(){ 
    $('#map_canvas').css('width', '100%');
    $('#map_canvas').css('height', '500px');
    //console.log('cargando mapa');
    cargarMapa();

 });



function login(id, key){
    clearInterval(localizationDemonId);
	clearInterval(verifyServiceDemonId);
    
    $.ajax({
        type : "GET",
        url : server + 'api/login',        
        dataType : "json",
        data : {
            username : id,
            password : key,
            hms1: scode
        }
    }).done(function(response){
        
        if(response.state=='ok'){
            $("#show-dashboard").trigger('click');
            user = response.data
            $('#agent-name').html(user.nombre);
            $('#agent-photo').attr('src', "../assets/images/agents/" + user.foto) ;
            // ojoooo no se puede sacar clearInterval de este lado por que no se reinicia el logueo
            clearInterval(updateLocationDemonId);    
            localizame();
			updateLocation();
			localizationDemonId = setInterval(localizame, verification_interval);
            updateLocationDemonId = setInterval(updateLocation, verification_interval);
            
        }else{
            alert(response.msg);
        }
    });     
}


function updateLocation(){
	
	$('#current-position').parent().css('background-color', 'yellow');
	
    $.ajax({
        type : "GET",
        url : server + 'agent/update_location',        
        dataType : "json",
        timeout : 5000,
        data : {
            lat : lat,
            lng : lng
        },
        
    }).done(function(response){
    		$('#position-state').attr('src','assets/images/green_dot.png');
    		$('#current-position').parent().css('background-color', '#FFFFFF');
    		
            if(response.state != 'ok'){
                $('#current-position').val('-------------------------');
            }else{
            	$('#current-position').val('Latitud: ' + lat + ' Longitud: ' + lng);
            }
            
     }).fail(function(jqXHR, textStatus, errorThrown){
    	 $('#current-position').val('======= Error de conexión =======');
         login(username, password);
      }); 
     //verificar mensaje de ayuda de otros agentes.
     //get_sos();
}





function localizame() {
    if (navigator.geolocation) { 
		
        navigator.geolocation.getCurrentPosition(coords, errores,{'enableHighAccuracy':true,'timeout':20000,'maximumAge':0});
    }else{
        $('#current-position').val('No hay soporte para la geolocalización.');
    }
}

function coords(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    //lat = -0.18489528831919608;
    //lng = -78.48174479416502;
    
}

function cargarMapa() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var latlon = new google.maps.LatLng(lat,lng); /* Creamos un punto con nuestras coordenadas */
    var myOptions = {
        zoom: 15,
        center: latlon, /* Definimos la posicion del mapa con el punto */
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}, 
        mapTypeControl: true, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles : styles

    };/* HYBRID  Configuramos una serie de opciones como el zoom del mapa y el tipo.*/
    map = new google.maps.Map($("#map_canvas").get(0), myOptions); /*Creamos el mapa y lo situamos en su capa */
    
    /*Creamos un marcador AGENTE*/   
   // position: new google.maps.LatLng( lat, lng ),
    agentMarker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            icon : 'assets/images/bus.png'
    });
    /*Creamos un marcador USUARIO*/   
    userMarker = new google.maps.Marker({
            position: new google.maps.LatLng(-0.18489528831919608, -78.48174479416502 ),
            map: map,
            icon : 'assets/images/user.png'
    });

var popup;
    google.maps.event.addListener(userMarker, 'click', function(){
            if(!popup){
                popup = new google.maps.InfoWindow();
            }
            var note = '<div style="color: black;width:100%;height:100%;"> Alumno : Juan Diego Ramirez Garcia <br>Dierección : Av.10 de Agosto 8142'  
                        '<br> Telefono : Teléfono: (593) (2) 2418118<br> Padres : Diego Ramirez, Sandra Paola</div>';
            popup.setContent(note);
            popup.open(map, this);
        });  

    userMarker = new google.maps.Marker({
            position: new google.maps.LatLng( -0.18678355353293868, -78.49376109055174 ),
            map: map,
            icon : 'assets/images/user.png'
    });


    google.maps.event.addListener(userMarker, 'click', function(){
            if(!popup){
                popup = new google.maps.InfoWindow();
            }
            var note = ' <div style="color: black;width:100%;height:100%;"> Alumno : Juan Diego Ramirez Garcia <br>Dierección : Av.10 de Agosto 8142'  
                        '<br> Telefono : Teléfono: (593) (2) 2418118<br> Padres : Diego Ramirez, Sandra Paola</div>';
            popup.setContent(note);
            popup.open(map, this);
        });  
    userMarker = new google.maps.Marker({
            position: new google.maps.LatLng( -0.17365152318574792, -78.4752216618408 ),
            map: map,
            icon : 'assets/images/user.png'
    });

    google.maps.event.addListener(userMarker, 'click', function(){
            if(!popup){
                popup = new google.maps.InfoWindow();
            }
            var note = '<div style="color: black;width:100%;height:100%;"> Alumno : Juan Diego Ramirez Garcia <br>Dierección : Av.10 de Agosto 8142'  
                        '<br> Telefono : Teléfono: (593) (2) 2418118<br> Padres : Diego Ramirez, Sandra Paola</div>';
            popup.setContent(note);
            popup.open(map, this);
        });  
    userMarker = new google.maps.Marker({
            position: new google.maps.LatLng( -0.18729853491974824, -78.48097231796874 ),
            map: map,
            icon : 'assets/images/user.png'
    });

    google.maps.event.addListener(userMarker, 'click', function(){
            if(!popup){
                popup = new google.maps.InfoWindow();
            }
            var note = '<div style="color: black;width:100%;height:100%;"> Alumno : Juan Diego Ramirez Garcia <br>Dierección : Av.10 de Agosto 8142'  
                        '<br> Telefono : Teléfono: (593) (2) 2418118<br> Padres : Diego Ramirez, Sandra Paola</div>';
            popup.setContent(note);
            popup.open(map, this);
        });  
    userMarker = new google.maps.Marker({
            position: new google.maps.LatLng( -0.1785438493201228, -78.48483469895018 ),
            map: map,
            icon : 'assets/images/user.png'
    });


    google.maps.event.addListener(userMarker, 'click', function(){
            if(!popup){
                popup = new google.maps.InfoWindow();
            }
            var note = '<div style="color: black;width:100%;height:100%;"> Alumno : Juan Diego Ramirez Garcia <br>Dierección : Av.10 de Agosto 8142'  
                        '<br> Telefono : Teléfono: (593) (2) 2418118<br> Padres : Diego Ramirez, Sandra Paola</div>';
            popup.setContent(note);
            popup.open(map, this);
        });    
    
    var rendererOptions = {
      map: map,
      suppressMarkers : true
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    var request = {
      origin:  new google.maps.LatLng( lat, lng ),
      destination:new google.maps.LatLng( lat_user, lng_user),
      
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
    
}



function errores(err) {
    /*Controlamos los posibles errores */
    if (err.code == 0) {
        $('#current-position').val("Error en la geolocalización.");
    }
    if (err.code == 1) {
        $('#current-position').val("Para utilizar esta aplicación por favor aceptar compartir tu posición gegrafica.");
    }
    if (err.code == 2) {
        $('#current-position').val("No se puede obtener la posición actual desde tu dispositivo.");
    }
    if (err.code == 3) {
        $('#current-position').val("Hemos superado el tiempo de espera. Vuelve a intentarlo.");
    }
}


var sector = null;
var formatted_addr = null;
var geocoder = new google.maps.Geocoder();


function init(){
    $.ajax({
        type : "GET",
        url : server + 'api/agent_init',        
        dataType : "json",
        data : {}
    }).done(function(response){
        $.mobile.loading( "hide" );
        if(response.state == 'ok'){
            scode = response.code;
            verification_interval = response.verification_interval;
            updatelocation_interval = response.updatelocation_interval;

        }else{
            $('#popupBasic').html('No hay conexión al servidor, intente de nuevo mas tarde.');
            $('#popupBasic').popup();
        }
    }); 
    
}