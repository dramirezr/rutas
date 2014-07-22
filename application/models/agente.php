<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Agente extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
				
		if(!$this->db->insert('agente', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function get_by_id($id){
		$agente = $this->db->get_where('agente', array('id' => $id))->result();
		if(!count($agente))
			return null;
		return $agente[0];		
	}

	function get_by_cust_id($id,$perfil,$idsucursal){
		
		$sql = " select a.nombre, a.telefono, a.foto, a.latitud, a.longitud, a.estado_servicio, a.fecha_localizacion, v.placa, a.fecha_localizacion , ( CURRENT_TIMESTAMP( ) - INTERVAL 60 SECOND ) as datesytem ";
		$sql .= " from vehiculos v, agente a";
 		$sql .= " 	inner join(";
		$sql .= "     select vehiculo, max(fecha_localizacion) as max_fecha";
		$sql .= "     from agente";
		$sql .= "     group by vehiculo";
		$sql .= "    ) as R";
		$sql .= "    on a.vehiculo = R.vehiculo";
		$sql .= "    and a.fecha_localizacion = R.max_fecha";
		if ($perfil=='ADMIN')
			$sql .= " where v.id=a.vehiculo"; 
		if ($perfil=='CUST')
			$sql .= " where v.propietario = $id and v.id=a.vehiculo"; 
		if ($perfil=='CALL')
			$sql .= " where v.idsucursal = $idsucursal and v.id=a.vehiculo"; 
		
		$agente = $this->db->query($sql)->result();
		if(!count($agente))
			return null;
		return $agente;		
	}

	function update($id, $data){
		return $this->db->update('agente', $data, array('id' => $id));
	}
	
	function get_for_login($code, $pass){
		
		$pass = md5($pass);
		
		$agente = $this->db->get_where('agente', array('codigo' => $code, 'clave' => $pass))->result();
		if(!count($agente))
			return null;
		return $agente[0];		
	}
	
	function get_nearest_request($id,$lat,$lng){
		
		$sql  = " SELECT *, (acos(sin(radians($lat)) * sin(radians(latitud)) + ";
		$sql .= " cos(radians($lat)) * cos(radians(latitud)) * ";
		$sql .= " cos(radians($lng) - radians(longitud))) * 6378) as distancia ";
		$sql .= " from solicitud ";
		$sql .= " where fecha_solicitud > ( CURRENT_TIMESTAMP( ) - INTERVAL 60 SECOND ) ";
		$sql .= " and estado = 'P' AND idagente IS NULL ";
		$sql .= " HAVING distancia < ".ci_config('distance_call');
		$sql .= " ORDER BY distancia LIMIT 1 ";
		
		$sol = $this->db->query($sql)->result();
		
		if(!count($sol))
			return null;
		
		return $sol[0];
	}
	
	function get_sos($id,$lat,$lng){
		
		$sql  = " SELECT *, (acos(sin(radians($lat)) * sin(radians(latitud)) + ";
		$sql .= " cos(radians($lat)) * cos(radians(latitud)) * ";
		$sql .= " cos(radians($lng) - radians(longitud))) * 6378) as distancia ";
		$sql .= " from agente ";
		$sql .= " where id<>$id and fecha_sos > ( CURRENT_TIMESTAMP( ) - INTERVAL 60 SECOND ) ";
		$sql .= " HAVING distancia < ".ci_config('distance_call_sos');
		$sql .= " ORDER BY distancia LIMIT 1 ";
		
		$sol = $this->db->query($sql)->result();
		
		if(!count($sol))
			return null;
		
		return $sol[0];
	}

	function confirm_request($id, $request_id){
		
		$this->db->where("id = $request_id AND idagente IS NULL");
		$this->db->update('solicitud', array('idagente' => $id));
		
		return ($this->db->affected_rows() > 0);
	}
}