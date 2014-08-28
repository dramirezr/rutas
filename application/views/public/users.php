<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="X-UA-Compatible" content="IE=9">
    
    <title><?= $this->config->item('app_name') ?></title>
 
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script> 

    <link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
 
    <link rel="stylesheet" href="<?=base_url()?>assets/css/jquery.mobile-1.3.2.min.css" />
    <script src="<?=base_url()?>assets/js/jquery-1.10.2.min.js"></script>
    <script src="<?=base_url()?>assets/js/jquery.mobile-1.3.2.min.js"></script>
<!--   
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.3/jquery.mobile-1.4.3.min.css" />
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="http://code.jquery.com/mobile/1.4.3/jquery.mobile-1.4.3.min.js"></script>
-->
    <script src="<?=base_url()?>assets/js/mitrapana.js"></script>    
    <script>
        var verification_interval = <?=ci_config('verification_interval')?>;
    </script>
</head>
 

<body>
<div data-role="popup" id="popupBasic"></div>
<div id="audio-wrap">
    <audio id="alert" src="<?=base_url()?>assets/audio/alert.mp3" type="audio/mpeg"  autobuffer controls></audio>
</div>
<!-- Login -->
<div data-role="page" id="login-page">
    <div data-theme="b" data-role="header">
        <h3>
            <?=ci_config('app_name_')?>
        </h3>
    </div>
    <div data-role="content">
    
        <div style=" text-align:center">
           <img style="width: 96px; height: 96px" src="<?=base_url()?>assets/images/logo-ruta.png">
        </div>
        
        <form id="login-form" action="" method="POST">
            <div data-role="fieldcontain">
                <label for="username">
                    Código
                </label>
                <input name="username" id="username" placeholder="" value="" type="text">
            </div>
            <div data-role="fieldcontain">
                <label for="password">
                    Clave
                </label>
                <input name="password" id="password" placeholder="" value="" type="password">
            </div>
             <a href="#dashboard" data-role="button" id="show-dashboard" style="display: none;">Pagina principal</a>
            <input type="button" data-theme="b" data-icon="arrow-r" data-iconpos="right" value="Ingresar" id="do-login">

        </form>
    </div>
    <div data-theme="b" data-role="footer" data-position="fixed">
        <h4>
			<a href="<?= $this->config->item('app_link') ?>" ><?= $this->config->item('copyright') ?></a>
        </h4>
    </div>
  

</div>
<!-- EndLogin -->
 
<!-- Home -->
<div data-role="page" id="dashboard">
    <div data-theme="b" data-role="header">
        <table border=0 width="100%"><tbody>
        <tr>
            <td align="center" width="30%">
               <img id="user-photo" style="width: 50px; height: 50px" src="" >
            </td>
            <td align="left" width="60%">
               <label id="user-nombre"></label><br>
               <label id="user-estado"></label><br>
               <label id="user-fecha"></label>
                
            </td>
            <td  align="right" width="10%">
                 <a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="btn-close">Salir</a>
                <a href="#login-page" data-role="button" id="show-login" style="display: none;">Pagina Login</a>
            </td>
        </tr>
        </tbody></table>
        <table border=0 width="100%"><tbody>
        <tr>
            <td align="left" width="60px">
                <span id="select-history"></span>
            </td>
            
            <td  align="right" width="100%">
                <a data-role="button" data-theme="a" href="#" data-rel="dialog" data-transition="pop" id="btn-real-time">En linea</a>
            </td>
        </tr>
        </tbody></table>
  
    </div>
    
    <div data-role="content" class="padding-0">
         <div id="map_canvas"></div>
    </div>

   
    <div data-theme="b" data-role="footer" data-position="fixed">
        <h4>
           <a href="<?= $this->config->item('app_link') ?>" ><?= $this->config->item('copyright') ?></a>
        </h4>
    </div>
</div>
<!-- Home -->


<!-- Detalle parada: #popup -->
<div data-role="page" id="det-parada-modal" data-close-btn="none">
    
        <div data-role="header" data-theme="b">
           <a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="btn-stop-back">Regresar</a>
           <h1>Punto de parada</h1> 
        </div><!-- /header -->
        <div data-role="content" id="idcontent" data-theme="b">
            <img id="foto1" alt="" style="width: 50px; height: 50px" src="" >
            <img id="foto2" alt="" style="width: 50px; height: 50px" src="" >
            <label for="nombre">Alumno:</label>
            <input name="nombre" id="nombre" placeholder="" value="" type="text" readonly="true">
            <label for="direccion">Dirección:</label>
            <input name="direccion" id="direccion" placeholder="" value="" type="text" readonly="true">
            <label for="descripcion">Descripción:</label>
            <input name="descripcion" id="descripcion" placeholder="" value="" type="text" readonly="true">
            <label for="telefono">Teléfono:</label>
            <input name="telefono" id="telefono" placeholder="" value="" type="text" readonly="true">
            
        </div>
        
</div><!-- /page popup -->

</body>
</html>