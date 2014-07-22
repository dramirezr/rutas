<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	var $title = 'Login';
	var $error = NULL;
	var $enterprise = NULL;
	var $userconfig = NULL;
	
	
	function __construct(){
		parent::__construct();
		
		if($userconfig = $this->session->userdata('userconfig')){
			$this->lang->switch_uri($userconfig->lang);		
			redirect($user->lang.'admin'); 
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
		 
		$this->load->model('usuarios');
		
		if(!$usuarios = $this->usuarios->get_for_login($username, $password)){
			$this->error = lang('login.error.noauth');
			$this->index();
			return false;
		}
		
		//Create the session
		$usuarios->clave = NULL;
		$this->session->set_userdata('userconfig', $usuarios);
				
		$this->lang->switch_uri($user->lang);		
		redirect($user->lang.'admin'); 
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
