<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Typing extends CI_Controller {
	public function prototype(){

		$page = $this->input->get('page');
		$page_range = $this->input->get('page_range');

		$start = $page_range * ($page-1);
		$end = ($start + $page_range)-1;


		$string = file_get_contents($_SERVER['DOCUMENT_ROOT']."/asset/file/ctest.txt");

		$string = preg_replace("@/\*[^>]*?\*/@","",$string);
		$string = preg_replace("@([\s]*)?//.*@","",$string);

		$string = preg_replace("/\t/","    ",$string);
		$string = preg_replace("/\n\r/","\n",$string);
		$string = preg_replace("/\r/","\n",$string);
		$string = preg_replace("/[ㄱ-ㅎ가-힣]/","\n",$string);
		$string = trim($string);
		$data_array = explode("\n",$string);

		$data = "";
		for($i=$start ; $i <= $end ; $i++){
			//echo $i."<br>";
			$data .= $data_array[$i]."\n";
		}

		echo json_encode(array(
			'result' => 'true',
			'data'   => $data
		));
	}

}
