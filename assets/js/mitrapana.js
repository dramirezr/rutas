var directionsService = new google.maps.DirectionsService();

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
var latitud;
var longitud;
var latitudOriginal;
var longitudOriginal;
var geocoder = new google.maps.Geocoder();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

$(document).ready(function() {
    $('#waiting-msg, #agent-wrapper, #agent-call2-wrapper').hide();
    
    localizame(); /*Cuando cargue la pÃ¡gina, cargamos nuestra posiciÃ³n*/ 
    
    $('#address').change(function(e){
        
        $('#show-address').html($(this).val());
    
    });
    
    $('#calling-agent').click(function (e){
        e.preventDefault();
        
        //TODO: LLamar para android
    });
    
    $('#agent-confirmation').click(function(e){
        $.ajax({
            type : "GET",
            url : lang + '/api/agent_accept',           
            dataType : "json",
            data : {
                queryId : queryId
            }
        }).done(function(response){
            reset_modal();
        });
        
    });
    
    $('#call-cancelation, #query-cancelation').click(function (e){
        
        if(!queryId){
            reset_modal();
            return true;
        }
            
        $.mobile.loading("hide");
        clearInterval(demonId);
        clearInterval(verifyServiceStatus);
        
        reset_modal();
        
        if(taxiMarker){
            taxiMarker.setMap(null);
            taxiMarker = null;
        }
                
        $.ajax({
            type : "GET",
            url : lang + '/api/request_cancel',           
            dataType : "json",
            data : {
                queryId : queryId
            }
        }).done(function(response){});
    });
    
    function trim(myString)
    {
        return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
    }
    
    $('#call-confirmation').click(function(e){
       
        if ($('input[name="address"]').val()!=''){  
            
            if (trim($('input[name="address"]').val())!=trim(formatted_addr)) {  
       
                if ( ($('input[name="lat"]').val()!='') && ($('input[name="lat"]').val()!='0') ){   
               

                    $.mobile.loading("show");
                    $('#call-confirmation, #confirmation-msg').hide();
                    $('#waiting-msg').show();

                    $.ajax({
                        type : "GET",
                        url : $('#call-form').attr('action'),        
                        dataType : "json",
                        data : {
                            hms1 : $('input[name="hms1"]').val(),
                            address : $('input[name="address"]').val(),
                            lat : $('input[name="lat"]').val(),
                            lng : $('input[name="lng"]').val(),
                            zone : $('input[name="zone"]').val(),
                            city : $('input[name="city"]').val(),
                            country : $('input[name="country"]').val(),
                            state_c : $('input[name="state_c"]').val()
                        }
                    }).done(function(response){
                        if(response.queryId > 0){
                            queryId = response.queryId;
                            demonId = setInterval(verifyCall, verification_interval);
                        }else
                            alert('No se pudo hacer la solicitud, por favor intente de nuevo.');
                    });
                    
            }else{
                alert('Por favor configure su dispositivo para compartir su ubicación geográfica e intente de nuevo.');
            }
        }else{
            alert('Por favor asegurate de completar tu dirección correctamente, puedes adicionar datos de ubicación como apartamento, oficina, urbanización, manzana, casa.'  );
            reset_modal();
            $("#call-modal").dialog('close');
        }
      }else{
        alert('La direccón no debe ser vacia. Por favor escriba su ubicación.');
      }
    });
    
    $('#btn-localizame').click(function(e){
        e.preventDefault();
        setUserIcon(latitudOriginal, longitudOriginal);
    });    
    
    $('#agent-call').click(function(e){
        clearInterval(taxiLocationDemonId);
    });
    
    $('#show-taxi').click(function(e){
        if(directionsDisplay != null) { 
            directionsDisplay.setMap(null);
            directionsDisplay = null; 
        }
        $('#agent-call-wrapper').hide();
        $('#agent-call2-wrapper').show();
        
        getTaxiLocation();
        taxiLocationDemonId = setInterval(getTaxiLocation, verification_interval);
    });

    $('#btn-address-search').click(function(e){
        e.preventDefault();
        address_search();
    });

  
});



    
var demonId;
var queryId;
var verifyServiceStatus;
var taxiLocationDemonId;
var agentId;
var taxiMarker;
var userMarker;

