<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Board extends CI_Controller {

	/*
	 * 글목록
	 */
	public function lists(){

		$this->load->model('user_model','',TRUE);
		$this->load->model('board_model','',TRUE);

		$user_id = $this->input->get('user_id');
		$page    = $this->input->get('page');

		$user_info = $this->user_model->id_get($user_id);
		$user_seq = $user_info['user_seq'];

		$data = $this->board_model->lists($user_seq,$page,5);

		echo json_encode(array(
			'result'   => 'true',
			'data'     => $data["items"],
			'contents' => $data["contents"],
			'paging'   => $data["paging"]
		));
	}

	/*
	 * 글쓰기
	 */
	public function write(){


		$this->load->model('user_model','',TRUE);
		$this->load->model('board_model','',TRUE);

		$data = json_decode(file_get_contents('php://input'),true);


		if( !isset($data['user_id']) || !trim($data['user_id'])){
			echo json_encode(array(
				'result' => 'false',
				'msg'    => 'id_none'
			));
			exit;
		}else{
			$user_info = $this->user_model->id_get($data['user_id']);
			$user_seq = $user_info['user_seq'];

			$write_user_info = $this->user_model->id_get($this->session->userdata('id'));
			$write_user_seq = $write_user_info['user_seq'];
		}

		if( !isset($data['subject']) || !trim($data['subject'])){
			echo json_encode(array(
				'result' => 'false',
				'msg'    => 'subject_none'
			));
			exit;
		}else{
			$subject = $data['subject'];
		}

		if( !isset($data['category']) || !trim($data['category'])){
			echo json_encode(array(
				'result' => 'false',
				'msg'    => 'category_none'
			));
			exit;
		}else{
			$category = $data['category'];
		}

		$contents = $data['contents'];

		$result = $this->board_model->write($user_seq,$write_user_seq,$category,$subject,$contents);

		echo json_encode(array(
			'result' => ($result)?'true':'false'
		));
	}

}
