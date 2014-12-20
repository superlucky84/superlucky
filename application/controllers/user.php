<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User extends CI_Controller {
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
}
