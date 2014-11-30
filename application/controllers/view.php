<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class View extends CI_Controller {

	public function index(){
		$this->main();
	}

	/*
	 * 로그인 페이지
	 */
	public function login(){
		$this->load->view('login.html');
	}

	/*
	 * 메인 페이지
	 */
	public function main(){
		$this->load->view('main.html');
	}

}
