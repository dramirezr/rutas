<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Novedades extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
		
		if(!$this->db->insert('novedades', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function get_by_id($id){
		echo $sql = " select * from novedades where id=$id ";
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result[0];		
	}

	function get_all_sucursal($idsucursal){
		$sql = " select * from novedades where idsucursal=$idsucursal";
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result;		
	}

	function update($id, $data){
		return $this->db->update('seguimiento', $data, array('id' => $id));
	}
		
}