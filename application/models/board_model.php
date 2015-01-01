<?php
class Board_model extends CI_Model {
    function __construct()
    {
        parent::__construct();
    }

	function lists_total($user_seq){

		$this->db->where(array(
			'user_seq'   => $user_seq
		));
		$this->db->from('board');
		return $this->db->count_all_results();

	}

	function lists($user_seq,$page,$page_range){

		$return = array();

		// TOTAL COUNT
		$return["total"] = $this->lists_total($user_seq);

		// OFFSET
		$offset = ($page-1) * $page_range;

		// ROW NO
		$noseq = $return["total"] - ($page_range * ($page-1));

		// PAGING RANGE
		$paging_range = 10;
		$return['paging']['paging_range'] = $paging_range;

		// PAGING TOTAL
		$paging_total = ceil($return["total"] / $page_range);
		$return['paging']['total'] = $paging_total;

		// PAGING START
		$paging_start = floor($paging_range / 2);
		$paging_start = $page - $paging_start;

		if($paging_start < 1){
			$paging_start = 1;
		}

		// PAGING END
		$paging_end = $paging_start + ($paging_range-1);
		if($paging_end > $paging_total){
			$paging_end = $paging_total;
			$paging_start = $paging_end-$paging_range+1;
			if($paging_start < 1){
				$paging_start = 1;
			}
		}

		$return['paging']['start'] = $paging_start;
		$return['paging']['end']   = $paging_end;

		$this->db->where(array(
			'user_seq'   => $user_seq,
		));

		$this->db->order_by("regdate", "desc");

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

	function write($user_seq,$write_user_seq,$category,$subject,$contents){

		$data = array(
		   'user_seq'       => $user_seq,
		   'write_user_seq' => $write_user_seq,
		   'category'       => $category,
		   'subject'        => $subject,
		   'contents'       => $contents,
		   'regdate'        => date("Y-m-d H:i:s"),
		   'moddate'        => date("Y-m-d H:i:s")
		);

		$res = $this->db->insert('board', $data); 
		if($res){
			return true;
		}else{
			return false;
		}

	}


}
?>
