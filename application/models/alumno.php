<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Alumno extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
				
		if(!$this->db->insert('alumno', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function get_by_id($id){
		$alumno = $this->db->get_where('alumno', array('id' => $id))->result();
		if(!count($alumno))
			return null;
		return $alumno[0];		
	}

	function update($id, $data){
		return $this->db->update('alumno', $data, array('id' => $id));
	}
	
	
	function get_alumnos($perfil,$idsucursal){
		$sql = 	" SELECT id,codigo,nombre ";
		$sql .= " FROM alumno";
		if ($perfil!='ADMIN')
			$sql .= " where idsucursal = $idsucursal "; 
 		$result = $this->db->query($sql)->result();
		
		if(!$result)
			return null;
		return $result;	
	}

	
}