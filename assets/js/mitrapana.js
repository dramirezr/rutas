var http = location.protocol;
var slashes = http.concat("//");
var server = slashes.concat(window.location.hostname) + '/es/';


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
var agentMarker;
var iconMarker;
var LocationDemonId=null;
var scode = null;
var iduser = null;
var idruta = null;
var busLocationDemonId;
var verification_interval = null;


$(document).ready(function() {
    
    //localizame(); 

    $('#do-login').click(function(e){
        e.preventDefault();
        username = $('#username').val();
        password = $('#password').val();
        login(username, password);
    });

    $('#btn-real-time').click(function(e){
        e.preventDefault();
        getIconLocation();
    });

    $('#btn-close').click(function(e){
        e.preventDefault();
        clearInterval(busLocationDemonId);
        password = '';
        $("#show-login").trigger('click');
    });
  
});

$(document).on('pagebeforeshow', '#dashboard', function(){ 
    $('#map_canvas').css('width', '100%');
    $('#map_canvas').css('height', '300px');
 });


function login(id, key){
    $.ajax({
        type : "GET",
        url : server + 'ulogin/do_login',        
        dataType : "json",
        data : {
            username : id,
            password : key,
            hms1: scode
        }
    }).done(function(response){
        
        if(response.state=='ok'){
            $("#show-dashboard").trigger('click');
            var user = response.data
            iduser = user.id;
            $('#user-photo').attr('src', "../assets/images/students/" + user.foto1) ;
            //$('#user-sucursal').html(user.sucursal);
            $('#user-nombre').html(user.nombre);
            $('#user-estado').html('Estado: '+user.estado);
            $('#user-fecha').html('Fecha:   '+user.fecha);
            $("#user-sucursal, #user-nombre, #user-estado,#user-fecha").css("fontSize", 11);
            
            selectHistory();
            localizame();

    
        }else{
            alert(response.msg);
        }
    });     
}


function selectHistory(){
       $.ajax({
            type : "GET",
            url : server + 'users/select_history',        
            dataType : "json",
            data : {
                    iduser    : iduser,
                    cachehora : (new Date()).getTime()
            }
        }).done(function(response){
    
            var html = '';
            if(response.state == 'ok'){
                
                html = '<select style="height: 60px;" name="select-allhistory" id="select-allhistory" onchange="getBusLocationHistoy()" >';
                
                html = html + '<option value="-1">Historial</option>';
                var fecha = ''; var fectem= '1'; var flag='0';
                var descripcion;
                for(var i in response.result){
                    fecha = response.result[i].fecha.substring(0,10);
                    if (flag=='1')
                        html = html + '</optgroup>' ;
                    if (fecha!=fectem){
                        html = html + '<optgroup label="'+fecha+'">';
                        fectem   =   fecha;
                        flag='0'; 

                    }else{
                       flag     =   '1';  
                    }
                    descripcion = response.result[i].descripcion; 
                    html = html + '<option value=' + response.result[i].id + '>' + descripcion.trim() + '</option>';
                    
                }
                html = html + '</select>';
            }

            $('#select-history').html(html);
            $('#select-history').trigger( "create" );
        });
}


function getIconLocation(){
    var elemento = iduser;
    $.ajax({
        type : "GET",
        url : server + 'users/get_stop_location',        
        dataType : "json",
        data : {
            cachehora : (new Date()).getTime(),
            idalumno  : elemento
        }
        
        
    }).done(function(response){

        if(response.state == 'ok'){
            var coordenadas;
            deleteOverlays();
            for(var i in response.result){
                coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                setIcons(coordenadas, response.result[i]);
                //bounds.extend(coordenadas);
                if(response.result[i].codparada==response.result[i].idparada){
                    idruta = response.result[i].idruta;
                    map.setCenter(coordenadas);
                }
            }

            if (idruta > 0){
                getBusLocation(idruta);
                clearInterval(busLocationDemonId);
                busLocationDemonId = setInterval("getBusLocation("+idruta+")", verification_interval);
            }

        }
    });
  
}

