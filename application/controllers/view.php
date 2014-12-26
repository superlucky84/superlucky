<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class View extends CI_Controller {

   public function __construct(){
		parent::__construct();
		// 로그인 체크
		if(!$this->session->userdata('id') && $this->uri->segment(2)!='login'){
			redirect('/view/login');
		}
   }

	public function index(){
		$this->main();
	}

	/*
	 * 로그인 페이지
	 */
	public function login(){
		$this->session->sess_destroy();
		$this->load->view('login.html');
	}

	/*
	 * 메인 페이지
	 */
	public function main(){
		$this->load->view('main.html');
	}


	/*
	 * 메인 페이지
	 */
	public function typing(){
		$this->load->view('typing.html');
	}

}
