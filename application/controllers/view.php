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

		$this->load->view('main.html',array(
			'version' => date("Ymd")."-16",
			'user_id' => $this->session->userdata('id')
		));
	}


	/*
	 * 타이핑 페이지
	 */
	public function typing(){
		$this->load->view('typing.html');
	}

	/*
	 * 게시판 페이지
	 */
	public function board(){
		$this->load->view('board.html');
	}

	/*
	 * 에디터 페이지
	 */
	public function editor(){
		$this->load->view('editor.html');
	}

	/*
	 * 채팅 메세지 보낼때 세션유지
	 */
	public function chat_session_update(){
	}

}
