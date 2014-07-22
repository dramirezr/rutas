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
<style type='text/css'>
body
{
	font-family: Arial;
	font-size: 14px;
}
a {
    color: blue;
    text-decoration: none;
    font-size: 14px;
}
a:hover
{
	text-decoration: underline;
}
</style>

	<link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
	<title><?= $this->config->item('app_name') ?></title>
</head>
<body>

 <div>
	<img id="background" src="<?=base_url()?>assets/images/fondo.jpg" alt="" title="" />
  </div>
<div id="scroller">
	<div id="cabecera">
    	<div class="row">
	  		<br><br><br><br>
		</div>
	</div>
	
 <div id="contenido">	
	<div style='height:20px;'>
	<h4>
	Hola <?php 
			echo $this->userconfig->nombre; 
		?> .!!!
	</h4>
	</div>  


	<div>
	<?php  
	if($this->userconfig->perfil=='ADMIN'){ ?>
		<a href='<?php echo site_url('admin/user_management')?>'>Administradores</a> |
		<a href='<?php echo site_url('admin/office_management')?>'>Colegios</a> |
		<a href='<?php echo site_url('admin/user_callcenter')?>'>Coordinador de transporte</a> |
		<a href='<?php echo site_url('admin/user_managervehicle')?>'>Rutas</a> |
		<a href='<?php echo site_url('admin/vehicle_management')?>'>Vehiculos</a> |
		<a href='<?php echo site_url('admin/agent_management')?>'>Conductores</a> |
		<a href='<?php echo site_url('admin/student_management')?>'>Alumnos</a> |
		<a href='<?php echo site_url('admin/student_stop_management')?>'>Paradas por alumno</a> |
		<a href='<?php echo site_url('admin/way_stop_management')?>'>Paradas por ruta</a> |
		<a href='<?php echo site_url('admin/tabletAdminAgent') ?>'>Seguimiento Vehiculos</a> |
	<?php 
	}else
	if($this->userconfig->perfil=='CALL'){ ?>
		<a href='<?php echo site_url('admin/user_managervehicle')?>'>Rutas</a> |
		<a href='<?php echo site_url('admin/vehicle_management')?>'>Vehiculos</a> |
		<a href='<?php echo site_url('admin/agent_management')?>'>Conductores</a> |
		<a href='<?php echo site_url('admin/student_management')?>'>Alumnos</a> |
		<a href='<?php echo site_url('admin/student_stop_management')?>'>Paradas por alumno</a> |
		<a href='<?php echo site_url('admin/way_stop_management')?>'>Paradas por ruta</a> |
		<a href='<?php echo site_url('admin/tabletCallAgent') ?>'>Seguimiento Vehiculos</a> |
	<?php 	
	}else
	if($this->userconfig->perfil=='CUST'){?>
		<a href='<?php echo site_url('admin/showAgentCust') ?>'>Seguimiento Vehiculos</a> |
		<a href='<?php echo site_url('admin/showAgentCust') ?>'>Configuración</a> |
	<?php 
	}
	?>
	
		<a href='<?php echo site_url('admin/close')?>'>Salida segura</a> |
	</div> 

	<div style='height:20px;'></div>  
	<?php if( ($op=="solicitude_management") or ($op=="service_agent") ){ ?>
	<div>
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
				$url = site_url('').'/'.$url;
				echo "<iframe id='targetFrame' src='$url' width='100%' height='700px'  frameborder='0' ></iframe>";
			}else
				echo $output; 

		?>
	
    </div>


</div>
</div>
	
</body>
</html>