<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Seguimiento extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
		
		if(!$this->db->insert('seguimiento', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function get_by_id($id){
		$sql = " select * from seguimiento where id=$id ";
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result[0];		
	}

	function update($id, $data){
		return $this->db->update('seguimiento', $data, array('id' => $id));
	}
		
}