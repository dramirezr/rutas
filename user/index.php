<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>PidaTaxi</title>

<meta name="viewport" content="width=device-width, initial-scale=1"> 


<link rel="stylesheet" href="assets/css/jquery.mobile-1.3.2.min.css" />
<link rel="stylesheet" href="assets/css/app.css" />
<script src="assets/js/jquery-1.10.2.min.js"></script>
<script src="assets/js/jquery.mobile-1.3.2.min.js"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true&amp;region=CO"></script>

<script src="assets/js/komira.js"></script>

<script>
var server = 'http://<?=$_SERVER['HTTP_HOST']?>/es/';
</script>

</head>
<body>

<!-- Home -->
<div data-role="page" id="page1">
    <div data-theme="e" data-role="header">
    	<a data-role="button" data-theme="a" href="#page1" class="ui-btn-left" id="btn-localizame">
            Localizame
        </a>
        <h3>
            PidaTaxi.com
        </h3>
        <a data-role="button" data-theme="a" href="#call-modal" class="ui-btn-right">
            Pida Taxi
        </a>
        <div data-role="fieldcontain">
            <input name="address" id="address" placeholder="" value="" type="text">
        </div>
    </div>
    
    <div data-role="content">
        <div id="map_canvas"></div>
    </div>
    
    <div data-theme="e" data-role="footer" data-position="fixed">
        <h3>
            © 2013 PidaTaxi.com
        </h3>
    </div>
</div>


<!-- Start of third page: #popup -->
<div data-role="page" id="call-modal" data-close-btn="none">
	<div id="confirm-wrapper">
		<div data-role="header" data-theme="e">
			<h1>Confirmación</h1>
		</div><!-- /header -->
	
		<div data-role="content" data-theme="d">	
			<p id="confirmation-msg"><?=lang('dashboard.callconfirm.content')?>: <span id="show-address"></span></p>	
			<h1 id="waiting-msg"><?=lang('dashboard.searching')?></h1>
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
			<p id="agent-photo"></p>
			<p id="agent-name"></p>
			<p><?=lang('dashboard.agentid')?>: <span id="agent-id"><span></p>
			<p><?=lang('dashboard.agentphone')?>: <span id="agent-phone"></span> <a href="#" data-icon="forward" data-role="button" data-mini="true" data-inline="true" id="calling-agent"><?=lang('dashboard.call')?></a></p>
		</div><!-- /content -->
		
		<p>
			<a href="#" data-role="button" data-mini="true" data-inline="true" data-rel="back" id="query-cancelation"><?=lang('dashboard.cancel')?></a>
		    <a href="#" data-role="button" data-mini="true" data-inline="true" data-icon="check" data-theme="b" id="agent-confirmation"><?=lang('dashboard.confirm')?></a>
		</p>
	</div>
</div><!-- /page popup -->


</body>
</html>