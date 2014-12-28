<?php
class User_model extends CI_Model {
    function __construct()
    {
        parent::__construct();
    }

	function chk_id($id){
		$this->db->select('id');
		$this->db->where(array(
			'id'   => $id,
		));

		$query = $this->db->get('users');
		$res = $query->result_array();

		if(count($res) > 0){
			return true;
		}else{
			return false;
		}
	}

	function auth($id,$pass){
		$this->db->select('id');
		$this->db->where(array(
			'id'   => $id,
			'pass' => $pass
		));

		$query = $this->db->get('users');
		$res = $query->result_array();

		if(count($res) > 0){
			return true;
		}else{
			return false;
		}
	}

	function signup($id,$pass){

		$data = array(
		   'id'        => $id,
		   'title'     => $id,
		   'pass'      => $pass,
		   'regdate'   => date("Y-m-d H:i:s"),
		   'logindate' => date("Y-m-d H:i:s")
		);

		$res = $this->db->insert('users', $data); 
		if($res){
			return true;
		}else{
			return false;
		}
	}

}
?>
