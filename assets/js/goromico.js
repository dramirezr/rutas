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
var agentMarker;
var LocationDemonId=null;
var iconMarker;

$(document).ready(function() {
    if (form_view=='view_student_stop'){
        initStudentStop();
    }else
    if (form_view=='view_way_stop'){
        initWayStop();
    }else
    if (form_view=='view_stops_tracking'){
        initStopsTracking();
    }
});

function initStudentStop(){
    selectAlumnos();
    selectRutas();
    localizame(); 
    $('#btn-search-alumno').click(function(e){
        getIconLocation();
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
            setIcons(coordenadas, result);    
        }
    });
   
}

function initWayStop(){
    selectRutas_p();
    selectRutas();
    localizame(); 

    $('#btn-search-ruta').click(function(e){
        getIconLocationWay();
    });

    $('#btn-save-stop').click(function(e){
        saveStop();
    });
}

function initStopsTracking(){
    localizame(); 
    
}

function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}



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
                alert('ERROR al intentar borrar el punto de parada. Por favor intente de nuevo.');                
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
                if (form_view=='view_student_stop'){
                    getIconLocation();
                    //cierra despues de grabar para cambiar el efecto del color cuando es la parada principal
                    //$("#det-parada-modal").dialog('close');
                }else{
                    if (form_view=='view_way_stop'){
                        getIconLocationWay();
                        $('.ui-dialog').dialog('close');
                    }
                }
                
            }else{
                if (response.state == 'error_max_seats'){
                    alert('ERROR, la ruta de BUS no cuenta con asientos disponibles. Por favor cambien de ruta.');                
                }
            }

        }).fail(function(jqXHR, textStatus, errorThrown){
         console.log('Error:'+errorThrown);
      }); 
       
}




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
                html = '<option value="-1">...</option>';
                for(var i in response.rutas){
                    html = html + '<option value=' + response.rutas[i].id + '>' + response.rutas[i].nombre + '</option>';
                }
            }

            $('#select-allrutas').html(html);
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
            //map.setCenter(new google.maps.LatLng( 0, 0 ));
            var bounds = new google.maps.LatLngBounds();
            for(var i in response.result){
                coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                setIcons(coordenadas, response.result[i]);
               
                bounds.extend(coordenadas);
            }

            getOfficeLocation(response.result[0].idsucursal);

            map.setCenter(bounds.getCenter());
            //$("#det-parada-modal").dialog('close');
            //cierra las ventanas modales.
            $('.ui-dialog').dialog('close');
        }
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
            setOfficeIcons(coordenadas)
        }
    });
  
}


var flag='';
function getIconLocationWay(){
    var idruta = $('#select-allrutas-p').val();  
    clearInterval(LocationDemonId);
    if(idruta>0){
        LocationDemonId = setInterval(getIconLocationWay, verification_interval);
    
        $.ajax({
            type : "GET",
            url : lang + '../../../api/get_stop_location_way',        
            dataType : "json",
            data : {
                cachehora : (new Date()).getTime(),
                idruta  : idruta
            }
        }).done(function(response){

            if(response.state == 'ok'){
                var coordenadas;
                deleteOverlays();
                var bounds = new google.maps.LatLngBounds();
                for(var i in response.result){
                    coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                    setIcons(coordenadas, response.result[i]);
                    bounds.extend(coordenadas);
                }

                getOfficeLocation(response.result[0].idsucursal);

                getBusLocation(idruta,bounds);
            }
        });
    }else
        deleteOverlays();
}


function getBusLocation(idruta,bounds){
    $.ajax({
        type : "GET",
        url : lang + '../../../api/select_vehicle',        
        dataType : "json",
        data : {
            cachehora : (new Date()).getTime(),
            idruta  : idruta
        }
        
    }).done(function(response){

        if(response.state == 'ok'){
            var coordenadas;
            for(var i in response.result){
                coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                setIconsBus(coordenadas, response.result[i]);
                bounds.extend(coordenadas);
            }

            if (flag!=idruta){
                map.setCenter(bounds.getCenter());   
                map.fitBounds(bounds);
            }
            flag=idruta;
        }
    });
}


function setIconsBus(coordenadas, result){
    var icon_bus;
    if(result.fecha_localizacion>result.datesytem)
        icon_bus =  '/assets/images/bus.png';
    else
        icon_bus =  '/assets/images/bus2.png';

    iconMarker = new google.maps.Marker({
        position:coordenadas,
        map: map,
        //animation: google.maps.Animation.DROP, 
        draggable: false,
        icon : icon_bus,
        title : 'Placa: '+result.placa+' - Ult. Fecha act.: ' +result.fecha_localizacion 
    });
    markersArray.push(iconMarker);
               
}

function setOfficeIcons(coordenadas){
    iconMarker = new google.maps.Marker({
            position:coordenadas,
            map: map,
            icon : '/assets/images/colegio.png'
    });
    markersArray.push(iconMarker);
}



function setOptionValue(value){
    var myselect = $("#select-allrutas");
    myselect.val(value).attr('selected', true).siblings('option').removeAttr('selected');
    myselect.selectmenu();
    myselect.selectmenu("refresh", true);
}

function setIcons(coordenadas, result){
    //if (result.idalumno!="-1"){
        var popup;
        var icon_casa;
        var seguimiento='';
        if ((form_view=='view_student_stop')||(form_view=='view_stops_tracking')){
            if(result.codparada==result.idparada)
                icon_casa =  '/assets/images/casa.png';
            else
                icon_casa =  '/assets/images/casa2.png';
        }else{
            if (form_view=='view_way_stop'){
                if(result.estado==1)
                    icon_casa =  '/assets/images/casa2.png';
                else
                    icon_casa =  '/assets/images/casa.png';
                seguimiento = ' - '+result.seguimiento;
            }
        }
        
        iconMarker = new google.maps.Marker({
            position:coordenadas,
            map: map,
            //animation: google.maps.Animation.DROP, 
            draggable: true,
            icon : icon_casa,
            title : result.orden_parada+'. '+result.nombre+seguimiento+' - '+result.direccion +' - '+result.telefono+' - '+result.descripcion
        });
        markersArray.push(iconMarker);
                

       google.maps.event.addListener(iconMarker, 'click', function(evento){
            $('#idparada').val(result.idparada);
            $('#idalumno').val(result.idalumno);
            //$('#latitud').val(result.latitud);
            //$('#longitud').val(result.longitud);
            $('#latitud').val(evento.latLng.lat());
            $('#longitud').val(evento.latLng.lng());
            $('#nombre').val(result.nombre + seguimiento);
            $('#foto').attr('src', "/assets/images/students/" + result.foto1) ;
           
            $('#telefono').val(result.telefono);
            $('#direccion').val(result.direccion);
            setOptionValue(result.idruta);

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
 var address;
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
    
    if (form_view=='view_stops_tracking'){
        getIconLocation();
         
        var coorBus = new google.maps.LatLng($('input[name="latitud"]').val(),$('input[name="longitud"]').val());
        iconMarkerBus = new google.maps.Marker({
            position:coorBus,
            map: map,
            icon : '/assets/images/bus.png'
        });
    }

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