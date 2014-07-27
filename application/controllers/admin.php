<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends CI_Controller {
	var $title = 'Login';
	var $error = NULL;
	var $enterprise = NULL;
	var $userconfig = NULL;

	function __construct()
	{
		parent::__construct();
		
		if(!$this->userconfig = $this->session->userdata('userconfig')){
			redirect($user->lang.'login'); 
		}
		
		// load language file
		$this->lang->load('dashboard');
		$this->load->model('usuarios');
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');	
	}
	
	function _admin_output($output = null)
	{
		$this->load->view('private/admin.php',$output);	
		/*if($this->userconfig->perfil=='ADMIN')
			$this->load->view('private/admin.php',$output);	
		else
			if($this->userconfig->perfil=='CALL')
				//$this->callService();
				//$this->tabletCallAgent();
				$this->load->view('private/callcenter.php',$output);	
			else
				if($this->userconfig->perfil=='CUST')
					$this->showAgentCust();
		*/
	}
	
	
	
	function index()
	{
		if($this->userconfig->perfil=='ADMIN')
			$this->user_management();
		else
			if($this->userconfig->perfil=='CALL')
				//$this->_admin_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array() , 'op' => '' ));
				$this->user_managervehicle();

			else
				if($this->userconfig->perfil=='CUST')
					$this->_admin_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array() , 'op' => '' ));
	}	
	
	function encrypt_password_callback($post_array) {

		if(!empty($post_array['clave']))
		{
		    $post_array['clave'] = md5($post_array['clave']);
		}
		else
		{
		    unset($post_array['clave']);
		}
	    return $post_array;

    }  

    function set_password_input_to_empty() {
    	return "<input type='password' name='clave' value='' />";
	}

	function set_user_call() {
    	return "<input type='hidden' name='perfil' value='CALL' />";
	}
	
	function set_user_cust() {
    	return "<input type='hidden' name='perfil' value='CUST' />";
	}

	function set_user_admin() {
    	return "<input type='hidden' name='perfil' value='ADMIN' />";
	}

	function set_user_sucursal() {
    	return "<input type='hidden' name='idsucursal' value='-1' />";
	}
	
	
	function user_management()
	{
		if($this->userconfig->perfil=='ADMIN'){
	
			$crud = new grocery_CRUD();

			$crud->set_theme('datatables');
			$crud->set_table('usuarios');
			$crud->set_subject('Administrador del sistema');
			$crud->columns('nombre','codigo','ciudad','direccion','telefono');
			$crud->fields('nombre','codigo','clave','pais','departamento','ciudad','direccion','telefono');
			$crud->required_fields('nombre','codigo','pais','departamento','ciudad','direccion','telefono');
			$crud->display_as('codigo', 'Login');

			$crud->change_field_type('clave', 'password');
			
        	$crud->callback_edit_field('clave',array($this,'set_password_input_to_empty'));
    		$crud->callback_add_field('clave',array($this,'set_password_input_to_empty'));

    		
    		$crud->callback_before_update(array($this,'encrypt_password_callback'));
    		$crud->callback_before_insert(array($this,'encrypt_password_callback'));

    		$crud->callback_edit_field('perfil',array($this,'set_user_admin'));
    		$crud->callback_add_field('perfil',array($this,'set_user_admin'));
			
			$crud->callback_edit_field('idsucursal',array($this,'set_user_sucursal'));
    		$crud->callback_add_field('idsucursal',array($this,'set_user_sucursal'));
 			 			

			$crud->where('perfil =', 'ADMIN');
			
			$output = $crud->render();
			$output -> op = 'user_management';
			//$output -> perfil = 'ADMIN';
			
			
			$this->_admin_output($output);
		}else{
			$this->close();			
		}
	}

	function office_management()
	{
		if($this->userconfig->perfil=='ADMIN'){
	
			$crud = new grocery_CRUD();

			$crud->set_theme('datatables');
			$crud->set_table('sucursales');
			$crud->set_subject('Institución');
			$crud->columns('nombre');
			$crud->fields('nombre');
			$crud->required_fields('nombre');
			$crud->display_as('nombre', 'Nombre institución');
			
			$output = $crud->render();
			$output -> op = 'office_management';
		
			$this->_admin_output($output);
		
		}else{
			$this->close();
		}
	}

	function user_callcenter()
	{
		if($this->userconfig->perfil=='ADMIN'){
	
			$crud = new grocery_CRUD();

			$crud->set_theme('datatables');
			$crud->set_table('usuarios');
			$crud->set_subject('Coordinador de transporte');
			$crud->columns('nombre','idsucursal','codigo','ciudad');
			$crud->fields('nombre','idsucursal','codigo','clave','pais','departamento','ciudad','direccion','telefono','perfil');
			$crud->required_fields('nombre','idsucursal','codigo','pais','departamento','ciudad','direccion','telefono','perfil');
			$crud->display_as('codigo', 'Login');
			
			$crud->set_relation('idsucursal', 'sucursales', 'nombre');
			$crud->display_as('idsucursal', 'Institución');
			
			$crud->change_field_type('clave', 'password');
			$crud->change_field_type('perfil', 'hidden');
			
        	$crud->callback_edit_field('clave',array($this,'set_password_input_to_empty'));
    		$crud->callback_add_field('clave',array($this,'set_password_input_to_empty'));
 			
 			$crud->callback_edit_field('perfil',array($this,'set_user_call'));
    		$crud->callback_add_field('perfil',array($this,'set_user_call'));
 			
    		$crud->callback_before_update(array($this,'encrypt_password_callback'));
    		$crud->callback_before_insert(array($this,'encrypt_password_callback'));

			$crud->where('perfil =','CALL');
			
			$output = $crud->render();
			$output -> op = 'user_management';
			
			
			$this->_admin_output($output);
		}else{
			$this->close();
		}
	}


	function user_managervehicle()
	{
		if(($this->userconfig->perfil=='ADMIN')or($this->userconfig->perfil=='CALL')){
		
			$crud = new grocery_CRUD();

			$crud->set_theme('datatables');
			$crud->set_table('usuarios');
			$crud->set_subject('Rutas');
			if($this->userconfig->perfil=='CALL')
			{
				$crud->unset_add();
				$crud->unset_delete();
				$crud->unset_export();
				$crud->unset_print();	
			}
			//$crud->columns('nombre','idsucursal','codigo','pais','departamento','ciudad','direccion','telefono','perfil');
			$crud->columns('nombre','idsucursal','codigo');
			$crud->fields('nombre','idsucursal','codigo','clave','pais','departamento','ciudad','direccion','telefono','perfil');
			$crud->required_fields('nombre','idsucursal','codigo','pais','departamento','ciudad','direccion','telefono','perfil');
			$crud->display_as('codigo', 'Login');
			
			$crud->change_field_type('clave', 'password');
			$crud->change_field_type('perfil', 'hidden');
			if($this->userconfig->perfil=='ADMIN')
				$crud->set_relation('idsucursal', 'sucursales', 'nombre');
			else
				$crud->set_relation('idsucursal', 'sucursales', 'nombre','id IN ("'.$this->userconfig->idsucursal.'")');			
			
			$crud->display_as('idsucursal', 'Institución');

	    	$crud->callback_edit_field('clave',array($this,'set_password_input_to_empty'));
			$crud->callback_add_field('clave',array($this,'set_password_input_to_empty'));
				
			$crud->callback_edit_field('perfil',array($this,'set_user_cust'));
			$crud->callback_add_field('perfil',array($this,'set_user_cust'));
				
			$crud->callback_before_update(array($this,'encrypt_password_callback'));
			$crud->callback_before_insert(array($this,'encrypt_password_callback'));

			$crud->where('perfil =', 'CUST');

			if($this->userconfig->perfil<>'ADMIN')
				$crud->where('idsucursal =', $this->userconfig->idsucursal);
			$output = $crud->render();
			$output -> op = 'user_management';
			$this->_admin_output($output);
		}else{
			$this->close();
		}
	}

	function vehicle_management()
	{
		if(($this->userconfig->perfil=='ADMIN')or($this->userconfig->perfil=='CALL')){
			$crud = new grocery_CRUD();

			$crud->set_theme('datatables');
			$crud->set_table('vehiculos');
			$crud->set_subject('Vehiculos');
			$crud->columns('placa','idsucursal','propietario','modelo','marca');
			$crud->fields('placa','idsucursal','propietario','modelo','marca');
			$crud->display_as('idsucursal', 'Institución');
			$crud->display_as('propietario', 'Ruta');
			$crud->required_fields('idsucursal','placa','propietario');

			if($this->userconfig->perfil=='ADMIN'){
				$crud->set_relation('idsucursal', 'sucursales', 'nombre');
				$crud->set_relation('propietario', 'usuarios', 'nombre','perfil IN ("CUST") ');

			}
			else{
				$crud->set_relation('idsucursal', 'sucursales', 'nombre','id IN ("'.$this->userconfig->idsucursal.'")');			
				$crud->set_relation('propietario', 'usuarios', 'nombre','perfil IN ("CUST") and idsucursal IN ("'.$this->userconfig->idsucursal.'")');
			}

			if($this->userconfig->perfil<>'ADMIN')
				$crud->where('vehiculos.idsucursal =', $this->userconfig->idsucursal);
			
			$output = $crud->render();
			$output -> op = 'user_management';
			$this->_admin_output($output);
		}else{
			$this->close();
		}
	}



	function agent_management()
	{
		if(($this->userconfig->perfil=='ADMIN')or($this->userconfig->perfil=='CALL')){
		
			$crud = new grocery_CRUD();

			$crud->set_theme('datatables');
			$crud->set_table('agente');
			$crud->set_subject('Conductores');
			//$crud->columns('nombre','idsucursal','codigo','vehiculo','pais','departamento','ciudad','direccion','telefono','fecha_localizacion');
			$crud->columns('nombre','idsucursal','codigo','vehiculo','telefono','fecha_localizacion');
			$crud->fields('nombre','idsucursal','codigo','clave','vehiculo','pais','departamento','ciudad','direccion','telefono','foto');
			$crud->required_fields('nombre','idsucursal','codigo','vehiculo','pais','departamento','ciudad','direccion','telefono');
			
			$crud->set_relation('idsucursal', 'sucursales', 'nombre');
			$crud->display_as('idsucursal', 'institución');

			$crud->display_as('codigo', 'Cedula');
			$crud->display_as('vehiculo', 'Placa');
			$crud->display_as('fecha_localizacion', 'Fec. Geolocalizacón');
			
			$crud->set_field_upload('foto','assets/images/agents');
			$crud->change_field_type('clave', 'password');
			

			if($this->userconfig->perfil=='ADMIN'){
				$crud->set_relation('idsucursal', 'sucursales', 'nombre');
				$crud->set_relation('vehiculo', 'vehiculos', 'placa');
			}
			else{
				$crud->set_relation('idsucursal', 'sucursales', 'nombre','id IN ("'.$this->userconfig->idsucursal.'")');
				$crud->set_relation('vehiculo', 'vehiculos', 'placa','idsucursal IN ("'.$this->userconfig->idsucursal.'")');
			}
	

        	$crud->callback_edit_field('clave',array($this,'set_password_input_to_empty'));
    		$crud->callback_add_field('clave',array($this,'set_password_input_to_empty'));
 
    		$crud->callback_before_update(array($this,'encrypt_password_callback'));
    		$crud->callback_before_insert(array($this,'encrypt_password_callback'));
    		
			if($this->userconfig->perfil<>'ADMIN')
				$crud->where('agente.idsucursal =', $this->userconfig->idsucursal);

			$crud->order_by('fecha_localizacion','asc');
					
			//$crud->where('codigo =', 1);
			$output = $crud->render();
			$output -> op = 'agent_management';

			$this->_admin_output($output);
		}else{
			$this->close();
		}
	}


	function callService()
	{
		//$this->load->view('private/callcenter.php',array('op' => ''));
		$this->load->view('private/callcenter.php',(object)array('output' => '' , 'js_files' => array() , 'css_files' => array() , 'op' => '' ));
	}

	
	function student_stop_management()
	{
		//$this->load->view('private/student_stop.php',array('op' => '/admin/viewstudent_stop'));
		$this->load->view('private/admin.php',(object)array('op' => 'student_stop_management','url' => '/admin/viewstudent_stop'  , 'js_files' => array() , 'css_files' => array() ));
	}

	function way_stop_management()
	{
		//$this->load->view('private/student_stop.php',array('op' => '/admin/viewstudent_stop'));
		$this->load->view('private/admin.php',(object)array('op' => 'student_stop_management','url' => '/admin/viewway_stop'  , 'js_files' => array() , 'css_files' => array() ));
	}

	function tabletCallAgent()
	{
		$this->load->view('private/admin.php',(object)array('op' => 'tabletCallAgent','url' => '/admin/viewAgent' , 'js_files' => array() , 'css_files' => array() ));
	}

	function showAgentCust()
	{
		$this->load->view('private/admin.php',(object)array('op' => 'showAgentCust','url' => '/admin/viewAgent' , 'js_files' => array() , 'css_files' => array() ));
	}
	
	function tabletAdminAgent()
	{
		$this->load->view('private/admin.php',(object)array('op' => 'tabletAdminAgent','url' => '/admin/viewAgent' , 'js_files' => array() , 'css_files' => array() ));
	}


	function student_management()
	{
		if(($this->userconfig->perfil=='ADMIN')or($this->userconfig->perfil=='CALL')){
			$crud = new grocery_CRUD();

			$crud->set_theme('datatables');
			$crud->set_table('alumno');
			$crud->set_subject('Alumnos');
			$crud->columns('codigo','idsucursal','nombre','idparada');
			$crud->fields('codigo','idsucursal','nombre','foto1','foto2','idparada');
			$crud->display_as('idsucursal', 'Institución');
			$crud->display_as('idparadas', 'Punto de parada');
			$crud->required_fields('codigo','idsucursal','nombre');
			//$crud->set_relation('idparadas', 'paradas', 'direccion');
			$crud->set_field_upload('foto1','assets/images/students');
			$crud->set_field_upload('foto2','assets/images/students');
			$crud->display_as('foto1', 'Foto uno');
			$crud->display_as('foto2', 'Foto dos');
			$crud->display_as('idparada', 'Punto de parada');
			$state = $crud->getState();
	    	$state_info = $crud->getStateInfo();
	 		$primary_key='-1';
	    	if($state == 'edit')
	    	{
	        	$primary_key = $state_info->primary_key;
	    	}
			if($this->userconfig->perfil=='ADMIN'){
				$crud->set_relation('idsucursal', 'sucursales', 'nombre');
				$crud->set_relation('idparada', 'paradas', 'descripcion', array('idalumno' => $primary_key));
			}
			else{
				$crud->set_relation('idsucursal', 'sucursales', 'nombre','id IN ("'.$this->userconfig->idsucursal.'")');			
				$crud->set_relation('idparada', 'paradas', 'descripcion', array('idalumno' => $primary_key));
			}

			if($this->userconfig->perfil<>'ADMIN')
				$crud->where('alumno.idsucursal =', $this->userconfig->idsucursal);
			
			$output = $crud->render();
			$output -> op = 'student_management';
			$this->_admin_output($output);
		}else{
			$this->close();
		}
	}

 	function paradas($idalumno){
		if(($this->userconfig->perfil=='ADMIN')or($this->userconfig->perfil=='CALL')){
		  $crud = new grocery_CRUD();
		  $crud->set_table('paradas');
		  $crud->where('idalumno', $idalumno);

		  $crud->callback_before_insert(array($this,'before_insert_paradas'));
		  $output = $crud->render();
		  $output -> op = 'viewstudent_management';
		  $this->_admin_output($output);
		  //$this->load->view('example',$output);
		}else{
				$this->close();
		}

	}
	
	function showAgent()
	{
		$this->load->view('private/callcenter.php',array('op' => '/admin/underConstuction'));
	}
	
	
	function viewstudent_stop()
	{
		$this->load->view('private/viewstudent_stop',array('op' => '/admin/viewstudent_stop'));
	}

	function viewway_stop()
	{
		$this->load->view('private/viewway_stop',array('op' => '/admin/viewway_stop'));
	}
	
	function viewAgent()
	{
		$this->load->view('private/viewAgent',array('op' => '/admin/viewAgent'));
	}
	
	function underConstuction()
	{
		$this->load->view('public/underconstuction',array('op' => ''));
	}


	public function close()
    {
    	//cerrar sesión
    	$this->session->sess_destroy();
    	redirect($user->lang.'/login'); 

    }
	
}