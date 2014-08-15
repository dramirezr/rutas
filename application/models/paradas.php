<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Paradas extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
				
		if(!$this->db->insert('paradas', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function update($id, $data){
		return $this->db->update('paradas', $data, array('id' => $id));
	}

	function delete($id){
		return $this->db->delete('paradas', array('id' => $id));
	}


	function get_by_id($id){
		$paradas = $this->db->get_where('paradas', array('id' => $id))->result();
		if(!count($paradas))
			return null;
		return $paradas[0];		
	}

	

	function get_student_stop($idalumno, $id,$perfil,$idsucursal){
		
		$sql  = " select a.idsucursal, a.id as idalumno,a.codigo,a.nombre, a.idparada as codparada, a.foto1,";
		$sql .= " b.id as idparada,b.direccion,b.telefono,b.descripcion, b.latitud, b.longitud, b.idruta, b.orden_parada ";
		$sql .= " from alumno a ";
 		$sql .= " inner join paradas b on (a.id=$idalumno and a.id=b.idalumno) ";
 		
 		if ($perfil=='CUST')
			$sql .= " where b.idruta = $id"; 
		if ($perfil=='CALL')
			$sql .= " where a.idsucursal = $idsucursal "; 
		
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result;		
	}

	function get_way_stop($idruta, $id,$perfil,$idsucursal){
		$sql  = " select a.id as idalumno,a.codigo,a.nombre, a.idparada as codparada,";
		$sql .= " b.id as idparada,b.direccion,b.telefono,b.descripcion, b.latitud, b.longitud, b.idruta, b.orden_parada, ";
		$sql .= " a.foto1,a.foto2,a.estado,a.idnovedad, u.idsucursal, s.descripcion as seguimiento ";
		$sql .= " FROM paradas b ";
 		$sql .= " INNER JOIN alumno a ON (b.idruta =$idruta and b.id = a.idparada )  ";
 		$sql .= " INNER JOIN usuarios u ON (u.id =$idruta and u.perfil = 'CUST' )  ";
 		$sql .= " LEFT JOIN seguimiento s ON (a.idseguimiento = s.id )  ";
 		
 		if ($perfil=='CUST')
			$sql .= " where b.idruta = $id"; 
		if ($perfil=='CALL')
			$sql .= " where a.idsucursal = $idsucursal "; 
		$sql .= " ORDER BY b.orden_parada ";
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result;		
	}



}