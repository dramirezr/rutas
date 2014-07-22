<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Solicitud extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
		
		$data['fecha_solicitud'] = date('Y-m-d H:i:s');
		$data['estado'] = 'P';
		
		if(!$this->db->insert('solicitud', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function get_by_id($id){
		//$media = $this->db->get_where('solicitud', array('id' => $id))->result();
		$sql = " select * from solicitud where id=$id ";
		$media = $this->db->query($sql)->result();
		if(!count($media))
			return null;
		return $media[0];		
	}

	function update($id, $data){
		return $this->db->update('solicitud', $data, array('id' => $id));
	}
		
}