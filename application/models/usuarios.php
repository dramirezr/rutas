<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Usuarios extends CI_Model {

	function __construct(){
		parent::__construct();
	}
	
	function create($data){
				
		if(!$this->db->insert('usuarios', $data))
			return false;
		
		return $this->db->insert_id(); 
	}

	function get_by_id($id){
		$usuarios = $this->db->get_where('usuarios', array('id' => $id))->result();
		if(!count($usuarios))
			return null;
		return $usuarios[0];		
	}

	
	function update($id, $data){
		return $this->db->update('usuarios', $data, array('id' => $id));
	}
	
	function get_for_login($code, $pass){
		
		$pass = md5($pass);
		
		$usuarios = $this->db->get_where('usuarios', array('codigo' => $code, 'clave' => $pass))->result();
		if(!count($usuarios))
			return null;

		return $usuarios[0];		
	}

	function get_cust($perfil,$idsucursal){
		$sql = 	" SELECT id,nombre ";
		$sql .= " FROM usuarios WHERE perfil = 'CUST' ";
		if ($perfil!='ADMIN')
			$sql .= " and idsucursal = $idsucursal "; 
 		$result = $this->db->query($sql)->result();
		
		if(!$result)
			return null;
		return $result;	
	}
	
	
}