function play_sound(element) {
        document.getElementById(element).play();
}
   
function validarEnter(e) {
    if (window.event) {
        keyval=e.keyCode
    } else 
        if (e.which) {
            keyval=e.which
        } 
    if (keyval=="13") {
        e.preventDefault();
        address_search();
    } 
}

function getTaxiLocation(){
       $.ajax({
            type : "GET",
            url : lang + '/api/get_taxi_location',        
            dataType : "json",
            data : {
                agent_id : agentId,
                queryId  : queryId,
                cachehora : (new Date()).getTime()
            }
        }).done(function(response){
            if(response.state == 'ok'){
                setTaxiIcon(response.lat, response.lng);
            }
        });
       
}

function setTaxiIcon(lat, lng){
    if(taxiMarker){
        taxiMarker.setPosition( new google.maps.LatLng( lat, lng ) );
    }else{
        taxiMarker = new google.maps.Marker({
            position: new google.maps.LatLng( lat, lng ),
            map: map,
            icon : 'http://taxi.facil.com.co/assets/images/bus.png'
        });
        
        tracerRoute(lat, lng, latitud, longitud);
    }
    

}

function tracerRoute(lat, lng, lat2, lng2){
    //para el calculo de la ruta
    var rendererOptions = {
          map: map,
          suppressMarkers : true
        }
    
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    directionsDisplay.setMap(map);
 
    var request = {
      origin:  new google.maps.LatLng(lat2, lng2),
      destination:new google.maps.LatLng(lat, lng),
      
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });

}


function setUserIcon(lat, lng){
    userMarker.setPosition( new google.maps.LatLng( lat, lng ) );
}

function reset_modal(){
    $('#confirm-wrapper').show();
    $('#waiting-msg').html(searching_msg);
    $('#waiting-msg').hide();
    $('#call-confirmation').show();
    
    $('#confirmation-msg').show();
    $('#agent-wrapper').hide();

    $('#agent-call2-wrapper').hide();
    $('#agent-call-wrapper').show();

}

function verifyCall(){
    $.ajax({
        type : "GET",
        url : lang + '/api/verify_call',        
        dataType : "json",
        data : {
            queryId : queryId,
            demonId : demonId,
            cachehora : (new Date()).getTime()
        }
    }).done(function(response){
        
        
        if(response.state == 'error'){
            $.mobile.loading("hide");
            clearInterval(demonId);
            $('#waiting-msg').html(response.msg);
        }
         
        if(response.state == '1'){
            
            $('#agent-photo').html('<img height="150" width="150" src="' + response.agent.foto + '"/>');
            $('#agent-name').html(response.agent.nombre);
            agentId = response.agent.id
            $('#agent-id').html(response.agent.codigo);
            $('#agent-phone').html(response.agent.telefono);
            $('#confirmation-code').html('<span style="color: red; font-weight:bold;">' + queryId + '</span>');
            $('#agent-placa').html(response.agent.placa);
            addr = response.agent.direccion;
            addr=addr.replace("#","Num.");
            coment = 'Viajo en el taxi con placa '+response.agent.placa+' saliendo de '+addr; 
            //tw = '<a href="http://twitter.com/share?url=http://www.pidataxi.com/&text='+coment+'&via=pidataxi&related=hptxt"  rel="nofollow" target="_parent" ><img src="assets/images/social/twitter.png"/  height="32" width="32" alt="Twitter" ></img></a>';
            //fc = '<a href="http://www.facebook.com/sharer.php?s=100&p[url]=http://www.pidataxi.com&p[title]=Servicio de taxi por dispositivo móvil PidaTaxi.com&p[summary]='+coment+'&&p[images][0]=http://www.pidataxi.com/icon.png" rel="nofollow" target="_parent" ><img src="assets/images/social/facebook.png"/  height="32" width="32" alt="Facebook" ></img></a>';
            url = 'http://twitter.com/share?url=http://www.pidataxi.com/&text='+coment+'&via=pidataxi&related=hptxt';
            tw = '<a href="'+url+'" rel="nofollow" target="_parent" data-rel="dialog" data-transition="slideup"><img src="assets/images/social/twitter.png" /></a>';
            url = 'http://www.facebook.com/sharer.php?s=100&p[url]=http://www.pidataxi.com&p[title]=Servicio de taxi por dispositivo móvil PidaTaxi.com&p[summary]='+coment+'&&p[images][0]=http://www.pidataxi.com/icon.png';
            fc = '<a href="'+url+'" target="_blank" data-rel="dialog" data-transition="slideup"><img src="assets/images/social/facebook.png" /></a>';
            $('#share-twitter').html(tw);
            $('#share-facebook').html(fc);

    
            //$('#share-info').html(tw+fc);
            $('#confirm-wrapper').hide();
            $('#agent-wrapper').show();
            
            $.mobile.loading("hide");
            
            play_sound('yes'); 

            clearInterval(demonId);
            verifyServiceStatus = setInterval(verifyServiceState, verification_interval);
        }
    });
}

