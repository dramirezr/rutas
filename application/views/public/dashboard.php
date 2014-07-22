<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="X-UA-Compatible" content="IE=9">
    
	<title><?= $this->config->item('app_name') ?></title>

	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css" />
	<link rel="stylesheet" href="<?=base_url()?>assets/css/app.css" />
	
	<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script> 
    
    <script src="<?=base_url()?>assets/js/mitrapana.js"></script>
    <script src="<?=base_url()?>assets/js/jquery.playSound.js"></script>

  	<script>
 		var lang = '<?=current_lang()?>';
 		var verification_interval = <?=ci_config('verification_interval')?>;
 		var searching_msg = '<h1><?=lang('dashboard.searching')?></h1>';
 	</script>
</head>
 
<body>


<div data-role="page" id="page1">
    <div data-theme="e" data-role="header">
    	<a id="btn-localizame" data-role="button"  data-theme="a" class="ui-btn-left"  ><?=lang('dashboard.localizame')?></a>
    	
    	<h3><?= $this->config->item('app_name') ?></h3>
        <div id="agent-call-wrapper">
    		<a id="agent-call" data-role="button" data-theme="a" href="#call-modal" class="ui-btn-right" data-rel="dialog" data-transition="pop" ><?=lang('dashboard.calltaxi')?></a>
    	</div>
    	<div id="agent-call2-wrapper">
    		<a id="agent-call2" data-role="button" data-theme="b" href="#call-modal" class="ui-btn-right" data-rel="dialog" data-transition="pop" ><?=lang('dashboard.showtaxi')?></a>
    	</div>
       	<?= form_open('api/call', array('id' => 'call-form', 'class' => '')) ?>
			<input id="lat" name="lat" type="hidden" value="">
			<input id="lng" name="lng" type="hidden" value="">
			<input id="zone" name="zone" type="hidden" value="">
			<input id="city" name="city" type="hidden" value="">
			<input id="state_c" name="state_c" type="hidden" value="">
			<input id="country" name="country" type="hidden" value="">
            <div data-role="fieldcontain">
            	<table border=0 width="100%"><tbody>
        		<tr><td >
                	<input name="address" id="address" value="" type="text" data-mini="true" onkeydown="return validarEnter(event)">
            	</td><td >
                	<a href="#" id='btn-address-search'  align="left" data-role="button" data-icon="search" data-iconpos="notext" data-theme="c" data-inline="true">Search</a>
                </td></tr>
                </tbody></table>
            </div>    		
    	 </form>        
    </div>
    
    <div data-role="content" class="padding-0">
         <div id="map_canvas"></div>

    </div>
  
        
    <div data-theme="e" data-role="footer" data-position="fixed" align="center">
       	<a href="http://www.facil.com.co/" >© 2013 <?= $this->config->item('app_name') ?> - GPTechnologies.</a>
    </div>
    <div id="sound_"></div>    
</div>

<!-- Start of third page: #popup -->
<div data-role="page" id="call-modal" data-close-btn="none">
	<div id="confirm-wrapper">
		<div data-role="header" data-theme="e">
			<h1><?=lang('dashboard.callconfirm.title')?></h1>
		</div><!-- /header -->
	
		<div data-role="content" data-theme="d">	
			<div id="confirmation-msg"><p><?=lang('dashboard.callconfirm.content')?>: <span id="show-address"></span></p></div>	
			<div id="waiting-msg"><h1><?=lang('dashboard.searching')?></h1></div>
		</div><!-- /content -->
		
		<p>
			<a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="call-cancelation"><?=lang('dashboard.cancel')?></a>
		    <a href="#" data-role="button" data-mini="true" data-inline="true" data-icon="check" data-theme="b" id="call-confirmation"><?=lang('dashboard.confirm')?></a>
		</p>	
	</div>
	
	<div id="agent-wrapper">
		<div data-role="header" data-theme="e">
			<h1><?=lang('dashboard.assinged')?></h1>
		</div><!-- /header -->
	
		<div data-role="content" data-theme="d">	
			<p><?=lang('dashboard.confimationcode')?>: <span id="confirmation-code"></span></p>
			<p id="agent-photo"></p>
			<p id="agent-name"></p>
			
			<p><?=lang('dashboard.agentcode2')?>: <span id="agent-placa"></span></p>
			<p><?=lang('dashboard.agentphone')?>: <span id="agent-phone"></span></p>
			
			<p><div data-role="collapsible">
					<h2><?=lang('dashboard.infoshare')?>:</h2>
					<ul data-role="listview" data-split-icon="gear" data-split-theme="d">
						<li><span id="share-twitter"></span></li>
						<li><span id="share-facebook"></span></li>
					</ul>
				</div>
			</p>
		
		</div><!-- /content -->
		
		<p>
			<a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="show-taxi"><?=lang('dashboard.showtaxi')?></a>
			<a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="query-cancelation"><?=lang('dashboard.cancel')?></a>
		</p>
	</div>
</div><!-- /page popup -->
<!-- 
<audio id="yes" src="assets/audio/yes.mp3" preload="auto"></audio>
<audio id="not" src="assets/audio/not.mp3" preload="auto"></audio>
<audio id="ring" src="assets/audio/ring.mp3" preload="auto"></audio>
 -->
<audio id="pito" src=" http://taxi.facil.com.co/assets/audio/pito.mp3" preload="auto"></audio>
<audio id="yes" src=" http://taxi.facil.com.co/assets/audio/yes.mp3" preload="auto"></audio>

</body>
</html>