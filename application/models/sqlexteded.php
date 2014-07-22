<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sqlexteded extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function getService_agent($fi,$ff){
		$sql = 	" SELECT c.id as idsucursal,c.nombre AS sucursal, b.codigo AS cedula, b.nombre AS taxista, count( a.id ) AS solicitudes ";
		$sql .= " FROM solicitud a, agente b, sucursales c";
 		$sql .= " WHERE (a.fecha_solicitud >= '$fi' and a.fecha_solicitud <= '$ff') and idagente>0 and a.idagente = b.id AND b.idsucursal = c.id";
		$sql .= " GROUP BY c.id, c.nombre, b.codigo, b.nombre";
		$sql .= " ORDER BY c.id, b.nombre";
		$service = $this->db->query($sql)->result();
		
		if(!$service)
			return null;
		return $service;	
	}

	
		
}