function verifyServiceState(){
    $.ajax({
        type : "GET",
        url : lang + '/api/verify_service_status',        
        dataType : "json",
        data : {
            queryId : queryId,
            demonId : verifyServiceStatus,
            cachehora : (new Date()).getTime()
        }
    }).done(function(response){
        
        if(response.state == 'error'){
            clearInterval(verifyServiceStatus);
            alert(response.msg);
            reset_modal();
            $("#call-modal").dialog('close');
        }
        
        if(response.state == 'arrival'){
            //$.playSound('/assets/audio/ring.mp3');
            play_sound('pito'); 
			updateStatusArribo();
            alert(response.msg);
            
        }

        if(response.state == 'delivered'){
            clearInterval(verifyServiceStatus);
            clearInterval(taxiLocationDemonId);
            reset_modal();
            $("#call-modal").dialog('close');
            if(taxiMarker){
                taxiMarker.setMap(null);
                taxiMarker = null;
            }      
            if(directionsDisplay != null) { 
                directionsDisplay.setMap(null);
                directionsDisplay = null; 
            }         
        }

    }); 
}

function updateStatusArribo(){
    $.ajax({
        type : "GET",
        url : lang + '/api/updateStatusArribo',        
        dataType : "json",
        data : {
            queryId : queryId,
            demonId : verifyServiceStatus,
            cachehora : (new Date()).getTime()
        }
    }).done(function(response){
      
    }); 
}


function localizame() {
    if (navigator.geolocation) { /* Si el navegador tiene geolocalizacion */
        navigator.geolocation.getCurrentPosition(coordenadas, errores, {'enableHighAccuracy':true,'timeout':20000,'maximumAge':0});
    }else{
        alert('No hay soporte para la geolocalización.');
    }
}

function coordenadas(position) {
    latitud = position.coords.latitude; /*Guardamos nuestra latitud*/
    longitud = position.coords.longitude; /*Guardamos nuestra longitud*/
    latitudOriginal  = latitud;
    longitudOriginal = longitud;
    
    codeLatLng(latitud, longitud);

    $('#lat').val(latitud);
    $('#lng').val(longitud);
    
    cargarMapa();
}



function errores(err) {
    /*Controlamos los posibles errores */
    if (err.code == 0) {
      alert("Error en la geolocalización.");
    }
    if (err.code == 1) {
      alert("No has aceptado compartir tu posición.");
    }
    if (err.code == 2) {
      alert("No se puede obtener la posición actual.");
    }
    if (err.code == 3) {
      alert("Hemos superado el tiempo de espera. Vuelve a intentarlo.");
    }
}
 

