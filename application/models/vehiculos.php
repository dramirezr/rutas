<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Vehiculos extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
				
		if(!$this->db->insert('vehiculos', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function get_by_id($id){
		$vehiculos = $this->db->get_where('vehiculos', array('id' => $id))->result();
		if(!count($vehiculos))
			return null;
		return $vehiculos[0];		
	}

	function update($id, $data){
		return $this->db->update('vehiculos', $data, array('id' => $id));
	}
	
	
}