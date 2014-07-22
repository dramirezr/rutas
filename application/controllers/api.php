<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	
	public function call(){
		$this->load->model('solicitud');
				
		$data['ubicacion'] 		= $this->input->get_post('address');
		$data['latitud'] 		= $this->input->get_post('lat');
		$data['longitud'] 		= $this->input->get_post('lng');
		$data['sector'] 		= $this->input->get_post('zone');
		$data['ciudad'] 		= $this->input->get_post('city');
		$data['pais'] 			= $this->input->get_post('country');
		$data['departamento'] 	= $this->input->get_post('state_c');
				
		$queryId = $this->solicitud->create($data);
		
		die(json_encode(array('state' => 'ok', 'queryId' => $queryId)) );
	}
	
	function verify_service_status(){
		$this->load->model('solicitud');
		$this->lang->load('dashboard');

		$queryId = $this->input->get_post('queryId');

		$inquiry = $this->solicitud->get_by_id($queryId);
		
		if($inquiry->estado == 'E'){
			die(json_encode(array('state' => 'delivered',  'msg' => lang('dashboard.error.canceled_service'))));
		}

		if($inquiry->estado == 'C'){
			die(json_encode(array('state' => 'error', 'msg' => lang('dashboard.error.canceled_service'))));
		}
		
		if($inquiry->agente_arribo == 1){
			$this->solicitud->update($queryId, array('agente_arribo' => 0));
			die(json_encode(array('state' => 'arrival', 'msg' => lang('dashboard.error.arrival_service'))));
		}
		
		die(json_encode(array('state' => 1,  'arribo' =>$inquiry->id)));
	}

	function updateStatusArribo(){
		$this->load->model('solicitud');
		$queryId = $this->input->get_post('queryId');
		$this->solicitud->update($queryId, array('agente_arribo' => 0));
		die(json_encode(array('state' => 'ok')));
	}
	
	function verify_call(){
		$this->load->model('solicitud');
		$this->load->model('agente');
		
		$this->lang->load('dashboard');
		
		$attempt = $this->input->get('atttempt');
		$queryId = $this->input->get('queryId');
		
		$attempts = $this->session->userdata('verification_attps') ? $this->session->userdata('verification_attps') : 0;
		$attempts ++;
		
		$this->session->set_userdata('verification_attps', $attempts);
		
		if($attempts > ci_config('max_verification_attemps')){
			$this->session->unset_userdata('verification_attps');
			//cancel the request
			$this->solicitud->update($queryId, array('estado' => 'C'));
			
			die(json_encode(array('state' => 'error', 'msg' => lang('dashboard.error.attempts'))) );	
		}
		
		//TODO: Validar si ya ha sido asignado el agente
		$inquiry = $this->solicitud->get_by_id($queryId);
		if($inquiry->idagente && $inquiry->estado == 'P'){

			$agente = $this->agente->get_by_id($inquiry->idagente);
			$data['foto'] = base_url().'assets/images/agents/'.$agente->foto;
			$data['nombre'] = $agente->nombre;
			$data['codigo'] = $agente->codigo;
			$data['telefono'] = $agente->telefono;
			$data['codigo2'] = $agente->codigo2;
			$data['id'] = $inquiry->idagente;			
			$this->load->model('vehiculos');
			$vehiculo = $this->vehiculos->get_by_id($agente->vehiculo);
			$data['placa'] = $vehiculo->placa;
			$sol = $this->solicitud->get_by_id($queryId);
			$data['direccion'] = $sol->ubicacion;
			$this->agent_accept();
			
			die(json_encode(array('state' => 1, 'queryId' => $queryId, 'agent' => $data)) );
		}
		
		die(json_encode(array('state' => 0, 'queryId' => $queryId)) );
	}
	
	function agent_accept(){
		$this->load->model('solicitud');
		$queryId = $this->input->get('queryId');
		$this->solicitud->update($queryId, array('estado' => 'A'));
	}

	function request_cancel(){
		$this->load->model('solicitud');
		$queryId = $this->input->get('queryId');
		$this->solicitud->update($queryId, array('estado' => 'C'));
	}
	
	function agent_init(){
		if($this->input->is_ajax_request()){
			$scode = md5(uniqid());
			$this->session->set_userdata('scode', $scode);
			$data = array(
				'state' => 'ok',
				'code' => $scode,
				'verification_interval' => ci_config('agent_verification_interval'),
				'updatelocation_interval' => ci_config('agent_updatelocation_interval')
			);
			
			die(json_encode($data));
//			die(json_encode(array('state' => 'ok', 'code' => $this->security->get_csrf_hash())));
		}else{
			die(json_encode(array('state' => 'error')));	
		}
	}
	
	function login(){
		
		$username = $this->input->get_post('username'); 
		$password = $this->input->get_post('password');
		 
		$this->load->model('agente');
		$this->load->model('vehiculos');
		$this->lang->load('dashboard');
		
		if(!$agente = $this->agente->get_for_login($username, $password)){
			die(json_encode(array('state' => 'error', 'msg' => lang('login.error.noauth'))));
		}
		 
		//arranca el agente en estado del servicio libre y estado pendiente
		$idagente = $agente->id;
		$this->agente->update($idagente, array('estado_servicio' => 'LIBRE','estado' => 'P'));

		//Create the session
		$vehiculo = $this->vehiculos->get_by_id($agente->vehiculo);
		$agente->clave = NULL;
		$agente->placa = $vehiculo->placa;
		
		$this->session->set_userdata('agente', $agente);
		
		$session_data = $this->session->all_userdata();
		
		die(json_encode(array('state' => 'ok', 'data' => $agente)));
		
	}
	
	function get_taxi_location(){
		$this->load->model('agente');
		$agent_id = $this->input->get_post('agent_id');
		$agente = $this->agente->get_by_id($agent_id);
		
		die(json_encode(array('state' => 'ok', 'lat' => $agente->latitud, 'lng' => $agente->longitud)));
	}

	function get_agets_location(){
		$this->load->model('agente');
		$userconfig = $this->session->userdata('userconfig');
		$cust_id = $userconfig->id;
		$cust_perfil = $userconfig->perfil;
		$cust_idsucursal = $userconfig->idsucursal;
		$agente = $this->agente->get_by_cust_id($cust_id,$cust_perfil,$cust_idsucursal);
		
		die(json_encode(array('state' => 'ok','agent' => $agente)));
	}
	
	function get_stop_location(){
		$this->load->model('paradas');
		$userconfig = $this->session->userdata('userconfig');
		$cust_id = $userconfig->id;
		$cust_perfil = $userconfig->perfil;
		$cust_idsucursal = $userconfig->idsucursal;
		$idalumno = $this->input->get_post('idalumno');
		$paradas = $this->paradas->get_student_stop($idalumno,$cust_id,$cust_perfil,$cust_idsucursal);
		
		die(json_encode(array('state' => 'ok','idalumno' =>$idalumno,'result' => $paradas)));
	}	

	function get_stop_location_way(){
		$this->load->model('paradas');
		$userconfig = $this->session->userdata('userconfig');
		$cust_id = $userconfig->id;
		$cust_perfil = $userconfig->perfil;
		$cust_idsucursal = $userconfig->idsucursal;
		$idruta = $this->input->get_post('idruta');
		$paradas = $this->paradas->get_way_stop($idruta,$cust_id,$cust_perfil,$cust_idsucursal);
		
		die(json_encode(array('state' => 'ok','idruta' =>$idruta,'result' => $paradas)));
	}	



	function select_alumnos(){
		$this->load->model('alumno');
		$userconfig = $this->session->userdata('userconfig');
		$cust_id = $userconfig->id;
		$cust_perfil = $userconfig->perfil;
		$cust_idsucursal = $userconfig->idsucursal;

		$alumnos = $this->alumno->get_alumnos($cust_perfil,$cust_idsucursal);
				
		die(json_encode(array('state' => 'ok', 'alumnos' => $alumnos)));
	}
	
	function select_rutas(){
		$this->load->model('usuarios');
		$userconfig = $this->session->userdata('userconfig');
		$cust_id = $userconfig->id;
		$cust_perfil = $userconfig->perfil;
		$cust_idsucursal = $userconfig->idsucursal;
		$rutas = $this->usuarios->get_cust($cust_perfil,$cust_idsucursal);
				
		die(json_encode(array('state' => 'ok', 'rutas' => $rutas)));
	}
	
	function saveStop(){
		$this->load->model('paradas');
	 	$id 					= $this->input->get_post('idparada');
		$data['idalumno'] 		= $this->input->get_post('idalumno');
		$data['latitud'] 		= $this->input->get_post('latitud');
		$data['longitud'] 		= $this->input->get_post('longitud');
		$data['direccion'] 		= $this->input->get_post('direccion');
		$data['telefono'] 		= $this->input->get_post('telefono');
		$data['idruta'] 		= $this->input->get_post('ruta');
		$data['descripcion'] 	= $this->input->get_post('descripcion');
		$principal			 	= $this->input->get_post('principal');
		
		if ($id=='-1'){
			$queryId = $this->paradas->create($data);
		}else{
			$this->paradas->update($id,$data);
			$queryId = $id;
		}
		
		if ($principal=='true'){
			$this->load->model('alumno');
			$pto_principal['idparada']=$id;
			$this->alumno->update($data['idalumno'],$pto_principal);
		}

		
		die(json_encode(array('state' => 'ok', 'queryId' => $queryId)) );
	}

	function deleteStop(){
		$this->load->model('paradas');
	 	$id 		= $this->input->get_post('idparada');
		$idalumno	= $this->input->get_post('idalumno');
		
		$queryId = $this->paradas->delete($id);
		
		die(json_encode(array('state' => 'ok')) );
	}


}