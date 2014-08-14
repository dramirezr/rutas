<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
	<title><?= $this->config->item('app_name') ?></title>

	<link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script> 
    <link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
    <link rel="stylesheet" href="<?=base_url()?>assets/css/jquery.mobile-1.3.2.min.css" />
    <script src="<?=base_url()?>assets/js/jquery-1.10.2.min.js"></script>
    <script src="<?=base_url()?>assets/js/jquery.mobile-1.3.2.min.js"></script>    
    <script src="<?=base_url()?>assets/js/goromico.js"></script>
    
  	<script>
 		var lang = '<?=current_lang()?>';
 		
        var form_view = 'view_stops_tracking';
 	</script>
</head>
 
<body>

<div data-role="page" id="page-ini">
    <input id="select-allalumnos" name="select-allalumnos" type="hidden" value="<?=$idalumno?>">
    <input id="latitud" name="latitud" type="hidden" value="<?=$lat?>">
    <input id="longitud" name="longitud" type="hidden" value="<?=$lng?>">
    <div data-theme="b" data-role="header">
        <a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" >Regresar</a>
        <h3>Seguimientos de Paradas</h3>
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
        </div>
        <p>
            <a href="#page-ini" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="btn-cancel-stop">Regresar</a>
        </p>
</div><!-- /page popup -->

</body>
</html>