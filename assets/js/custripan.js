//var directionsService = new google.maps.DirectionsService();

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
var markersArray = [];
var limits = new google.maps.LatLngBounds();
var iconMarker;

$(document).ready(function() {
   localizame(); 
   selectSucursales();
   $('#btn-search').click(function(e){
        getIcons($('#select-allsucursales').val());
    });
});

var taxiLocationDemonId;
var busMarker;
   
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


function selectSucursales(){
       $.ajax({
            type : "GET",
            url : lang + '../../../api/select_sucursales',        
            dataType : "json",
            data : {
                    cachehora : (new Date()).getTime()
            }
        }).done(function(response){
            var html = '';
            if(response.state == 'ok'){
                html = '<select name="select-allsucursales" id="select-allsucursales" onchange="getIcons($(this).val());" >';
                html =  html + '<option value="-1">...</option>';
                for(var i in response.result){
                    html = html + '<option value="' + response.result[i].id + '" >' + response.result[i].nombre + '</option>';
                }
                html = html + '</select>';
            }
            $('#select-sucursales').html(html);
         }).fail(function(jqXHR, textStatus, errorThrown){
         console.log('Error:'+errorThrown);
      }); 
}

function clearOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
  }
}

// Shows any overlays currently in the array
function showOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(map);
    }
  }
}

function deleteOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }
}


var flag='';
function getBusLocation(idsucursal){
    
    $.ajax({
        type : "GET",
        url : lang + '../../../api/get_agets_location',        
        dataType : "json",
        data : {
            cachehora : (new Date()).getTime(),
            idsucursal : idsucursal
        }
    }).done(function(response){

        if(response.state == 'ok'){
            var coordenadas;
            var estadoagent;
            deleteOverlays();
            var bounds = new google.maps.LatLngBounds();
            for(var i in response.agent){
                if(response.agent[i].fecha_localizacion>response.agent[i].datesytem)
                    estadoagent = 0
                else
                    estadoagent = 1
                coordenadas =  new google.maps.LatLng( response.agent[i].latitud, response.agent[i].longitud);
                setBusIcon(coordenadas, response.agent[i],estadoagent );
                bounds.extend(coordenadas);
            }

            if (flag!='1'){
                map.setCenter(bounds.getCenter());   
                map.fitBounds(bounds);
            }
            flag='1';

        }
     }).fail(function(jqXHR, textStatus, errorThrown){
         console.log('Error:'+errorThrown);
      }); 
   
}

function getOfficeLocation(idsucursal){
    $.ajax({
        type : "GET",
        url : lang + '../../../api/get_office_location',        
        dataType : "json",
        data : {
            cachehora : (new Date()).getTime(),
            idsucursal  : idsucursal
        }
        
    }).done(function(response){
        var coordenadas;
        if(response.state == 'ok'){
            coordenadas =  new google.maps.LatLng( response.result.latitud, response.result.longitud);
            setOfficeIcons(coordenadas);
        }
    });
  
}

function setOfficeIcons(coordenadas){
    if(iconMarker)
        iconMarker.setMap(null);
    iconMarker = new google.maps.Marker({
            position:coordenadas,
            map: map,
            icon : '/assets/images/colegio.png'
    });
   
    iconMarker.setMap(map);
}


function setBusIcon(coordenadas, agent, estadoagent){
    var popup;
    var icon_taxi
   
    if(estadoagent==1)
        icon_taxi = '/assets/images/bus2.png';
    else
        icon_taxi =  '/assets/images/bus.png';

    busMarker = new google.maps.Marker({
        position:coordenadas,
        map: map,
        icon : icon_taxi
    });
    markersArray.push(busMarker);
            
    google.maps.event.addListener(busMarker, 'click', function(){
            if(!popup){
                popup = new google.maps.InfoWindow();
            }
            var note = 'Placa : ' + agent.placa + '<br> Conductor : ' + agent.nombre + 
                        '<br> Telefono : ' + agent.telefono + '<br> Estado : ' + agent.estado_servicio +
                        '<br> Ultima Act. : ' + agent.fecha_localizacion;
            popup.setContent(note);
            popup.open(map, this);
        });    
      
}



function localizame() {
    if (navigator.geolocation) { /* Si el navegador tiene geolocalizacion */
        navigator.geolocation.getCurrentPosition(coordenadas, errores);
		//navigator.geolocation.getCurrentPosition(coordenadas, errores, {'enableHighAccuracy':true,'timeout':20000,'maximumAge':0});
    }else{
        alert('No hay soporte para la geolocalización.');
    }
}

function coordenadas(position) {
    latitud = position.coords.latitude; /*Guardamos nuestra latitud*/
    longitud = position.coords.longitude; /*Guardamos nuestra longitud*/
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
	  address_search();
    }
    if (err.code == 3) {
      alert("Hemos superado el tiempo de espera. Vuelve a intentarlo.");
    }
}
 

function address_search() {
 var address = 'quito';
 geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
                
        latitud=results[0].geometry.location.lat();
        longitud=results[0].geometry.location.lng();
       
               
        cargarMapa();

    } else {
        alert('No hay soporte para la geolocalización.');
    }
 });
}

function getIcons(idsucursal){
    flag='';
    clearInterval(taxiLocationDemonId);
    taxiLocationDemonId = setInterval(function() { getBusLocation(idsucursal); }, verification_interval);
    getBusLocation(idsucursal);
    getOfficeLocation(idsucursal)

}


function cargarMapa() {
    var latlon = new google.maps.LatLng(latitud,longitud); /* Creamos un punto con nuestras coordenadas */
    var myOptions = {
        zoom: 12,
        center: latlon, /* Definimos la posicion del mapa con el punto */
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}, 
        mapTypeControl: true, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles : styles

    };/* HYBRID  Configuramos una serie de opciones como el zoom del mapa y el tipo.*/

    map = new google.maps.Map($("#map_canvas").get(0), myOptions); /*Creamos el mapa y lo situamos en su capa */

}

