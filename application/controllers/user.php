<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User extends CI_Controller {
	public function login()
	{
		$this->load->model('user_model','',TRUE);
		$id   = "superlucky";
		$pass = "a";
		$pass = md5($pass);

		$result = $this->user_model->auth($id,$pass);
		echo $result;
	}
}
