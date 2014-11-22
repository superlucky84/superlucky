<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
?>

<script type="text/javascript" src="<?=$g4[path];?>/js/zip.js"></script>

<style>
.pg_wrap {clear:both;margin:0 0 20px;padding:20px 0 0;text-align:center}
.pg {}
.pg_page, .pg_current {display:inline-block;padding:0 8px;height:25px;color:#000;letter-spacing:0;line-height:2.2em;vertical-align:middle}
.pg a:focus, .pg a:hover {text-decoration:none}
.pg_page {background:#e4eaec;text-decoration:none}
.pg_start, .pg_prev {/* 이전 */}
.pg_end, .pg_next {/* 다음 */}
.pg_current {display:inline-block;background:#333;color:#fff;font-weight:normal}
.sound_only {display:none}

#result {margin:0}
#result_b4 {display:block;padding:30px 0;text-align:center}
#result .result_msg {padding:15px 0}
#result .result_fail {border:1px solid #dde4e9;background:#f0f5fc;color:#ff3061;text-align:center}
#result ul {margin:0;padding:0;border-bottom:1px solid #dde4e9;background:#f0f5fc;list-style:none}
#result li {padding:10px;border:1px solid #dde4e9;border-bottom:0}
#result li div {margin:4px 0 0;color:#738D94}
#result li div:before {content:"▶ "}
</style>

<table width="600" height="50" border="0" cellpadding="0" cellspacing="0">
<tr>
    <td align="center" valign="middle" bgcolor="#EBEBEB">
        <table width="590" height="40" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td width="25" align="center" bgcolor="#FFFFFF" ><img src="<?=$member_skin_path?>/img/icon_01.gif" width="5" height="5"></td>
            <td bgcolor="#FFFFFF" ><font color="#666666"><b><?=$g4[title]?></b></font></td>
        </tr>
        </table></td>
</tr>
</table>

<table>
<tr>
    <td></td>
</tr>
</table>

<p style="padding:0 20px">
    시도 및 시군구 선택없이 도로명, 읍/면/동, 건물명 등으로 검색하실 수 있습니다.<br>
    만약 검색결과에 찾으시는 주소가 없을 때는 시도와 시군구를 선택하신 후 다시 검색해 주십시오.<br>
    (검색결과는 최대 1,000건만 표시됩니다.)
</p>

<form name="fzip" method="get" onsubmit="search_call(); return false;" autocomplete="off">
<!-- 검색어 입력 시작 { -->
<table width="600" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td align="center">
        <table width="566" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td bgcolor="#CCCCCC">
                <table width="100%" cellspacing="1" cellpadding="5">
                <tr>
                    <td bgcolor="#F7F7F7"><label for="sido">시도선택</label></td>
                    <td bgcolor="#FFFFFF">
                        <select name="sido" id="sido">
                            <option value="">- 시도 선택 -</option>
                        </select>
                    </td>
                    <td bgcolor="#F7F7F7"><label for="gugun">시군구</label></td>
                    <td bgcolor="#FFFFFF">
                        <select name="gugun" id="gugun">
                            <option value="">- 시군구 선택 -</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#F7F7F7"><label for="q">검색어</label></td>
                    <td colspan="3" bgcolor="#FFFFFF">
                        <input type="text" name="q" value="" id="q" required itemname="검색어" class="ed" style="vertical-align:middle">
                        <input type="image" src="<?=$member_skin_path?>/img/btn_post_search.gif" alt="검색" border="0" align="absmiddle">
                    </td>
                </tr>
                </table>
            </td>
        </tr>
        </table>
    </td>
</tr>
</table>
<!-- } 검색어 입력 끝 -->
</form>

<div id="result" style="padding:0 20px"><span id="result_b4" style="display:block;padding:20px 0;text-align:center">검색어를 입력해주세요.</span></div>

<table width="600">
<tr>
    <td height="40" align="center" valign="bottom"><a href="javascript:window.close();"><img src="<?=$member_skin_path?>/img/btn_close.gif" width="48" height="20" border="0"></a><br><br></td>
</tr>
</table>

<script type="text/javascript">
function put_data(zip1, zip2, addr1, addr3, jibeon)
{
    var of = window.opener.document.<?php echo $frm_name; ?>;

    of.<?php echo $frm_zip1; ?>.value = zip1;
    of.<?php echo $frm_zip2; ?>.value = zip2;
    of.<?php echo $frm_addr1; ?>.value = addr1;
    of.<?php echo $frm_addr2; ?>.value = "";
    of.<?php echo $frm_addr3; ?>.value = addr3;

    $('#<?php echo $frm_jibeon; ?>', opener.document).text("지번주소 : "+jibeon);

    if(of.<?php echo $frm_jibeon; ?> !== undefined)
        of.<?php echo $frm_jibeon; ?>.value = jibeon;

    window.close();
}
</script>