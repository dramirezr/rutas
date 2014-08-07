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
	

	function get_vehicle_way($idruta){
		$sql  = " select a.id as idalumno,a.codigo,a.nombre, a.idparada as codparada,";
		$sql .= " b.id as idparada,b.direccion,b.telefono,b.descripcion, b.latitud, b.longitud, b.idruta, b.orden_parada, ";
		$sql .= " a.foto1,a.foto2,a.estado ";
		$sql .= " FROM paradas b ";
 		$sql .= " INNER JOIN alumno a ON (b.idruta =$idruta and b.id = a.idparada )  ";
 		
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


	function get_vehiculo_cust($propietario){
		$sql  = " select a.*,( CURRENT_TIMESTAMP( ) - INTERVAL 30 SECOND ) as datesytem  ";
		$sql .= " FROM vehiculos a ";
 		$sql .= " where a.propietario = $propietario "; 
		$result = $this->db->query($sql)->result();
		if(!count($result))
			return null;
		return $result;		
	}
	
	
}