<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
	<title><?= $this->config->item('app_name') ?></title>

	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css" />
	<link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
	
	<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script> 
    
    <script src="<?=base_url()?>assets/js/goromico.js"></script>
    
  	<script>
 		var lang = '<?=current_lang()?>';
 	    var form_view = 'view_way_stop';
 	</script>
</head>
 
<body>


<div data-role="page" id="page-ini">

    <div data-theme="b" data-role="header">

       
        <div data-role="fieldcontain">
            
            <table border=0 width="70%"><tbody>
                <tr><td >
                    <label for="select-rutas-p" class="select">Ruta:</label>
                    <span id="select-rutas-p"></span>
                    <a href="#" id='btn-search-ruta'  align="left" data-role="button" data-icon="search" data-iconpos="notext" data-theme="c" data-inline="true">Buscar</a>
                </td><td >
                    
                </td>
                <td >
                                        
                </td>
                </tr>
                </tbody>
            </table>
        </div>
       
    </div>
    <div data-role="content" class="padding-0">
         <div id="map_canvas"></div>
    </div>
    
</div>


<!-- Detalle parada: #popup -->
<div data-role="page" id="det-parada-modal" >
    
        <div data-role="header" data-theme="b">
           <h1>Punto de parada</h1> 
           <label for="direccion-sug"><span id="direccion-sug"></span></label>
        </div><!-- /header -->
        <div data-role="content" id="idcontent" data-theme="b">
            <input id="idparada" name="idparada" type="hidden" value="">
            <input id="idalumno" name="idalumno" type="hidden" value="">
            <input id="latitud"  name="latitud" type="hidden" value="">
            <input id="longitud" name="longitud" type="hidden" value="">
            
            <label for="nombre">Alumno:</label>
            <input name="nombre" id="nombre" placeholder="" value="" type="text" readonly="true">

            <label for="direccion">Dirección:</label>
            <input name="direccion" id="direccion" placeholder="" value="" type="text">
            <label for="descripcion">Descripción:</label>
            <input name="descripcion" id="descripcion" placeholder="" value="" type="text">
            <label for="telefono">Teléfono:</label>
            <input name="telefono" id="telefono" placeholder="" value="" type="text">
            <label for="orden_parada">Orden de parada:</label>
            <input name="orden_parada" id="orden_parada" placeholder="" value="" type="text">
            <label for="select-rutas">Ruta:</label>
            <span id="select-rutas"></span>
            
        </div>
        
        <p>
            <a href="#" data-role="button" data-mini="true" data-inline="true" id="btn-save-stop" data-rel="back" >Grabar y regresar</a>
            
            <a href="#page-ini" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="btn-cancel-stop">Regresar</a>
        </p>
</div><!-- /page popup -->

<div data-role="page" id="page-oculto">
<input type="checkbox" name="chk-principal" id="chk-principal" class="custom" />
</div>

</body>
</html>