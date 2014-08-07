<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Ulogin extends CI_Controller {

	var $title = 'Login';
	var $error = NULL;
	var $userdata = NULL;
	
	
	function __construct(){
		parent::__construct();
		//$this->session->sess_destroy();
		//if($userdata = $this->session->userdata('userdata')){
		//	redirect('users'); 
		//}
		
	}
	
	public function index(){
		$this->load_view();
	}
	
	function do_login(){
		//$username = $this->input->post('username', TRUE); 
		//$password = $this->input->post('password', TRUE);
		$username = $this->input->get('username');
		$password = $this->input->get('password');
		$this->load->model('alumno');
		
		if(!$usuario = $this->alumno->get_for_login($username, $password)){
			die(json_encode(array('state' => 'error', 'msg' => 'Error de usuario o clave invalida')));
		}
		//Create the session
		$usuario->clave = NULL;
		$this->session->set_userdata('userdata', $usuario);
		$session_data = $this->session->all_userdata();
		
		die(json_encode(array('state' => 'ok', 'data' => $usuario)));
	}
	

	private function load_view(){

		$this->lang->load('dashboard');
		$data['id_user'] = "user";
		$this->load->view('public/users',$data);
	}
	
} 
 
/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */

?>
