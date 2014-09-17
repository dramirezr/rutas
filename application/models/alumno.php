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

	function set_pto_manana($id, $idparada){
		return $this->db->update('alumno', array('idparada' => 0), array('id' => $id,'idparada' => $idparada));
	}
	
	function set_pto_tarde($id, $idparada){
		return $this->db->update('alumno', array('idparada_tarde' => 0), array('id' => $id,'idparada_tarde' => $idparada));
	}

	function get_for_login($code, $pass){
		$pass = md5($pass);
		$sql = 	" SELECT a.idsucursal, a.id,a.codigo,a.nombre,a.foto1,s.fecha, s.descripcion as estado ";
		$sql .= " FROM alumno a ";
		$sql .= " left join seguimiento s on(a.idseguimiento=s.id) ";
		$sql .= " where a.codigo = '$code' and clave='$pass' "; 
 		$result = $this->db->query($sql)->result();

		if(!count($result))
			return null;
		return $result[0];		
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

	function get_state($iduser){
		$sql = 	" SELECT s.fecha, s.descripcion as estado ";
		$sql .= " FROM alumno a ";
		$sql .= " left join seguimiento s on(a.idseguimiento=s.id) ";
		$sql .= " where a.id = $iduser "; 
 		$result = $this->db->query($sql)->result();

		if(!count($result))
			return null;
		return $result[0];		
	}

	function get_puestos_ruta($ruta){
		$sql  = " SELECT sum(puestos) as num ";
		$sql .= " FROM vehiculos  "; 
 		$sql .= " WHERE propietario = $ruta ";
 		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result[0];		
	}	

	function get_alumnos_ruta($alumno,$idruta){
		$sql  = " select count(a.id) as num ";
		$sql .= " FROM paradas b, alumno a ";
 		$sql .= " where b.idruta = $idruta and b.idalumno <> $alumno and b.id = a.idparada "; 
 		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result[0];		
	}

	function get_alumnos_ruta_tarde($alumno,$idruta){
		$sql  = " select count(a.id) as num ";
		$sql .= " FROM paradas b, alumno a ";
 		$sql .= " where b.idruta = $idruta and b.idalumno <> $alumno and b.id = a.idparada_tarde "; 
 		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result[0];		
	}


	
}