<?php
class User_model extends CI_Model {
    function __construct()
    {
        parent::__construct();
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
}
?>
