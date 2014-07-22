<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	var $title = 'Login';
	var $error = NULL;
	var $enterprise = NULL;
	
	function __construct(){
		parent::__construct();
		
		if($agent = $this->session->userdata('agent')){
			$this->lang->switch_uri($agent->lang);		
			redirect($user->lang.'agent'); 
		}
		
		// load language file
		$this->lang->load('dashboard');
		
	}
	
	public function index(){
		$this->load_view();
	}
	
	function do_login(){
		
		$username = $this->input->post('username', TRUE); 
		$password = $this->input->post('password', TRUE);
		 
		$this->load->model('agente');
		
		if(!$agente = $this->agente->get_for_login($username, $password)){
			$this->error = lang('login.error.noauth');
			$this->index();
			return false;
		}
		
		//Create the session
		$agente->clave = NULL;
		$this->session->set_userdata('agente', $agente);
				
		$this->lang->switch_uri($user->lang);		
		redirect($user->lang.'agent'); 
	}
	
	private function load_view(){
		
		$this->load->view('private/login', array(
					'title' => $this->title,
					'error' => $this->error
					));
	}
	
} 
 
/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
?>
