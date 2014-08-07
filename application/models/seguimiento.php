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

	function get_max_iduser($iduser){
		$sql = " select MAX(id) as idmax from seguimiento where idalumno=$iduser ";
		$result = $this->db->query($sql)->result();
		//if(!count($result))
		//	return null;
		return $result[0];		
	}

	function get_by_iduser($iduser){
		$sql = " select * from seguimiento where idalumno=$iduser order by id desc LIMIT 20 ";
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result;		
	}

	function get_seguimiento_id($id){
		$sql  = " select s.fecha,s.latitud,s.longitud,s.descripcion,a.nombre as agente,r.nombre as ruta ";
		$sql .= " from seguimiento s";
		$sql .= " left join agente a on(s.idagente=a.id) ";
		$sql .= " left join usuarios r on(s.idruta=r.id and r.perfil='CUST') ";
		$sql .= " where s.id=$id ";
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result[0];		
	}

	function update($id, $data){
		return $this->db->update('seguimiento', $data, array('id' => $id));
	}
		
}