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
var geocoder = new google.maps.Geocoder();

$(document).ready(function() {
   
	//$('#waiting-msg, #agent-wrapper').hide();
	
	localizame(); /*Cuando cargue la página, cargamos nuestra posición*/ 
    
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
    	
    	if(!queryId)
    		return false;

    	$.mobile.loading("hide");
    	clearInterval(demonId);

        $.ajax({
            type : "GET",
            url : lang + '/api/request_cancel',           
            dataType : "json",
            data : {
            	queryId : queryId
            }
        }).done(function(response){
        	reset_modal();
        });
    });
    
    $('#call-confirmation').click(function(e){
    	
    	$.mobile.loading("show");
    	$('#call-confirmation, #confirmation-msg').hide();
    	$('#waiting-msg').show();

        $.ajax({
            type : "POST",
            url : $('#call-form').attr('action'),        
            dataType : "json",
            data : {
                hms1 : $('input[name="hms1"]').val(),
                address : $('input[name="address"]').val(),
                lat : $('input[name="lat"]').val(),
                lng : $('input[name="lng"]').val()
            }
        }).done(function(response){
            if(response.state == 'ok'){
            	queryId = response.queryId;
            	demonId = setInterval(verifyCall, verification_interval);
            }
        });
        
    	
    });
    
    $('#btn-localizame').click(function(e){
    	e.preventDefault();
    	localizame();
    });
});


var demonId;
var queryId;

function reset_modal(){
	$('#confirm-wrapper').show();
	$('#waiting-msg').hide();
	$('#call-confirmation').show();
	$('#confirmation-msg').show();
	$('#agent-wrapper').hide();

}

function verifyCall(){
    $.ajax({
        type : "GET",
        url : lang + '/api/verify_call',        
        dataType : "json",
        data : {
        	queryId : queryId,
        	demonId : demonId
        }
    }).done(function(response){
        if(response.state == 'error'){
        	$.mobile.loading("hide");
        	clearInterval(demonId);
        	$('#waiting-msg').html(response.msg);
        }
        
        if(response.state == '1'){
        	$('#agent-photo').html('<img src="' + response.agent.foto + '"/>');
        	$('#agent-name').html(response.agent.nombre);
        	$('#agent-id').html(response.agent.codigo);
        	$('#agent-phone').html(response.agent.telefono);
        	
        	$('#confirm-wrapper').hide();
        	$('#agent-wrapper').show();
        	
        	$.mobile.loading("hide");
        	clearInterval(demonId);
        }
    });
}

function localizame() {
    if (navigator.geolocation) { /* Si el navegador tiene geolocalizacion */
        navigator.geolocation.getCurrentPosition(coordenadas, errores);
    }else{
        alert('No hay soporte para geolocalización.');
    }
}

function coordenadas(position) {
    latitud = position.coords.latitude; /*Guardamos nuestra latitud*/
    longitud = position.coords.longitude; /*Guardamos nuestra longitud*/
	//document.getElementById("direccion").value = "Estoy en : ( latitud: "+latitud+", longitud: "+longitud+" ) ";
	
	codeLatLng(latitud, longitud);

	$('#lat').val(latitud);
	$('#lng').val(longitud);
	
	cargarMapa();
}

function errores(err) {
    /*Controlamos los posibles errores */
    if (err.code == 0) {
      alert("Oops! Algo ha salido mal");
    }
    if (err.code == 1) {
      alert("Oops! No has aceptado compartir tu posición");
    }
    if (err.code == 2) {
      alert("Oops! No se puede obtener la posición actual");
    }
    if (err.code == 3) {
      alert("Oops! Hemos superado el tiempo de espera");
    }
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
    var marcador = new google.maps.Marker({
        position: coorMarcador, /*Lo situamos en nuestro punto */
        map: map, /* Lo vinculamos a nuestro mapa */
		animation: google.maps.Animation.DROP, 
		draggable: true
    });


	google.maps.event.addListener(marcador, "dragend", function(evento) {
		//Obtengo las coordenadas separadas
		var latitud = evento.latLng.lat();
		var longitud = evento.latLng.lng();
			
		//Puedo unirlas en una unica variable si asi lo prefiero
		var coordenadas = evento.latLng.lat() + ", " + evento.latLng.lng();
			
		//Las muestro con un popup
		//alert(coordenadas);

		codeLatLng(evento.latLng.lat(), evento.latLng.lng());
		
		$('#lat').val(evento.latLng.lat());
		$('#lng').val(evento.latLng.lng());

	}); //Fin del evento


}

var sector = null;
var ciudad = null;
var pais = null;
var depto = null; 

function codeLatLng(lat, lng) {

	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				//formatted address
				var tam = results[0].address_components.length;
				
				sector = results[0].address_components[2] ;
				ciudad = (tam == 5) ? results[0].address_components[2] : results[0].address_components[3] ;
				pais = (tam == 5) ? results[0].address_components[3] : results[0].address_components[4] ;
				depto = (tam == 5) ? results[0].address_components[4] : results[0].address_components[2] ;
								
				//var addrPart = results[0].address_components[0].long_name.split('-');				
				//$('#address').val(results[0].address_components[1].long_name + ' # ' +addrPart[0]+'-');
				
				$('#address').val(sector.long_name + ', ' + results[0].address_components[1].long_name + ' # ' +results[0].address_components[0].long_name);
			} else {
				$('#address').val('No encontró una dirección asociada a las coordenadas.');
			}
		} else {
			$('#address').val("Fallo en las Appis de Google : "+ status);
		}
	});
}