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
var idsucursaluser = null;
var idruta = null;
var busLocationDemonId;
var verification_interval = null;
var MAX_ID_HIST = 0;

$(document).ready(function() {
    
    $("#audio-wrap").hide();

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

function play_sound(element) {
    document.getElementById(element).play();
}

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
            iduser          = user.id;
            idsucursaluser  = user.idsucursal;
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
                    descripcion = response.result[i].descripcion.substring(0,23); 
                    html = html + '<option value=' + response.result[i].id + '>' + descripcion.trim() + '</option>';
                    
                }
                html = html + '</select>';
            }
            
            MAX_ID_HIST = response.result[0].id;
            $('#select-history').html(html);
            $('#select-history').trigger( "create" );
        });
}

function getOfficeLocation(idsucursal){
    $.ajax({
        type : "GET",
        url : server + 'api/get_office_location',     
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

var iconOffice;
function setOfficeIcons(coordenadas){
    if(iconOffice)
        iconOffice.setMap(null);
    iconOffice = new google.maps.Marker({
            position:coordenadas,
            map: map,
            icon : '../assets/images/colegio.png'
    });
    iconOffice.setMap(map);
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

            getOfficeLocation(idsucursaluser);

        }
    });
  
}

function setIcons(coordenadas, result){
    var popup;
    var icon_casa
    
    if(result.codparada==result.idparada)
        icon_casa =  '../assets/images/casa_m.png';
    else
        if(result.codparada_tarde==result.idparada)
            icon_casa =  '../assets/images/casa_t.png';
        else
            icon_casa =  '../assets/images/casa2.png';

    if((result.codparada==result.idparada)&&(result.codparada_tarde==result.idparada))
        icon_casa =  '../assets/images/casa.png';

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

            $("input[name='chk-principal']").checkboxradio();
            if(result.codparada==result.idparada)
                $('input[name="chk-principal"]').prop("checked", true).checkboxradio('refresh');
            else
                $('input[name="chk-principal"]').prop("checked", false).checkboxradio('refresh');
           
            $("input[name='chk-parada_tarde']").checkboxradio();
            if(result.codparada_tarde==result.idparada)
                $('input[name="chk-parada_tarde"]').prop("checked", true).checkboxradio('refresh');
            else
                $('input[name="chk-parada_tarde"]').prop("checked", false).checkboxradio('refresh');
             
           
            
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
                console.log(response.result.latitud +','+ response.result.longitud);
                coordenadas =  new google.maps.LatLng( response.result.latitud, response.result.longitud);
                agentMarker = new google.maps.Marker({
                    position:coordenadas,
                    map: map,
                    animation: google.maps.Animation.DROP, 
                    icon : '../assets/images/bus2.png',
                    title : response.result.descripcion+' '+response.result.fecha 
                });

                var popup;
                google.maps.event.addListener(agentMarker, 'click', function(){
                    if(!popup)
                        popup = new google.maps.InfoWindow();
                    var note =  'Ruta : ' + response.result.ruta + '<br> Conductor : ' + response.result.agente + 
                            '<br> Estado : ' + response.result.descripcion + '<br> fecha : ' + response.result.fecha ;
                    popup.setContent(note);
                    popup.open(map, this);
                });    
    
                map.setCenter(coordenadas);
            }
        });
    }
}


function getStateUser(id){
    $.ajax({
        type : "GET",
        url : server + 'users/get_state_user',         
        dataType : "json",
        data : {
            iduser : id
        }
    }).done(function(response){
        if(response.state=='ok'){
            var user = response.result;
            $('#user-estado').html('Estado: '+user.estado);
            $('#user-fecha').html('Fecha:   '+user.fecha);
            play_sound('alert');

        }
    });     
}


function getBusLocation(ruta){
    $.ajax({
        type : "GET",
        url : server + 'users/get_location_vehicle',        
        dataType : "json",
        data : {
            cachehora : (new Date()).getTime(),
            idruta  : ruta,
            iduser  : iduser
        }
        
    }).done(function(response){
        if(response.state == 'ok'){
            var coordenadas;
            for(var i in response.result){
                coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                setIconsBus(coordenadas, response.result[i]);
            }

            if ((response.idmax!=MAX_ID_HIST)&&(response.idmax!=null)){
                selectHistory();
                getStateUser(iduser);
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

    var popup;
    google.maps.event.addListener(agentMarker, 'click', function(){
        if(!popup){
            popup = new google.maps.InfoWindow();
        }
        var note =  'Placa : ' + result.placa + 
                    '<br> Ult. Fecha act. : ' + result.fecha_localizacion;
                       
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


