<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
<?php 
foreach($css_files as $file): ?>
	<link type="text/css" rel="stylesheet" href="<?php echo $file; ?>" />
<?php endforeach; ?>
<?php foreach($js_files as $file): ?>
	<script src="<?php echo $file; ?>"></script>
<?php endforeach; ?>

	<link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	
	<title><?= $this->config->item('app_name') ?></title>
	<script type="text/javascript">
		function mostrarVentana()
		{
		    var ventana = document.getElementById('miVentana'); // Accedemos al contenedor
		    ventana.style.marginTop = "100px"; // Definimos su posición vertical. La ponemos fija para simplificar el código
		    ventana.style.marginLeft = ((document.body.clientWidth-350) / 2) +  "px"; // Definimos su posición horizontal
		    ventana.style.display = 'block'; // Y lo hacemos visible
		}

		function ocultarVentana()
		{
		    var ventana = document.getElementById('miVentana'); // Accedemos al contenedor
		    ventana.style.display = 'none'; // Y lo hacemos invisible
		}
	</script>
<style type="text/css">

body{font-family: Arial,sans-serif;color:#333;}

ul{
	width:98%;
	margin:0% auto;
	list-style:none;
}
ul li{

	float:left;
	margin-right:2px;

}
ul li a{
	font-family: Arial, sans-serif;
	font-size:12px;
	text-decoration:none;
	background:#5892C0;
	padding:2px;
	color:#fff;
	font-weight:bold;
	border-radius:5px;
	-webkit-transition: all 200ms ease-in;
	-moz-transition: all 200ms ease-in;
	transition: all 200ms ease-in;
}
ul li a:hover{
	background:#808080;
	color:#fff;

}

a{
	text-decoration:none;
	font-family: Arial, sans-serif;
	font-size:12px;
	color:#222;

}
a:hover{

	color:#DF7401;
	
}
.nsc{
	position:absolute;
	bottom:40%;
	right:0;
}
</style>

</head>
<body>
<!--
 <div>
	<img id="background" src="<?=base_url()?>assets/images/fondo.jpg" alt="" title="" /> 
  </div>
 -->
<div id="scroller">
	
 	  	
 <div id="contenido">	
	 
	<div>
	<b><?=$this->config->item('app_name');?> - Hola <?php 	echo $this->userconfig->nombre; ?> .!!!</b>
	<hr>
	<ul>

	<?php
	if($this->userconfig->perfil=='ADMIN'){ ?>
		
		<li><a href='<?php echo site_url('admin/user_management')?>'>Administradores</a> </li>
		<li><a href='<?php echo site_url('admin/office_management')?>'>Colegios</a> </li>
		<li><a href='<?php echo site_url('admin/user_callcenter')?>'>Coordinadores</a></li>
		<li><a href='<?php echo site_url('admin/user_managervehicle')?>'>Rutas</a></li>
		<li><a href='<?php echo site_url('admin/vehicle_management')?>'>Vehiculos</a></li>
		<li><a href='<?php echo site_url('admin/agent_management')?>'>Conductores</a></li>
		<li><a href='<?php echo site_url('admin/novedades_management')?>'>Novedades</a></li>
		<li><a href='<?php echo site_url('admin/grados_management')?>'>Grados</a></li>
		<li><a href='<?php echo site_url('admin/student_management')?>'>Alumnos</a></li>
		<li><a href='<?php echo site_url('admin/student_stop_management')?>'>Paradas alumno</a></li>
		<li><a href='<?php echo site_url('admin/way_stop_management')?>'>Paradas ruta</a></li>
		<li><a href='<?php echo site_url('admin/stops_tracking') ?>'>Seguimiento Paradas</a></li>
		<li><a href='<?php echo site_url('admin/tabletAdminAgent') ?>'>Seguimiento Vehiculos</a></li>
		<br>
	<?php 
	}else
	if($this->userconfig->perfil=='CALL'){ ?>
		<li><a href='<?php echo site_url('admin/user_managervehicle')?>'>Rutas</a></li>
		<li><a href='<?php echo site_url('admin/vehicle_management')?>'>Vehiculos</a></li>
		<li><a href='<?php echo site_url('admin/agent_management')?>'>Conductores</a></li>
		<li><a href='<?php echo site_url('admin/novedades_management')?>'>Novedades</a></li>
		<li><a href='<?php echo site_url('admin/grados_management')?>'>Grados</a></li>
		<li><a href='<?php echo site_url('admin/student_management')?>'>Alumnos</a></li>
		<li><a href='<?php echo site_url('admin/student_stop_management')?>'>Paradas por alumno</a></li>
		<li><a href='<?php echo site_url('admin/way_stop_management')?>'>Paradas por ruta</a></li>
		<li><a href='<?php echo site_url('admin/stops_tracking') ?>'>Seguimiento Paradas</a></li>
	 	<li><a href='<?php echo site_url('admin/tabletCallAgent') ?>'>Seguimiento Vehiculos</a></li>
	<?php 	
	}else
	if($this->userconfig->perfil=='CUST'){?>
		<li><a href='<?php echo site_url('admin/showAgentCust') ?>'>Seguimiento Vehiculos</a></li>
		<li><a href='<?php echo site_url('admin/showAgentCust') ?>'>Configuración</a></li>
	<?php 
	}
	?>
	 
		<li>&nbsp;&nbsp;&nbsp;&nbsp;
		<a href='<?php echo site_url('admin/close')?>'>Salida segura</a></li>
	</ul>
	</div> 
<br>
	<?php if( ($op=="stops_tracking") ){ ?>
	<div>
		<br>
		<form action='<?php echo site_url('admin')."/$op";?>' method='GET' > 
			Fecha inicial : <input type='text' name='fechaini' value='<?php echo $fechaini; ?>' MAXLENGTH=20 />
			Fecha final : <input type='text' name='fechafin' value='<?php echo $fechafin; ?>' MAXLENGTH=20 />
			<input type='submit'  value="Consultar" name='btn_consultar' class="submit" />
		</form> 
    </div>
	<?php } ?>
	<div>
		<?php 
			
			if( ($op=="student_stop_management") or ($op=="way_stop_management") or 
				($op=="tabletCallAgent") or ($op=="showAgentCust") or ($op=="tabletAdminAgent") )
			{
				echo "<br>";
				$url = site_url('').'/'.$url;
				echo "<iframe id='targetFrame' src='$url' width='100%' height='700px'  frameborder='0' ></iframe>";
			}else
				echo $output; 

		?>
	
    </div>

    <div id="miVentana" style="position: fixed; width: 350px; height: 350px; top: 0; left: 0; font-family:Verdana, Arial, Helvetica, sans-serif; font-size: 12px; font-weight: normal; border: #333333 3px solid; background-color: #FAFAFA; color: #000000; display:none;">
 		<div style="font-weight: bold; text-align: left; color: #FFFFFF; padding: 5px; background-color:#006394">Título de la ventana</div>
 		<?php 
 		echo "hola mundo...".$op;
 		if( ($op=="stops_tracking") )
			{
				echo $url = site_url('').'/'.$url;
				echo "<iframe id='targetFrame' src='$url' width='100%' height='700px'  frameborder='0' ></iframe>";
			}
		?>
  		<div style="padding: 10px; background-color: #F0F0F0; text-align: center; margin-top: 44px;"><input id="btnAceptar" onclick="ocultarVentana();" name="btnAceptar" size="20" type="button" value="Aceptar" />
 		</div>
	</div>  


</div>
</div>


</body>
</html>