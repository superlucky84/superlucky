

// 컨트롤러 간 공유
superlucky.service('editorservice',function(){

	this.htmlspecialchars = function(str,except_tag) {
		if (typeof(str) == "string") {
			str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
			str = str.replace(/"/g, "&quot;");
			str = str.replace(/'/g, "&#039;");
			if(!except_tag){
				str = str.replace(/</g, "&lt;");
				str = str.replace(/>/g, "&gt;");
			}
			str = str.replace(/ /g, "&nbsp;");
		}
		return str;
	}
	this.rhtmlspecialchars = function(str,except_tag) {
		if (typeof(str) == "string") {
			str = str.replace(/&nbsp;/ig, " ");
			if(!except_tag){
				str = str.replace(/&gt;/ig, ">");
				str = str.replace(/&lt;/ig, "<");
			}
			str = str.replace(/&#039;/g, "'");
			str = str.replace(/&quot;/ig, '"');
			str = str.replace(/&amp;/ig, '&'); /* must do &amp; last */
		}
		return str;
	}



	this.dialog_instance = null;
	this.main_scope = null;
	this.main_scope_setting = function($scope){
		this.main_scope = $scope;
	}

})
// 다이얼로그 컨트롤러
.controller('editorDialogController', function ($scope,$http,$modal,editorservice) {


})
// 타이핑 앱 컨트롤러
.controller('editorController', function ($scope,$http,$modal,editorservice) {

	var $navbar = angular.element(document.getElementById('navbar'));
	$navbar.find("li").removeClass('active');
	angular.element(document.getElementById('editor')).addClass('active');
	angular.element(".mainpage").addClass("fl");


	// Class 정의  (판 클레스)
	function editor_pann(){

		// EDITOR NUM 판
		this.$DIV = angular.element(document.getElementById('editor_area'));
		// EDITOR 판
		this.$NUM_DIV = angular.element(document.getElementById('editor_num_area'));
		// vi모드 (NORMAL, INSERT, COMMAND)
		this.MODE = "NORMAL";
		// 행
		this.ROW    = 1;
		// 열
		this.COLUMN = 1;
		// 전체 행 개수
		this.TOTAL_ROW = 0;
		// 라인 인스턴스
		this.line_ins = null;

		this.font_width = 8;

		// 파일로드
		if(typeof this.file_load != "function"){
			editor_pann.prototype.file_load = function(){
				var _this = this;
				$http({ url: '/editor/prototype', method: "GET", async:false }).
					success(function(data){

						var pann = data.data.replace(/[\&]/g,"&amp;").replace(/[ ]/g,"&nbsp;").split(/\n/);
						//var pann = data.data.replace(/[ ]/g,"&nbsp;").split(/\n/);

						var num = 0;
						for(line_key in pann){

							var line = pann[line_key];
							if(!line){
								line = "&nbsp;";
							}
							var $SPAN = angular.element("<div class='editor_line'>"+line+"</div>"); _this.$DIV.append($SPAN);
							num = parseInt(line_key) + 1;
							_this.$NUM_DIV.append("<div class='editor_line'>"+num+"</div>");

						}
						_this.TOTAL_ROW = num;

						// 라인 인스턴스 생성
						_this.line_ins = new editor_line();

						//_this.$DIV.find("div").eq(0).addClass("linehigh");
						_this.$DIV.attr("contenteditable",true);

					}).
					error(function(data){
						alert('SERVER ERROR');
					});
			}
		}
		// 모드면경
		if(typeof this.mode_change != "function"){
			editor_pann.prototype.mode_change = function(TYPE){
				var _this = this;

				// 입력모드
				if(TYPE=="INSERT"){
					console.log("INSERT MODE");
					//_this.$DIV.attr("contenteditable",true);
					_this.MODE = "INSERT";


					//_this.$DIV.find(".editor_cursor").css("width","1px");

					document.getElementById("editor_area").focus();
					_this.$DIV.find(".editor_cursor").hide();

					// 입력 모드에 커서위치 잡기
					_this.line_ins.set_insert_cursor(_this.$DIV.find("div").eq(_this.ROW+1),_this.COLUMN);

				}
				// 일반모드
				else if(TYPE=="NORMAL"){
					console.log("NORMAL MODE");
					//_this.$DIV.attr("contenteditable",false);
					_this.MODE = "NORMAL";
					$scope.keytarget = "";

					// 커서위치 재정렬
					_this.COLUMN--;

					//_this.$DIV.find(".editor_cursor").css("width","10px");

					document.getElementById("editor_target").focus();
					_this.$DIV.find(".editor_cursor").show();

					// 일반모드에 커서위치 잡기
					var diff_len = _this.line_ins.set_normal_cursor(_this.$DIV.find("div"),_this.ROW);
					_this.COLUMN = _this.COLUMN + diff_len;

					// 컬럼리셋
					_this.line_ins.analisys(_this.$DIV.find("div").eq(_this.ROW+1));
					_this.cursor_column_reset();


				}
				// 명령모드
				else if(TYPE=="COMMAND"){
					_this.MODE = "COMMAND";
				}
			}
		}
		// 컬럼위치 재정렬
		if(typeof this.cursor_column_reset != "function"){
			editor_pann.prototype.cursor_column_reset = function(reset_type){
				var _this = this;
				if(_this.line_ins.end < _this.COLUMN && !reset_type){
					var left = (_this.line_ins.end-1) * _this.font_width;
				}else{
					var left = (_this.COLUMN-1) * _this.font_width;
				}
				_this.$DIV.find(".editor_cursor").css("left",left+"px");
			}
		}
		// 키코드 액션
		if(typeof this.key_fun != "function"){
			editor_pann.prototype.key_fun = function(keyCode){
				var _this = this;
				console.log(keyCode);


				// 입력모드일때 바인딩
				if(_this.MODE=="INSERT"){

					/*
					var orig_st = _this.$DIV.find("div").eq(_this.ROW+1).html().replace(/&nbsp;/g," ");
					var res = String.fromCharCode(keyCode);
					var pre_string  = orig_st.substr(0,_this.COLUMN-1);
					var next_string = orig_st.substring(_this.COLUMN-1,orig_st.length);
					var return_text = pre_string+res+next_string;
					return_text = return_text.replace(/ /g,"&nbsp;");
					_this.$DIV.find("div").eq(_this.ROW+1).html(return_text);
					_this.COLUMN++;
					// 커서위치 재정렬
					_this.cursor_column_reset();
					*/

				}
				// 일반모드일때 바인딩
				else if(_this.MODE=="NORMAL"){
					if([65,97,73,105,111].indexOf(keyCode) > -1){
						if(97 == keyCode){
							_this.COLUMN++;
							_this.cursor_column_reset("FORCE");
						}
						else if(65 == keyCode){
							_this.COLUMN = _this.line_ins.end+1;
							_this.cursor_column_reset("FORCE");
						}
						else if(73 == keyCode){
							_this.COLUMN = _this.line_ins.start+1;
							_this.cursor_column_reset();
						}
						_this.mode_change("INSERT");
					}
					// 왼쪽
					else if(104 == keyCode){
						if(_this.COLUMN > 1){
							if(_this.line_ins.end < _this.COLUMN){
								_this.COLUMN = _this.line_ins.end;
							}
							_this.COLUMN--;
							var left = (_this.COLUMN-1) * _this.font_width;
							_this.$DIV.find(".editor_cursor").css("left",left+"px");
						}
					}
					// 오른쪽
					else if(108 == keyCode){
						if(_this.line_ins.end > _this.COLUMN){
							if(_this.line_ins.end < _this.COLUMN){
								_this.COLUMN = _this.line_ins.end;
							}
							_this.COLUMN++;
							var left = (_this.COLUMN-1) * _this.font_width;
							_this.$DIV.find(".editor_cursor").css("left",left+"px");
						}
					}
					// 아래로
					else if(106 == keyCode){
						if(_this.ROW <= _this.TOTAL_ROW){
							_this.ROW++;

							_this.$DIV.find("div").eq(_this.ROW).removeClass("linehigh");
							_this.$DIV.find("div").eq(_this.ROW+1).addClass("linehigh");

							// 라인분석
							_this.line_ins.analisys(_this.$DIV.find("div").eq(_this.ROW+1));
							// 커서위치 재정렬
							_this.cursor_column_reset();

							var top = (_this.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");
						}
					}
					// 위로
					else if(107 == keyCode){
						if(_this.ROW > 1){
							_this.ROW--;

							_this.$DIV.find("div").eq(_this.ROW+2).removeClass("linehigh");
							_this.$DIV.find("div").eq(_this.ROW+1).addClass("linehigh");

							// 라인분석
							_this.line_ins.analisys(_this.$DIV.find("div").eq(_this.ROW+1));
							// 커서위치 재정렬
							_this.cursor_column_reset();


							var top = (_this.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");
						}
					}
					// 라인 끝으로 이동
					else if(36 == keyCode){
						_this.COLUMN = _this.line_ins.end;
						var left = (_this.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 라인 처음으로 이동
					else if(94 == keyCode){
						_this.COLUMN = _this.line_ins.start;
						var left = (_this.COLUMN) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 이동(w)
					else if(119 == keyCode){

						if(_this.line_ins.end < _this.COLUMN){
							_this.COLUMN = _this.line_ins.end;
						}

						_this.COLUMN = _this.line_ins.move_w("w",_this.COLUMN);
						var left = (_this.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 이동(w)
					else if(101 == keyCode){

						if(_this.line_ins.end < _this.COLUMN){
							_this.COLUMN = _this.line_ins.end;
						}

						_this.COLUMN = _this.line_ins.move_w("e",_this.COLUMN);
						var left = (_this.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 뒤로(b)
					else if(98 == keyCode){

						if(_this.line_ins.end < _this.COLUMN){
							_this.COLUMN = _this.line_ins.end;
						}

						_this.COLUMN = _this.line_ins.move_b(_this.COLUMN);
						var left = (_this.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}

					// 되돌리기
					else if(117 == keyCode){
						//_this.$DIV.attr("contenteditable",true);

						//document.getElementById("editor_area").focus();
						document.execCommand('undo', false, null);
						document.execCommand('undo', false, null);
						document.execCommand('undo', false, null);
						//document.getElementById("editor_target").focus();
						//document.getElementById("editor_area").execCommand('undo', false, null);
						//_this.$DIV.attr("contenteditable",false);
					}
					//else if([58].indexOf(keyCode) > -1){
						//_this.mode_change("COMMAND");
					//}
				}
			}
		}
		// 키코드 esc
		if(typeof this.key_esc != "function"){
			editor_pann.prototype.key_esc = function(keyCode){
				var _this = this;
				if(_this.MODE!="NORMAL" && keyCode==27){
					_this.mode_change("NORMAL");
				}
			}
		}
		// 키코드 잡기
		if(typeof this.keycode != "function"){
			editor_pann.prototype.keycode = function(ev){
				var keyCode = 0;
				if(ev.keyCode==0){
					keyCode = ev.which;
				}else{
					keyCode = ev.keyCode;
				}
				return keyCode;
			}
		}
	}


	// Class 정의 (라인 클레스)
	function editor_line(){

		// 시작점
		this.start = 1;
		// 종료점
		this.end = 1;
		// list_string
		this.line_string = "";

		// 라인분석
		if(typeof this.analisys != "function"){
			editor_line.prototype.analisys = function(line){

				var _this = this;
				var line_string = line.html().replace(/&nbsp;/g," ");
				line_string = line_string.replace(/&amp;/g,":");
				_this.line_string = line_string;

				//console.log(line_string.match(/([^\w ]|([ ]|[^\w])[\w])/));

				// start 구하기
				var start_match = line_string.match(/^[ ]+/);
				if(start_match){
					_this.start = start_match[0].length ;
				}else{
					_this.start = 0;
				}

				// end 구하기
				var end_match = line_string.match(/$/);
				if(end_match){
					_this.end = end_match['index'];
				}
			}
		}
		// 단어이동 forward
		if(typeof this.move_w != "function"){
			editor_line.prototype.move_w = function(move_type,start_pos){

				var _this = this;
				var line_s_cut = _this.line_string.substr(start_pos);
				var w_anal = null;

				if("w" == move_type){
					if(_this.line_string.substring(start_pos-1,start_pos).match(/[^\w ]/)){
						var w_anal = line_s_cut.match(/((^|[ ]|[^\w])[\w]|[^\w ])/);
					}else{
						var w_anal = line_s_cut.match(/(([ ]|[^\w])[\w]|[^\w ])/);
					}
				}
				else if("e" == move_type){
					var w_anal = line_s_cut.match(/([^\w ]|[\w]([ ]|[^\w]|$))/);
				}

				var cursor = start_pos;
				if(w_anal){
					cursor = w_anal['index']+start_pos;
					if(w_anal[0].substr(0,1)==" "){
						cursor = cursor+1;
					}
					cursor =  cursor+1;
				}
				return cursor;
			}
		}
		// 단어이동 back
		if(typeof this.move_b != "function"){
			editor_line.prototype.move_b = function(start_pos){
				var _this = this;
				var line_s_cut = _this.line_string.substr(0,start_pos-1);
				line_s_cut = line_s_cut.split("").reverse().join("");

				var w_anal = line_s_cut.match(/([^\w ]|[\w]([ ]|[^\w]|$))/);
				var cursor = start_pos;
				if(w_anal){

					cursor = start_pos - w_anal['index']-1;
				}
				return cursor;
			}
		}

		// 일반모드에 커서위치 잡기
		if(typeof this.set_normal_cursor != "function"){
			editor_line.prototype.set_normal_cursor = function(lines,row){
				var _this = this;
				var org_length = _this.line_string.length;
				var new_length = lines.eq(row+1).html().replace(/(&nbsp;|&amp;)/g," ").length;

				return new_length - org_length;
			}
		}

		// 입력 모드에 커서위치 잡기
		if(typeof this.set_insert_cursor != "function"){
			editor_line.prototype.set_insert_cursor = function(line,column){

				//var orig_st = line.html().replace(/&nbsp;/g," ");
				var orig_st = editorservice.rhtmlspecialchars(line.html(),true);
				var pre_string  = orig_st.substr(0,column-1);
				var next_string = orig_st.substring(column-1,orig_st.length);

				var return_text = pre_string+"<caret>caret</caret>"+next_string;
				//return_text = return_text.replace(/ /g,"&nbsp;");
				return_text = editorservice.htmlspecialchars(return_text,true);

				//console.log(return_text);
				line.html(return_text);
				var cc = line.find("caret")[0];
				var range = document.createRange();
				range.selectNode(cc);
				var selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
				range.deleteContents();

			}
		}

	}
	// Class 정의 (블럭클레스)
	function editor_block(){
	}

	// 인스턴스 생성
	var editorPann = new editor_pann();
	editorPann.file_load();

	$scope.key_press = function(event){
		var keyCode = editorPann.keycode(event);

		
		editorPann.key_fun(keyCode);
	}
	$scope.key_down = function(event){
		var keyCode = editorPann.keycode(event);
		editorPann.key_esc(keyCode);
	}
	$scope.key_blur = function(event){
		console.log(editorPann.MODE);
		if(editorPann.MODE == "NORMAL"){
			document.getElementById("editor_target").focus();
		}
		else if(editorPann.MODE == "INSERT"){
			document.getElementById("editor_area").focus();
		}
	}
	document.getElementById("editor_target").focus();

});
