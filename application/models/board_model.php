<?php
class Board_model extends CI_Model {
    function __construct()
    {
        parent::__construct();
    }

	function lists($page){
		//$this->db->select('id');
		//$this->db->where(array(
			//'id'   => $id,
		//));

		$query = $this->db->get('board');
		$res = $query->result_array();

		if(count($res) > 0){
			return $res;
		}else{
			return false;
		}
	}


}
?>
