<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Controller {
	var $title = 'Login';
	var $error = NULL;
	var $enterprise = NULL;
	var $userconfig = NULL;

	function __construct()
	{
		parent::__construct();
		
		if(!$this->userconfig = $this->session->userdata('userdata')){
			redirect('ulogin'); 
		}
		
		$this->load->model('alumno');
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');	
	}
	
	function _admin_output($output = null)
	{
		$this->load->view('public/users.php',$output);
	}
	
	
	
	function index()
	{
		
		$this->_admin_output();
	}	
	

	function select_history(){
		$this->load->model('seguimiento');
		$iduser = $this->input->get_post('iduser');
		$seguimiento = $this->seguimiento->get_by_iduser($iduser);
		die(json_encode(array('state' => 'ok', 'result' => $seguimiento)));
	}

	function get_stop_location(){
		$this->load->model('paradas');
		$idalumno = $this->input->get_post('idalumno');
		$paradas = $this->paradas->get_student_stop($idalumno,'','','');
		die(json_encode(array('state' => 'ok','idalumno' =>$idalumno,'result' => $paradas)));
	}

	function get_location_history(){
		$this->load->model('seguimiento');
		$id = $this->input->get_post('id');
		$seguimiento = $this->seguimiento->get_by_id($id);
		die(json_encode(array('state' => 'ok', 'result' => $seguimiento)));
	}
	
	public function close()
    {
    	//cerrar sesión
    	$this->session->sess_destroy();
    	redirect($user->lang.'/ulogin'); 

    }
	
}