function setIcons(coordenadas, result){
    var popup;
    var icon_casa
    if(result.codparada==result.idparada)
        icon_casa =  '../assets/images/casa.png';
    else
        icon_casa =  '../assets/images/casa2.png';
    
    iconMarker = new google.maps.Marker({
        position:coordenadas,
        map: map,
        animation: google.maps.Animation.DROP, 
        //draggable: true,
        icon : icon_casa,
        title : result.nombre+' - '+result.direccion +' - '+result.telefono+' - '+result.descripcion
    });
    markersArray.push(iconMarker);
               

    google.maps.event.addListener(iconMarker, 'click', function(evento){
            $('#idparada').val(result.idparada);
            $('#idalumno').val(result.idalumno);
            $('#latitud').val(evento.latLng.lat());
            $('#longitud').val(evento.latLng.lng());

            $('#nombre').val(result.nombre);
            
            $('#telefono').val(result.telefono);
            
            $('#direccion').val(result.direccion);
            $('#select-allrutas').val(result.idruta);
            $('#descripcion').val(result.descripcion);
            
            $.mobile.changePage('#det-parada-modal', { transition: "pop", role: "dialog", reverse: false } );
    });    

}


function getBusLocationHistoy(){
    clearInterval(busLocationDemonId);
    deleteOverlaysBus();
    var id = $('#select-allhistory').val();  
    if (id > 0){
        $.ajax({
            type : "GET",
            url : server + 'users/get_location_history',        
            dataType : "json",
            data : {
                cachehora : (new Date()).getTime(),
                id  : id
            }
            
        }).done(function(response){

            if(response.state == 'ok'){
                deleteOverlaysBus();
                var coordenadas;
                var icon_bus;
                icon_bus =  '../assets/images/bus2.png';
                coordenadas =  new google.maps.LatLng( response.result.latitud, response.result.longitud);
                agentMarker = new google.maps.Marker({
                    position:coordenadas,
                    map: map,
                    animation: google.maps.Animation.DROP, 
                    icon : icon_bus,
                    title : response.result.descripcion+' '+response.result.fecha 
                });

                map.setCenter(coordenadas);
            }
        });
    }
}


function getBusLocation(ruta){
    $.ajax({
        type : "GET",
        url : server + 'api/select_vehicle',        
        dataType : "json",
        data : {
            cachehora : (new Date()).getTime(),
            idruta  : ruta
        }
        
    }).done(function(response){

        if(response.state == 'ok'){
            var coordenadas;
            for(var i in response.result){
                coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                setIconsBus(coordenadas, response.result[i]);
            }

        }
    });
}


function setIconsBus(coordenadas, result){
    console.log('...setIconsBus');
    deleteOverlaysBus() ;
    var icon_bus;
    if(result.fecha_localizacion>result.datesytem)
        icon_bus =  '../assets/images/bus.png';
    else
        icon_bus =  '../assets/images/bus2.png';

    agentMarker = new google.maps.Marker({
        position:coordenadas,
        map: map,
        //animation: google.maps.Animation.DROP, 
        //draggable: true,
        icon : icon_bus,
        title : 'Placa: '+result.placa+' - Ult. Fecha act.: ' +result.fecha_localizacion 
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
    }
    if (err.code == 3) {
      alert("Hemos superado el tiempo de espera. Vuelve a intentarlo.");
    }
}
 


function cargarMapa() {
    var latlon = new google.maps.LatLng(latitud,longitud); /* Creamos un punto con nuestras coordenadas */
    var myOptions = {
        zoom: 13,
        center: latlon, /* Definimos la posicion del mapa con el punto */
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}, 
        mapTypeControl: true, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles : styles

    };/* HYBRID  Configuramos una serie de opciones como el zoom del mapa y el tipo.*/

    map = new google.maps.Map($("#map_canvas").get(0), myOptions); /*Creamos el mapa y lo situamos en su capa */
    
    getIconLocation();
    
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

function deleteOverlaysBus() {
    if(agentMarker){
        agentMarker.setMap(null);
        agentMarker = null;
    }
}


