<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Agent extends CI_Controller {

	var $title = 'Login';
	var $error = NULL;
	var $enterprise = NULL;
	var $agent = NULL;
	
	function __construct(){
		parent::__construct();
		
		if(!$this->agent = $this->session->userdata('agente')){
			redirect($user->lang.'/login'); 
		}
		
		// load language file
		$this->lang->load('dashboard');
		
		$this->load->model('agente');
			
	}
	
	public function index(){
		$this->load_view();
	}
	
	private function load_view(){
		
		$this->load->view('private/agent', array(
					'title' => $this->title,
					'error' => $this->error
					));
	}
	
	function update_location(){
		$lat = $this->input->get_post('lat');
		$lng = $this->input->get_post('lng');
		$id = $this->input->get_post('id');
		
		$id = $id ? $id : $this->agent->id;
		if(($lat<>0) and ($lat<>0) ){ 
			$this->agente->update($id, array('latitud' => $lat, 'longitud' => $lng, 'fecha_localizacion' => date('Y-m-d H:i:s')));
			die(json_encode(array('state' => 'ok')));
		}else{
			die(json_encode(array('state' => 'error')));
		}
	}

	function help_me(){
		$lat = $this->input->get_post('lat');
		$lng = $this->input->get_post('lng');
		$id = $this->input->get_post('id');
		$addr = $this->input->get_post('addr');

		
		$id = $id ? $id : $this->agent->id;
		if(($lat<>0) and ($lat<>0) ){ 
			$this->agente->update($id, array('direccion_sos' => $addr, 'fecha_sos' => date('Y-m-d H:i:s')  ));
			
			die(json_encode(array('state' => 'ok')));
		}else{
			die(json_encode(array('state' => 'error')));
		}
	}
	
	function switch_to_busy(){
		$id = $this->input->get_post('id');
		
		$id = $id ? $id : $this->agent->id;
		
		$this->agente->update($id, array('estado_servicio' => 'OCUPADO'));
		die(json_encode(array('state' => 'ok')));
				
	}

	function switch_to_free(){
		$id = $this->input->get_post('id');	
		$id = $id ? $id : $this->agent->id;
		
		$this->agente->update($id, array('estado_servicio' => 'LIBRE'));
		die(json_encode(array('state' => 'ok')));
				
	}
	
	function delivered_service(){
		$request_id = $this->input->get_post('request_id');
		$lat = $this->input->get_post('lat');
		$lng = $this->input->get_post('lng');
		$id = $this->input->get_post('id');
		$id = $id ? $id : $this->agent->id;
		
		$this->load->model('solicitud');
		
		$this->solicitud->update($request_id, array('estado' => 'E', 'lat_entrega' => $lat, 'lng_entrega' => $lng));
		$this->agente->update($id, array('estado_servicio' => 'LIBRE'));
		
		die(json_encode(array('state' => 'ok')));
	}
	
	function get_service(){
		
		$id = $this->input->get_post('id');	
		$id = $id ? $id : $this->agent->id;
		$lat = $this->input->get_post('lat');
		$lng = $this->input->get_post('lng');

		$request = $this->agente->get_nearest_request($id,$lat,$lng);
		
		if(!$request){
			die(json_encode(array('state' => '')));
		}
		
		$response = array(
			'state' => 'ok',
			'ubicacion' => $request->ubicacion,
			'sector' => $request->sector,
			'latitud' => $request->latitud,
			'longitud' => $request->longitud,
			'request' => $request->id
		);
		
		$this->agente->update($id, array('estado_servicio' => 'OCUPADO'));
		
		die(json_encode($response));
	}

	function get_sos(){
		$id = $this->input->get_post('id');	
		$id = $id ? $id : $this->agent->id;
		$lat = $this->input->get_post('lat');
		$lng = $this->input->get_post('lng');

		$request = $this->agente->get_sos($id,$lat,$lng);
		
		if(!$request){
			die(json_encode(array('state' => '')));
		}
		
		$response = array(
			'state' => 'ok',
			'agente' => $request->id,
			'fecha_sos' => $request->fecha_sos,
			'direccion_sos' => $request->direccion_sos
		);

		die(json_encode($response));
	}
	
	function confirm(){
		
		$request_id = $this->input->get_post('request_id');		
		$id = $this->input->get_post('id');	
		$id = $id ? $id : $this->agent->id;
		
		$this->load->model('solicitud');
		$solicitud = $this->solicitud->get_by_id($request_id);
		if($solicitud->estado == 'C'){
			die(json_encode(array('state' => '')));
		}
		
		if($this->agente->confirm_request($id, $request_id)){
			die(json_encode(array('state' => 'ok')));
		}else{
			die(json_encode(array('state' => '')));
		}
	}
	
	function cancel_service(){
		$request_id = $this->input->get_post('request_id');		
		$id = $this->input->get_post('id');	
		$id = $id ? $id : $this->agent->id;

		$this->load->model('solicitud');
		$solicitud = $this->solicitud->get_by_id($request_id);
		
		if($solicitud->idagente == $id){
			$this->solicitud->update($request_id, array('estado' => 'C'));
			$this->agente->update($id, array('estado_servicio' => 'LIBRE'));	
		}

		die(json_encode(array('state' => 'ok')));

	}
	
	function arrival_confirmation(){
		$request_id = $this->input->get_post('request_id');
		$this->load->model('solicitud');
		//$solicitud = $this->solicitud->get_by_id($request_id);
		$update = $this->solicitud->update($request_id, array('agente_arribo' => 1));
		
		die(json_encode(array('state' => 'ok', 'update' => $update)));
	}
	

function verify_service_status(){
		$this->load->model('solicitud');
		$this->lang->load('dashboard');

		$queryId = $this->input->get_post('queryId');

		$inquiry = $this->solicitud->get_by_id($queryId);
		
		if($inquiry->estado == 'C'){
			die(json_encode(array('state' => 'cancel', 'msg' => lang('dashboard.error.canceled_service'))));
		}
		
		die(json_encode(array('state' => 1,  'arribo' =>$inquiry->id)));
	}

} 
 
/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */