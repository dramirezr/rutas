<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
	<title><?= $this->config->item('app_name') ?></title>

	<link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script> 
    <link rel="stylesheet" href="<?=base_url()?>assets/css/jquery.mobile-1.3.2.min.css" />
    <script src="<?=base_url()?>assets/js/jquery-1.10.2.min.js"></script>
    <script src="<?=base_url()?>assets/js/jquery.mobile-1.3.2.min.js"></script>
    <script src="<?=base_url()?>assets/js/goromico.js"></script>
    
  	<script>
 		var lang = '<?=current_lang()?>';
        var verification_interval = <?=ci_config('verification_interval')?>;
 	    var form_view = 'view_way_stop';
 	</script>
</head>
 
<body>


<div data-role="page" id="page-ini">

    <div data-theme="b" data-role="header">
        <div data-role="fieldcontain">
            <table border=0 width="50%"><tbody>
                <tr><td >
                    <label for="select-rutas-p" class="select">Ruta:</label>
                    <span id="select-rutas-p"></span>
                </td>
                <td>  
                    <select name="select-turno" id="select-turno" data-role="slider" onchange="getIconLocationWay()">
                        <option value="M">Mañana</option>
                        <option value="T">Tarde</option>
                    </select>
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
           &nbsp;&nbsp;<label for="direccion-sug"><span id="direccion-sug"></span></label>
        </div><!-- /header -->
        <div data-role="content" id="idcontent" data-theme="b">
            <input id="idparada" name="idparada" type="hidden" value="">
            <input id="idalumno" name="idalumno" type="hidden" value="">
            <input id="latitud"  name="latitud" type="hidden" value="">
            <input id="longitud" name="longitud" type="hidden" value="">
            
            <table border=0 width="100%"><tbody>
            <tr>
            <td width="20%"><img id="foto" alt="" style="width: 50px; height: 50px" src="" ></td>
            <td width="80%"><input name="nombre" id="nombre" placeholder="" value="" type="text" readonly="true"></td>
            </tr>
            <tr>
            <td ><label for="direccion">Dirección:</label></td>
            <td ><input name="direccion" id="direccion" placeholder="Dirección:" value="" type="text"></td>
            </tr>
            <tr>
            <td ><label for="descripcion">Descripción:</label></td>
            <td ><input name="descripcion" id="descripcion" placeholder="Descripción:" value="" type="text"></td>
            </tr>
            <tr>
            <td ><label for="telefono">Teléfono:</label></td>
            <td ><input name="telefono" id="telefono" placeholder="Teléfono" value="" type="text"></td>
            </tr>
            <tr>
            <td ><label for="orden_parada">Orden de parada:</label></td>
            <td ><input name="orden_parada" id="orden_parada" placeholder="" value="" pattern="[0-9]*" type="number"></td>
            </tr>
            <tr>
            <td ><label for="select-allrutas">Ruta:</label></td>
            <td ><select name="select-allrutas" id="select-allrutas"></select></td>
            </tr>
            </tbody>
            </table>
        </div>
        
        <p>
            <a href="#" data-role="button" data-mini="true" data-inline="true" id="btn-save-stop" >Grabar y regresar</a>
           <!-- 
           <a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="btn-cancel-stop">Regresar</a>
           -->
        </p>
</div><!-- /page popup -->

<div data-role="page" id="page-oculto">
<input type="checkbox" name="chk-principal" id="chk-principal" class="custom" />
<input type="checkbox" name="chk-parada_tarde" id="chk-parada_tarde" class="custom" />
</div>

</body>
</html>