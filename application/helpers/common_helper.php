<?php

function ci_config($key) {
	$CI = & get_instance();
	return $CI->config->item($key);
}

function get_hash() {
	$uniq = uniqid('', TRUE);
	return md5($uniq);
}

function current_lang(){
	$CI = & get_instance();
	return $CI->lang->lang();
	
}
?>