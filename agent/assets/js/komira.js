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
var busLocationDemonId;
var markersArray = [];
var agentMarker;
//var latitud;
//var longitud;
//var geocoder = new google.maps.Geocoder();


$(document).ready(function() {
    
   // $.mobile.loading( "show" );
    
    init();

    $('#do-login').click(function(e){
		e.preventDefault();
        username = $('#username').val();
        password = $('#password').val();
        login(username, password);
    });
    
    $('#btn-refresh').click(function(e){
        e.preventDefault();
        getWayStop();
    });


    $('#btn-map-back').click(function (e){
            
        $.mobile.loading("hide");
        clearInterval(busLocationDemonId);
        //borrar los marker    
        deleteOverlays();        
        if(agentMarker){
            agentMarker.setMap(null);
            agentMarker = null;
        }
                
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


function closeApp(){
   
    $.ajax({
        type : "GET",
        url : server + 'agent/close',        
        dataType : "json",
        data : {}
    }).done(function(response){
        //    
    }); 

}    

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
            $('#agent-name').html(user.nombre+' : '+user.nombreruta);
            
            getWayStop();
            
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

    clearInterval(busLocationDemonId);
    busLocationDemonId = setInterval(getBusLocation, 5000);
    getBusLocation();
    getStudentStop();
}


function getBusLocation(){
    console.log('getBusLocation');
    if(agentMarker){
        agentMarker.setPosition( new google.maps.LatLng( lat, lng ) );
    }else{
        agentMarker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            draggable: true,
            icon : 'assets/images/bus.png'
        });
    }

}

//---------------------------------
// Iconos de paradas de estudiantes.

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

function getStudentStop(){
    $.ajax({
        type : "GET",
        url : server + 'agent/get_stop_location_way',        
        dataType : "json",
        timeout : 5000,
        data : {},
    }).done(function(response){

        if(response.state == 'ok'){
            var coordenadas;
            deleteOverlays();
           for(var i in response.result){
                console.log('lat:'+response.result[i].latitud);
                coordenadas =  new google.maps.LatLng( response.result[i].latitud, response.result[i].longitud);
                setIcons(coordenadas, response.result[i]);
                // limits.extend(coordenadas);
            }
            
        }
    });
  
}

function setIcons(coordenadas, result){
    var popup;
    var icon_casa
        
    icon_casa =  'assets/images/casa.png';
          
    iconMarker = new google.maps.Marker({
            position:coordenadas,
            map: map,
            animation: google.maps.Animation.DROP, 
            draggable: false,
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
            $('#descripcion').val(result.descripcion);
            $('#foto1').attr('src', "../assets/images/students/" + result.foto1) ;
            $('#foto2').attr('src', "../assets/images/students/" + result.foto2) ;
            
            $.mobile.changePage('#det-parada-modal', { transition: "pop", role: "dialog", reverse: false } );
    });    
}
//---------------------------------


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


function getWayStop(){
    $.ajax({
        type : "GET",
        url : server + 'agent/get_stop_location_way',        
        dataType : "json",
        timeout : 5000,
        data : {
        },
        
    }).done(function(response){
            
            if(response.state == 'ok'){
                var html='';
                $('#student_stop').empty();
                for(var i in response.result){
                   html = html + PaintWayStop(response.result[i]);
                }
                
                $('#student_stop').html(html);
                $('#student_stop').trigger( "create" );
            }else{
                console.log('Error cargando datos get_stop_location_way');
            }
            
     }).fail(function(jqXHR, textStatus, errorThrown){
         //login(username, password);
      }); 
}

function PaintWayStop(data){
    var html;
    //estado : 1 en casa, 2 rumbo al colegio, 3 en el colegio, 4 rumbo a casa
    if ((data.estado==2)||(data.estado==4))
        html  = '<fieldset name="fieldset-'+data.idalumno+'" id="fieldset-'+data.idalumno+'" data-role="collapsible" data-theme="e" data-content-theme="d">';
    else
        if ((data.estado==5))
            html  = '<fieldset name="fieldset-'+data.idalumno+'" id="fieldset-'+data.idalumno+'" data-role="collapsible" data-theme="c" data-content-theme="d">';
        else
            html  = '<fieldset name="fieldset-'+data.idalumno+'" id="fieldset-'+data.idalumno+'" data-role="collapsible" data-theme="a" data-content-theme="d">';
    html += '   <legend>'+data.nombre+'</legend>';
   
    html += '   <img id="photo-boy1" alt="" style="width: 50px; height: 50px" src="../assets/images/students/'+data.foto1+'" >';
    html += '   <img id="photo-boy2" alt="" style="width: 50px; height: 50px" src="../assets/images/students/'+data.foto2+'" >';
   
    html += '   <label for="textinput-f">Dirección: '+data.direccion+', Teléfono: '+data.telefono+' </label>';
   
    html += '   <div data-role="controlgroup">';
    html += '       <input name="ckbox-2-'+data.idalumno+'" id="ckbox-2-'+data.idalumno+'" type="checkbox" ';
    if (data.estado==2)
        html += '  checked="checked" ' ;
    html +=     ' onchange="updateStateStudent('+data.idalumno+',2)" >';
    html += '       <label for="ckbox-2-'+data.idalumno+'">En camino al colegio</label>';
    
    html += '       <input name="ckbox-3-'+data.idalumno+'" id="ckbox-3-'+data.idalumno+'" type="checkbox" ';
    if (data.estado==3)
        html += '  checked="checked" ' ;
    html +=     ' onchange="updateStateStudent('+data.idalumno+',3)" >';
    html += '       <label for="ckbox-3-'+data.idalumno+'">En el colegio</label>';
    
    html += '       <input name="ckbox-4-'+data.idalumno+'" id="ckbox-4-'+data.idalumno+'" type="checkbox" ';
    if (data.estado==4)
        html += '  checked="checked" ' ;
    html +=     ' onchange="updateStateStudent('+data.idalumno+',4)" >';
    html += '       <label for="ckbox-4-'+data.idalumno+'">De regreso a casa</label>';
    
    html += '       <input name="ckbox-1-'+data.idalumno+'" id="ckbox-1-'+data.idalumno+'" type="checkbox" ';
    if (data.estado==1)
        html += '  checked="checked" ' ;
    html +=     ' onchange="updateStateStudent('+data.idalumno+',1)" >';
    html += '       <label for="ckbox-1-'+data.idalumno+'">Entregado en casa</label>';
    
    html += '       <input name="ckbox-5-'+data.idalumno+'" id="ckbox-5-'+data.idalumno+'" type="checkbox" ';
    if (data.estado==5)
        html += '  checked="checked" ' ;
    html +=     ' onchange="updateStateStudent('+data.idalumno+',5)" >';
    html += '       <label for="ckbox-5-'+data.idalumno+'">Novedad</label>';
    
    html += '   </div>';
    html += '</fieldset>';
    
    return html;
}

function updateStateStudent(idstudent,idstate,chk){

    if ($('#ckbox-'+idstate+'-'+idstudent).prop("checked")){
        $.ajax({
            type : "GET",
            url : server + 'agent/update_state_student',        
            dataType : "json",
            data : {
                student : idstudent,
                state   : idstate
            }
        }).done(function(response){
            
            if(response.state=='ok'){
                
                for (i = 1; i <= 5; i++) { 
                    if (i!=idstate)
                        $('#ckbox-'+i+'-'+idstudent).attr("checked",false).checkboxradio("refresh");
                }
                $('#ckbox-'+idstate+'-'+idstudent).attr("checked",true).checkboxradio("refresh");
             /*   
                var oldTheme = $('#fieldset-'+idstudent).attr('data-theme'); 
                var newTheme;
                if ((idstate==2)||(idstate==4)){
                    newTheme = 'e';
                }else{
                    newTheme = 'a';
                }
                
                $('#fieldset-'+idstudent).attr('data-theme', newTheme);
                $('#fieldset-'+idstudent).trigger('refresh', newTheme);
            */
                getWayStop();

            }else{
                $('#ckbox-'+idstate+'-'+idstudent).attr("checked",false).checkboxradio("refresh");
                alert("Error al intentar actualizar el estado del alumno, por favor intete de nuevo.");
            }
        }).fail(function(jqXHR, textStatus, errorThrown){
                $('#ckbox-'+idstate+'-'+idstudent).attr("checked",false).checkboxradio("refresh");
                alert("Error al intentar actualizar el estado del alumno, por favor intete de nuevo.");
          });     
    }

}


