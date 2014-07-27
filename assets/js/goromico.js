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



function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}




$(document).ready(function() {
    if (form_view=='view_estudent_stop'){
        selectAlumnos();
    }
    if (form_view=='view_way_stop'){
        
        selectRutas_p();
    }
  
    selectRutas();
   
    localizame(); 

    
    $('#btn-search-alumno').click(function(e){
        getIconLocation();
    });

     $('#btn-search-ruta').click(function(e){
        getIconLocationWay();
    });


    $('#btn-save-stop').click(function(e){
        saveStop();
    });
  
    $('#btn-delete-stop').click(function(e){
        deleteStop();
    });
  
   $('#btn-open-dialog-delete').click(function(e){
       $.mobile.changePage('#dialog-delete-parada', { transition: "pop", role: "dialog", reverse: false } );
    });

    $('#btn-add-stop').click(function(e){
        if ($('#select-allalumnos').val()!="-1"){
            var coordenadas;
            
            coordenadas = map.getCenter();
            var result = {idparada:"-1", idalumno:$('#select-allalumnos').val(), nombre:getSelectedText('select-allalumnos'), telefono:"", direccion:"", idruta:"-1", descripcion:""}; 
            console.log('result:'+result);
            setIcons(coordenadas, result);    
        }
    });
    

   
});

function deleteStop(){
       $.ajax({
            type : "GET",
            url : lang + '../../../api/deleteStop',        
            dataType : "json",
            data : {
                cachehora   : (new Date()).getTime(),
                idparada    : $('input[name="idparada"]').val(),
                idalumno    : $('input[name="idalumno"]').val(),
            }
        }).done(function(response){
            if(response.state == 'ok'){
                //alert('El registro se guardo con exito.');
                //refrescar paradas.
                getIconLocation();
            }else{
                alert('ERROR al intentar grabar el punto de parada. Por favor intente de nuevo.');                
            }
        });
       
}

function saveStop(){
       
       $.ajax({
            type : "GET",
            url : lang + '../../../api/saveStop',        
            dataType : "json",
            data : {
                cachehora   : (new Date()).getTime(),
                idparada    : $('input[name="idparada"]').val(),
                idalumno    : $('input[name="idalumno"]').val(),
                latitud     : $('input[name="latitud"]').val(),
                longitud    : $('input[name="longitud"]').val(),
                direccion   : $('input[name="direccion"]').val(),
                telefono    : $('input[name="telefono"]').val(),
                ruta        : $('#select-allrutas').val(),
                orden_parada: $('input[name="orden_parada"]').val(),
                descripcion : $('input[name="descripcion"]').val(),
                principal   : $('input[name="chk-principal"]').prop("checked")
            }
        }).done(function(response){
            if(response.state == 'ok'){
                if (form_view=='view_estudent_stop')
                    getIconLocation();
                else
                    if (form_view=='view_way_stop')
                        getIconLocationWay();
            }else{
                alert('ERROR al intentar grabar el punto de parada. Por favor intente de nuevo.');                
            }
        });
       
}


var iconMarker;

function selectRutas(){
       $.ajax({
            type : "GET",
            url : lang + '../../../api/select_rutas',        
            dataType : "json",
            data : {
                    cachehora : (new Date()).getTime()
            }
        }).done(function(response){
    
            var html = '';
            if(response.state == 'ok'){
                
                html = '<select name="select-allrutas" id="select-allrutas">';

                html = html + '<option value="-1">...</option>';
                for(var i in response.rutas){
                    html = html + '<option value=' + response.rutas[i].id + '>' + response.rutas[i].nombre + '</option>';
                }
                html = html + '</select>';
            }

            $('#select-rutas').html(html);

        });
       
}


