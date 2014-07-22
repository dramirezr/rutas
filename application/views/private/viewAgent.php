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
    
    <script src="<?=base_url()?>assets/js/custripan.js"></script>
    
  	<script>
 		var lang = '<?=current_lang()?>';
 		var verification_interval = <?=ci_config('verification_interval')?>;
 		var searching_msg = '<h1><?=lang('dashboard.searching')?></h1>';
 	</script>
</head>
 
<body>

<div data-role="page" id="page1">

    <div data-theme="b" data-role="header">
    	<h3><?= $this->config->item('app_name') ?></h3>
    </div>
    <div data-role="content" class="padding-0">
         <div id="map_canvas"></div>
    </div>
    
</div>

</body>
</html>