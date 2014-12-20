<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Typing extends CI_Controller {
	public function prototype(){
		$data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/asset/file/ctest.txt");

		echo json_encode(array(
			'result' => 'true',
			'data'   => $data
		));

	}

}