function selectRutas_p(){
       $.ajax({
            type : "GET",
            url : lang + '../../../api/select_rutas',        
            dataType : "json",
            data : {
                    cachehora : (new Date()).getTime()
            }
        }).done(function(response){
    
            var html = '';
            if(response.state == 'ok'){
                
                html = '<select name="select-allrutas-p" id="select-allrutas-p" onchange="getIconLocationWay()">';
                
                html = html + '<option value="-1">...</option>';
                for(var i in response.rutas){
                    html = html + '<option value=' + response.rutas[i].id + '>' + response.rutas[i].nombre + '</option>';
                }
                html = html + '</select>';
            }

            $('#select-rutas-p').html(html);

        });
       
}

   
function selectAlumnos(){
       $.ajax({
            type : "GET",
            url : lang + '../../../api/select_alumnos',        
            dataType : "json",
            data : {
                    cachehora : (new Date()).getTime()
            }
        }).done(function(response){
    
            var html = '';
            if(response.state == 'ok'){
               html = '<select name="select-allalumnos" id="select-allalumnos" onchange="getIconLocation()" >';
               html = html + '<option value="-1">...</option>';
                for(var i in response.alumnos){
                    html = html + '<option value="' + response.alumnos[i].id + '" >' + response.alumnos[i].nombre + '</option>';
                }
                html = html + '</select>';
            }

            $('#select-alumnos').html(html);

        });
       
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

function getIconLocation(){
    var elemento = $('#select-allalumnos').val();  
    $.ajax({
        type : "GET",
        url : lang + '../../../api/get_stop_location',        
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
                // limits.extend(coordenadas);
            }
            
        }
    });
  
}


function getIconLocationWay(){
  var elemento = $('#select-allrutas-p').val();  
    $.ajax({
        type : "GET",
        url : lang + '../../../api/get_stop_location_way',        
        dataType : "json",
        data : {
            cachehora : (new Date()).getTime(),
            idruta  : elemento
        }
        
        
    }).done(function(response){

        if(response.state == 'ok'){
            var coordenadas;
            deleteOverlays();
           for(var i in response.result){
                coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                setIcons(coordenadas, response.result[i]);
                // limits.extend(coordenadas);
            }
            
        }
    });
  
}


function setIcons(coordenadas, result){
    //if (result.idalumno!="-1"){
        var popup;
        var icon_casa
        
        if(result.codparada==result.idparada)
            icon_casa =  '/assets/images/casa.png';
        else
            icon_casa =  '/assets/images/casa2.png';
        iconMarker = new google.maps.Marker({
            position:coordenadas,
            map: map,
            animation: google.maps.Animation.DROP, 
            draggable: true,
            icon : icon_casa,
            title : result.idalumno+':'+result.idparada+':'+result.direccion
        });
        markersArray.push(iconMarker);
                

       google.maps.event.addListener(iconMarker, 'click', function(evento){
            $('#idparada').val(result.idparada);
            $('#idalumno').val(result.idalumno);
            //$('#latitud').val(result.latitud);
            //$('#longitud').val(result.longitud);
            $('#latitud').val(evento.latLng.lat());
            $('#longitud').val(evento.latLng.lng());

            $('#nombre').val(result.nombre);
            
            $('#telefono').val(result.telefono);
            
            $('#direccion').val(result.direccion);
            $('#select-allrutas').val(result.idruta);
            $('#descripcion').val(result.descripcion);
            $('#orden_parada').val(result.orden_parada);
            
            $("input[name='chk-principal']").checkboxradio();
            if(result.codparada==result.idparada)
                 $('input[name="chk-principal"]').prop("checked", true).checkboxradio('refresh');
            else
                 $('input[name="chk-principal"]').prop("checked", false).checkboxradio('refresh');
             
           
            codeLatLng(evento.latLng.lat(), evento.latLng.lng());
            
            $.mobile.changePage('#det-parada-modal', { transition: "pop", role: "dialog", reverse: false } );
        });    

       google.maps.event.addListener(iconMarker, "dragend", function(evento) {
            $('#latitud').val(evento.latLng.lat());
            $('#longitud').val(evento.latLng.lng());
            
            codeLatLng(evento.latLng.lat(), evento.latLng.lng());
           
        });
    //}
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

function cargarMapa() {
    var latlon = new google.maps.LatLng(latitud,longitud); /* Creamos un punto con nuestras coordenadas */
    var myOptions = {
        zoom: 14,
        center: latlon, /* Definimos la posicion del mapa con el punto */
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}, 
        mapTypeControl: true, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles : styles

    };/* HYBRID  Configuramos una serie de opciones como el zoom del mapa y el tipo.*/

    map = new google.maps.Map($("#map_canvas").get(0), myOptions); /*Creamos el mapa y lo situamos en su capa */

/*    google.maps.event.addListener(map, 'click', function(event)
    {
        addMarker(event.latLng);
    });
*/
}


var formatted_addr = null;

function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                //formatted address
                var tam = results[0].address_components.length;
                //console.log(results[0]);
                formatted_addr = results[0].formatted_address;
                $('#direccion-sug').html(formatted_addr);

            } else {
                $('#direccion-sug').val('No encontró una dirección asociada a las coordenadas.');
            }
            
        } else {
            //$('#address').val("Fallo en las Appis de Google : "+ status);
        }
    });

}