function address_search() {
 var address = ''+document.getElementById("address").value;
 geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
                
        latitud=results[0].geometry.location.lat();
        longitud=results[0].geometry.location.lng();
        
        codeLatLng(latitud, longitud);
       
        $('#lat').val(latitud);
        $('#lng').val(longitud);
        
        cargarMapa();

    } else {
        alert('No hay soporte para la geolocalización.');
    }
 });
}

function cargarMapa() {
    var latlon = new google.maps.LatLng(latitud,longitud); /* Creamos un punto con nuestras coordenadas */
    var myOptions = {
        zoom: 16,
        center: latlon, /* Definimos la posicion del mapa con el punto */
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}, 
        mapTypeControl: true, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles : styles

    };/* HYBRID  Configuramos una serie de opciones como el zoom del mapa y el tipo.*/

    map = new google.maps.Map($("#map_canvas").get(0), myOptions); /*Creamos el mapa y lo situamos en su capa */

    
    var coorMarcador = new google.maps.LatLng(latitud,longitud); /*Un nuevo punto con nuestras coordenadas para el marcador (flecha) */

    /*Creamos un marcador*/             
    userMarker = new google.maps.Marker({
        position: coorMarcador, /*Lo situamos en nuestro punto */
        map: map, /* Lo vinculamos a nuestro mapa */
        animation: google.maps.Animation.DROP, 
        draggable: true,
        icon : 'http://taxi.facil.com.co/assets/images/male.png'
    });

   /*
   google.maps.event.addListener(map, "center_changed", function() {
        var posicion = map.getCenter();
        console.log(posicion.lng());
        userMarker.setPosition(posicion);
        codeLatLng(posicion.lat(), posicion.lng());
       
       // console.log(coorMarcador);
        $('#lat').val(posicion.lat());
        $('#lng').val(posicion.lng());
    });
    */
    google.maps.event.addListener(userMarker, "dragend", function(evento) {
       
        latitud = evento.latLng.lat();
        longitud = evento.latLng.lng();
            
       codeLatLng(evento.latLng.lat(), evento.latLng.lng());
       
       // console.log(coorMarcador);
        $('#lat').val(evento.latLng.lat());
        $('#lng').val(evento.latLng.lng());
    }); 

    /* 
    google.maps.event.addListener(taxiMarker, 'click', function() {
        console.log('entrooooo..');
    });
    */

}

var sector = null;
var ciudad = null;
var pais = null;
var depto = null; 
var formatted_addr = null;

function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                //formatted address
                var tam = results[0].address_components.length;
                //console.log(results[0]);
                sector = results[0].address_components[2] ;
                ciudad = (tam == 6) ? results[0].address_components[3] : results[0].address_components[2] ;
                depto = (tam == 6) ? results[0].address_components[4] : results[0].address_components[3] ;
                pais = (tam == 6) ? results[0].address_components[5] : results[0].address_components[4] ;
                
                //console.log(results[0]);  
                formatted_addr = sector.long_name + ', ' + results[0].formatted_address;
                var guion = formatted_addr.indexOf("-");
                if (guion>0) {
                    formatted_addr = formatted_addr.substring(0, guion) + ' - ';
                } else{
                    formatted_addr = sector.long_name + ', ' + results[0].address_components[1].long_name + ' # ' +results[0].address_components[0].long_name;
                }
                
                
                $('#address').val(formatted_addr);
                $('#show-address').html(formatted_addr);
                $('#zone').val(sector.long_name);
                $('#city').val(ciudad.long_name);
                $('#state_c').val(depto.long_name);
                $('#country').val(pais.long_name);
                
    
            } else {
                $('#address').val('No encontró una dirección asociada a las coordenadas.');
            }
            
        } else {
            //$('#address').val("Fallo en las Appis de Google : "+ status);
        }
    });
}