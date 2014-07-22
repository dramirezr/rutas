<!DOCTYPE html>
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title><?= $title.' : '.$this->config->item('app_name') ?></title>
  
  <link rel="shortcut icon" href="<?=base_url()?>assets/images/favicon.ico" type="image/x-icon">

  <link rel="stylesheet" href="<?=base_url()?>assets/foundation/css/normalize.css" />
  <link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
  <link rel="stylesheet" href="<?=base_url()?>assets/foundation/css/foundation.min.css" />

  <script src="<?=base_url()?>assets/foundation/js/vendor/custom.modernizr.js"></script>
  
  <script src="<?=base_url()?>assets/js/jquery-1.10.2.min.js"></script>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script> 
  
  <script src="<?=base_url()?>assets/js/komira.js"></script>
  
  <script>
  	var lang = '<?=current_lang()?>';
  	var verification_interval = <?=ci_config('verification_interval')?>;
  </script>
 	
</head>
<body>

  <!-- body content here -->

	<div class="row">
	  <div class="large-6 large-centered columns"><h2 class="centered-text"><?=$this->config->item('app_name');?></h2></div>
	</div>

	<div class="row">
	  <div class="large-6 large-centered columns hide" id="alert-msg-wrapper">
		<div data-alert class="alert-box alert">
		  <span id="alert-msg"></span>
		  <a href="#" class="close">&times;</a>
		</div>
	  
	  </div>
	</div>
	

	<div class="row">
		<div class="large-6 large-centered columns">
			<small><span id="current-position"></span></small>
		</div>
	</div>

	<div class="row">&nbsp;</div>

	<div class="row">
		<div class="large-6 large-centered columns">
			<div class="panel" id="service-addr">&nbsp;</div>
		</div>
	</div>

	<div class="row">
		<div class="large-6 large-centered columns">
			<a href="javascript:void(0)" class="large button expand alert" style="display: none;" id="confirm-service">APLICO</a>
			<a href="javascript:void(0)" class="large button expand " style="display: none;" id="delivered-service">ENTREGADO</a>
			<a href="javascript:void(0)" class="large button expand " style="display: none;" id="cancel-service">CANCELAR</a>
		</div>
	</div>

  <!-- END body content here -->


  <script>
  document.write('<script src=' +
  ('__proto__' in {} ? '<?=base_url()?>assets/foundation/js/vendor/zepto' : 'js/vendor/jquery') +
  '.js><\/script>')
  </script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.alerts.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.clearing.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.cookie.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.dropdown.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.forms.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.joyride.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.magellan.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.orbit.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.placeholder.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.reveal.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.section.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.tooltips.js"></script>
  <script src="<?=base_url()?>assets/foundation/js/foundation/foundation.topbar.js"></script>
  <script>
  $(document).foundation(); 
  </script>
</body>
</html>