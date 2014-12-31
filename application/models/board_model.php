<?php
class Board_model extends CI_Model {
    function __construct()
    {
        parent::__construct();
    }

	function lists_total($id){

		$this->db->where(array(
			'id'   => $id,
		));
		$this->db->from('board');
		return $this->db->count_all_results();

	}

	function lists($id,$page,$page_range){

		$return = array();

		$return["total"] = $this->lists_total($id);

		$offset = ($page-1) * $page_range;

		$noseq = $return["total"] - ($page_range * ($page-1));

		$this->db->where(array(
			'id'   => $id,
		));

		$query = $this->db->get('board',$page_range,$offset);
		$return["items"] = $query->result_array();


		if(count($return["items"]) > 0){
			foreach($return["items"] as $key => $value){
				$return["items"][$key]['no'] = $noseq--;
				$return["items"][$key]['regdate'] = substr($value['regdate'],0,16);
				$return["items"][$key]['moddate'] = substr($value['moddate'],0,16);
			}

			return $return;
		}else{
			return false;
		}
	}


}
?>
