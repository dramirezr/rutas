<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
	<title><?= $this->config->item('app_name') ?></title>

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script> 
    <link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
    <link rel="stylesheet" href="<?=base_url()?>assets/css/jquery.mobile-1.3.2.min.css" />
    <script src="<?=base_url()?>assets/js/jquery-1.10.2.min.js"></script>
    <script src="<?=base_url()?>assets/js/jquery.mobile-1.3.2.min.js"></script>    
    <script src="<?=base_url()?>assets/js/goromico.js"></script>
    
  	<script>
 		var lang = '<?=current_lang()?>';
 		var verification_interval = <?=ci_config('verification_interval')?>;
        var form_view = 'view_student_stop';
 	</script>
</head>
 
<body>

<div data-role="page" id="page-ini">

    <div data-theme="b" data-role="header">
        <div data-role="fieldcontain">
            
            <table border=0 width="70%"><tbody>
                <tr><td >
                    <label for="select-alumnos" class="select">Alumno:</label>
                    <span id="select-alumnos"></span>
                    <a href="#" id='btn-search-alumno'  align="left" data-role="button" data-icon="search" data-iconpos="notext" data-theme="c" data-inline="true">Buscar</a>
                </td><td >
                    
                </td>
                <td >
                    <a href="#" id='btn-add-stop'  align="left" data-role="button" data-icon="search"  data-theme="c" data-inline="true">Adicionar punto de parada</a>
                    
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
            <label for="select-allrutas">Ruta:</label>
            <select name="select-allrutas" id="select-allrutas"></select>
            <input type="checkbox" name="chk-principal" id="chk-principal" class="custom" />
            <label for="chk-principal">Parada principal</label>
            
        </div>
        
        <p>
            <a href="#" data-role="button" data-mini="true" data-inline="true" id="btn-save-stop" >Grabar y regresar</a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a href="#" data-role="button" data-mini="true" data-inline="true" id="btn-open-dialog-delete">Borrar</a>
      <!--      <a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="btn-cancel-stop">Regresar</a>
            -->
        </p>
</div><!-- /page popup -->

<div id="dialog-delete-parada" data-role="page"  >
        <!-- icono para cerrar esto da una apareicia mas estilizada -->
        <a href="#page-ini" data-role="button" data-icon="delete" data-iconpos="notext" data-theme="b" >Eliminar</a>
        <article data-role="content">
            <h2>Desea eliminar la parada?</h2>
            <a href="#page-ini" data-role="button" id="btn-delete-stop" >Si</a>
            <a href="#det-parada-modal" data-role="button" data-rel="back">No</a>
        </article>
</div>

<div id="dialog-seats" data-role="page"  >
        <!-- icono para cerrar esto da una apariencia mas estilizada -->
        <article data-role="content">
            <h2>ERROR, la ruta de BUS no cuenta con asientos disponibles. Por favor cambien de ruta.</h2>
        </article>
</div>

</body>
</html>