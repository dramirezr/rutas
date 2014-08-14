<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
	<title><?= $this->config->item('app_name') ?></title>
    <script>
        var lang = '<?=current_lang()?>';
        var verification_interval = <?=ci_config('verification_interval')?>;
        var searching_msg = '<h1><?=lang('dashboard.searching')?></h1>';
    </script>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script> 
    <link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
    <link rel="stylesheet" href="<?=base_url()?>assets/css/jquery.mobile-1.3.2.min.css" />
    <script src="<?=base_url()?>assets/js/jquery-1.10.2.min.js"></script>
    <script src="<?=base_url()?>assets/js/jquery.mobile-1.3.2.min.js"></script>    

    <script src="<?=base_url()?>assets/js/custripan.js"></script>
   
  	
</head>
 
<body>

<div data-role="page" id="page1">

    <div data-theme="b" data-role="header">
    	<div data-role="fieldcontain">

            <table border=0 width="70%"><tbody>
                <tr><td >
                    <label for="select-sucursales">Sucursal:</label>
                    <span id="select-sucursales"></span>
                    <a href="#" id='btn-search'  align="left" data-role="button" data-icon="search" data-iconpos="notext" data-theme="c" data-inline="true">Buscar</a>
                </td><td >
                </td>
                <td ></td>
                </tr>
                </tbody>
            </table>
        </div>    
    </div>
    <div data-role="content" class="padding-0">
         <div id="map_canvas"></div>
    </div>
    
</div>

</body>
</html>