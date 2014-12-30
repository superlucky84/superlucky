<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Board extends CI_Controller {
	public function lists(){
		$page = $this->input->get('page');

		$this->load->model('board_model','',TRUE);
		$result = $this->board_model->lists($page);
		echo "<pre>"; print_r($result); "</pre>";

	}
	/*
	public function login(){
		$data = json_decode(file_get_contents('php://input'),true);

		$this->load->model('user_model','',TRUE);
		$id   = $data["id"];
		$pass = $data["pass"];
		$pass = md5($pass);
		$result = $this->user_model->auth($id,$pass);

		# 세션 만들기
		if($result){
			$newdata = array(
			   'id' => $id
		    );
			$this->session->set_userdata($newdata);
		}

		echo json_encode(array(
			'result' => ($result)?'true':'false'
		));
	}

	public function logout(){
		$this->session->sess_destroy();
	}

	public function signup(){
		$data = json_decode(file_get_contents('php://input'),true);

		if( !isset($data['id']) || !trim($data['id'])){
			echo json_encode(array(
				'result' => 'false',
				'msg'    => 'id_none'
			));
			exit;
		}else{
			$id = $data['id'];
		}
		if( !isset($data['pass']) || !trim($data['pass'])){
			echo json_encode(array(
				'result' => 'false',
				'msg'    => 'pass_none'
			));
			exit;
		}else{
			$pass = $data['pass'];
		}

		$this->load->model('user_model','',TRUE);

		// 있는 아이디 인지 체크
		if($this->user_model->chk_id($id)){
			echo json_encode(array(
				'result' => 'false',
				'msg'    => 'exists_id'
			));
			exit;
		}

		$pass = md5($pass);
		$result = $this->user_model->signup($id,$pass);

		echo json_encode(array(
			'result' => ($result)?'true':'false'
		));
	}
	 */
}
