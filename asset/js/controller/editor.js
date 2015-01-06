

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
		// 전체 행 개수
		this.TOTAL_ROW = 0;
		// 라인 인스턴스
		this.line_ins = null;
		// 커서 인스턴스
		this.cur_ins = null;
		// 폰트 넓이
		this.font_width = 9;
		// 폰트 높이
		this.font_height = 16;

		// 일반모드 QUEUE
		this.common_queue = [];
		// 이벤트
		this.event_memory = null;

		// 판 시작라인
		this.START_ROW = 1;
		// 판 끝라인
		this.END_ROW =   1;
		// 판 전체라인 
		this.PANN_ROW =   1;
		// 판 높이 px
		this.PANN_HEIGHT = 0;

		this.key_shift_rule = { 'A' : "a", 'B' : "b", 'C' : "c", 'D' : "d", 'E' : "e", 'F' : "f", 'G' : "g", 'H' : "h", 'I' : "i", 'J' : "j", 'K' : "k", 'L' : "l", 'M' : "m", 'N' : "n", 'O' : "o", 'P' : "p", 'Q' : "q", 'R' : "r", 'S' : "s", 'T' : "t", 'U' : "u", 'V' : "v", 'W' : "w", 'X' : "x", 'Y' : "y", 'Z' : "z", "1" : "!", "2" : "@", "3" : "#", "4" : "$", "5" : "%", "6" : "^", "7" : "&", "8" : "*", "9" : "(", "0" : ")" };


		// 입력모드 queue insert
		if(typeof this.queue_insert != "function"){
			editor_pann.prototype.queue_insert = function(qchar){
				var _this = this;
				_this.common_queue.push(qchar);
				if(_this.common_queue.length > 3){
					_this.common_queue.splice(0,_this.common_queue.length-3);
				}
			}
		}
		// 입력모드 queue get
		if(typeof this.queue_get != "function"){
			editor_pann.prototype.queue_get = function(count){
				var _this = this;
				return _this.common_queue.slice(_this.common_queue.length-count,_this.common_queue.length);
			}
		}

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
							var $SPAN = angular.element("<pre class='editor_line'>"+line+"</pre>"); 
							_this.$DIV.append($SPAN);
							num = parseInt(line_key) + 1;
							_this.$NUM_DIV.append("<div class='editor_line'>"+num+"</div>");

						}
						_this.TOTAL_ROW = num;

						// 라인 인스턴스 생성
						_this.line_ins = new editor_line();

						// 커서 인스턴스 생성
						_this.cur_ins = new editor_cursor(_this.font_width,_this.$DIV.find(".editor_cursor"));


						console.log(_this.cur_ins.ROW);
						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
						_this.$DIV.attr("contenteditable",false);

						_this.cur_ins.cursor_blink();
						
						// PANN 높이 고정
						_this.pann_resize();
					}).
					error(function(data){
						alert('SERVER ERROR');
					});
			}
		}
		// 판 높이 다시계산
		if(typeof this.pann_resize != "function"){
			editor_pann.prototype.pann_resize = function(){
				var _this = this;

				_this.PANN_HEIGHT = parseInt(window.innerHeight-130);
				_this.PANN_HEIGHT = (Math.floor(_this.PANN_HEIGHT/16)) * 16;
				console.log(_this.PANN_HEIGHT);
				angular.element("#editor_pann").css("height",_this.PANN_HEIGHT+"px");
				
				// PANN ROW
				_this.PANN_ROW = Math.floor(_this.PANN_HEIGHT / _this.font_height);
				console.log(_this.PANN_ROW);

			}
		}


		// 모드면경
		if(typeof this.mode_change != "function"){
			editor_pann.prototype.mode_change = function(TYPE){
				var _this = this;

				// 입력모드
				if(TYPE=="INSERT"){
					console.log("INSERT MODE");
					_this.$DIV.attr("contenteditable",true);
					_this.MODE = "INSERT";

					// 커서 숨기기
					_this.cur_ins.cursor_blink_stop('hide');

					//_this.$DIV.find(".editor_cursor").css("width","1px");

					document.getElementById("editor_area").focus();


					// 디자인 모드 변경시 문자 안들어 가도록 함
					editorPann.event_memory.preventDefault();

					// 입력 모드에 커서위치 잡기
					_this.cur_ins.set_insert_cursor(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));


					// 판 scrollTop
					han_px = (_this.START_ROW-1) * _this.font_height;
					angular.element("#editor_pann")[0].scrollTop=han_px;

				}
				// 일반모드
				else if(TYPE=="NORMAL"){
					console.log("NORMAL MODE");
					_this.$DIV.attr("contenteditable",false);
					_this.MODE = "NORMAL";
					$scope.keytarget = "";

					// 커서위치 재정렬
					_this.cur_ins.COLUMN--;

					//_this.$DIV.find(".editor_cursor").css("width","10px");

					document.getElementById("editor_target").focus();

					// 일반모드에 커서위치 잡기
					_this.cur_ins.set_normal_cursor(_this.line_ins.line_string,_this.$DIV.find("pre"));


					// 라인 정보 다시분석
					_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));

					// 컬럼리셋
					_this.cur_ins.cursor_column_reset(_this.line_ins.end);
					
					// 커서 출현시키기
					_this.cur_ins.cursor_blink();


				}
				// 명령모드
				else if(TYPE=="COMMAND"){
					_this.MODE = "COMMAND";
				}
			}
		}
		// 키코드 액션
		if(typeof this.key_fun != "function"){
			editor_pann.prototype.key_fun = function(keyCode,keyChar,ctrlKey){
				var _this = this;


				// 큐에 넣기
				//_this.queue_insert(String.fromCharCode(keyCode));
				_this.queue_insert(keyChar);

				console.log(_this.common_queue);

				// 일반모드로 변환 (ESC)
				if(_this.MODE!="NORMAL" && keyCode==27){
					_this.mode_change("NORMAL");
				}



				// 입력모드일때 바인딩
				if(_this.MODE=="INSERT"){

					/*
					var orig_st = _this.$DIV.find("div").eq(_this.ROW+1).html().replace(/&nbsp;/g," ");
					var res = String.fromCharCode(keyCode);
					var pre_string  = orig_st.substr(0,_this.cur_ins.COLUMN-1);
					var next_string = orig_st.substring(_this.cur_ins.COLUMN-1,orig_st.length);
					var return_text = pre_string+res+next_string;
					return_text = return_text.replace(/ /g,"&nbsp;");
					_this.$DIV.find("div").eq(_this.ROW+1).html(return_text);
					_this.cur_ins.COLUMN++;
					// 커서위치 재정렬
					_this.cur_ins.cursor_column_reset();
					*/

				}
				// 일반모드일때 바인딩
				else if(_this.MODE=="NORMAL"){

					//_this.cur_ins.cursor_blink_stop('show');
					_this.cur_ins.$CURSOR_DIV.show();

					// 한페이지 뒤로
					if(ctrlKey && "f" == keyChar){
						var han = _this.PANN_ROW;
						var han_px =  han * _this.font_height;

						_this.START_ROW += han;

						if( (_this.START_ROW + _this.PANN_ROW) > _this.TOTAL_ROW){
							_this.START_ROW = _this.TOTAL_ROW - _this.PANN_ROW;
						}

						han_px = (_this.START_ROW-1) * _this.font_height;
						angular.element("#editor_pann")[0].scrollTop=han_px;

						_this.cur_ins.ROW += han;
						if(_this.cur_ins.ROW > _this.TOTAL_ROW){
							_this.cur_ins.ROW = _this.TOTAL_ROW;
						}
						var top = (_this.cur_ins.ROW-1) * 16;
						_this.$DIV.find(".editor_cursor").css("top",top+"px");

						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));

						//console.log(_this.START_ROW);
					}
					// 한페이지 앞으로
					else if(ctrlKey && "b" == keyChar){
						var han = _this.PANN_ROW;
						var han_px =  han * _this.font_height;

						_this.START_ROW -= han;
						if(_this.START_ROW < 1){
							_this.START_ROW = 1;
						}

						han_px = (_this.START_ROW-1) * _this.font_height;
						angular.element("#editor_pann")[0].scrollTop=han_px;

						_this.cur_ins.ROW -= han;
						if(_this.cur_ins.ROW < 1){
							_this.cur_ins.ROW = 1;
						}
						var top = (_this.cur_ins.ROW-1) * 16;
						_this.$DIV.find(".editor_cursor").css("top",top+"px");

						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));

						//console.log(_this.START_ROW);

					}

					// 반페이지 뒤로
					else if(ctrlKey && "d" == keyChar){
						var ban = Math.floor(_this.PANN_ROW / 2);
						var ban_px =  ban * _this.font_height;

						_this.START_ROW += ban;

						if( (_this.START_ROW + _this.PANN_ROW) > _this.TOTAL_ROW){
							_this.START_ROW = _this.TOTAL_ROW - _this.PANN_ROW;
						}

						ban_px = (_this.START_ROW-1) * _this.font_height;
						angular.element("#editor_pann")[0].scrollTop=ban_px;

						_this.cur_ins.ROW += ban;
						if(_this.cur_ins.ROW > _this.TOTAL_ROW){
							_this.cur_ins.ROW = _this.TOTAL_ROW;
						}

						var top = (_this.cur_ins.ROW-1) * 16;
						_this.$DIV.find(".editor_cursor").css("top",top+"px");

						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));

						//console.log(_this.START_ROW);
					}
					// 반페이지 앞으로
					else if(ctrlKey && "u" == keyChar){
						var ban = Math.floor(_this.PANN_ROW / 2);
						var ban_px =  ban * _this.font_height;

						_this.START_ROW -= ban;
						if(_this.START_ROW < 1){
							_this.START_ROW = 1;
						}

						ban_px = (_this.START_ROW-1) * _this.font_height;
						angular.element("#editor_pann")[0].scrollTop=ban_px;

						_this.cur_ins.ROW -= ban;
						if(_this.cur_ins.ROW < 1){
							_this.cur_ins.ROW = 1;
						}
						var top = (_this.cur_ins.ROW-1) * 16;
						_this.$DIV.find(".editor_cursor").css("top",top+"px");

						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));

						//console.log(_this.START_ROW);

					}
					// 첫번째 줄로 이동
					else if('gg' == _this.queue_get(2).join('')){
							_this.cur_ins.ROW = 1;

							// 라인분석
							_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
							// 커서위치 재정렬
							_this.cur_ins.cursor_column_reset(_this.line_ins.end);

							var top = (_this.cur_ins.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");

							// 판을 처음으로 이동
							_this.START_ROW = 1;
							angular.element("#editor_pann")[0].scrollTop=0;

					}
					// 마지막 줄로 이동
					else if('G' == keyChar){
							_this.cur_ins.ROW = _this.TOTAL_ROW;

							// 라인분석
							console.log(_this.cur_ins.ROW);
							_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
							// 커서위치 재정렬
							_this.cur_ins.cursor_column_reset(_this.line_ins.end);

							var top = (_this.cur_ins.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");

							// 판을 마지막으로 이동
							_this.START_ROW = _this.TOTAL_ROW - _this.PANN_ROW + 1;
							var move_pann = (_this.START_ROW-1) * _this.font_height;
							angular.element("#editor_pann")[0].scrollTop=move_pann;
					}
					// 줄삭제
					else if('dd' == _this.queue_get(2).join('')){
						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW));
						// queue 비우기
						_this.common_queue = [];
					}
					// 모드변경
					else if(["A","a","I","O","i","o"].indexOf(keyChar) > -1){
						if("a" == keyChar){
							_this.cur_ins.COLUMN++;
							_this.cur_ins.cursor_column_reset(_this.line_ins.end,"FORCE");
						}
						else if("A" == keyChar){
							_this.cur_ins.COLUMN = _this.line_ins.end+1;
							_this.cur_ins.cursor_column_reset(_this.line_ins.end,"FORCE");
						}
						else if("I" == keyChar){
							_this.cur_ins.COLUMN = _this.line_ins.start+1;
							_this.cur_ins.cursor_column_reset(_this.line_ins.end);
						}
						else if("O" == keyChar){
							_this.$DIV.find("pre").eq(_this.cur_ins.ROW-2).after("<pre class='editor_line'></pre>");
							//_this.cur_ins.ROW--;
							_this.cur_ins.COLUMN = 1;
							_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));

						}
						else if("o" == keyChar){
							_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1).after("<pre class='editor_line'></pre>");
							_this.cur_ins.ROW++;
							_this.cur_ins.COLUMN = 1;
							_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
						}
						_this.mode_change("INSERT");
					}
					// 한글자 삭제
					else if("x" == keyChar){
						var orig_st = _this.$DIV.find("pre").eq(_this.cur_ins.ROW).html().replace(/&nbsp;/g," ");
						var pre_string  = orig_st.substr(0,_this.cur_ins.COLUMN-2);
						var next_string = orig_st.substring(_this.cur_ins.COLUMN,orig_st.length);
						var return_text = pre_string+next_string;
						return_text = return_text.replace(/ /g,"&nbsp;");
						_this.$DIV.find("pre").eq(_this.cur_ins.ROW).html(return_text);
						// 커서위치 재정렬
						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW));
					}
					// 판의 처음으로 이동
					else if("H" == keyChar){
						_this.cur_ins.ROW = _this.START_ROW;
						var top = (_this.cur_ins.ROW-1) * 16;
						_this.$DIV.find(".editor_cursor").css("top",top+"px");

						// 라인분석
						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
					}
					// 판의 중간으로 이동
					else if("M" == keyChar){
						_this.cur_ins.ROW = _this.START_ROW + Math.floor(_this.PANN_ROW/2) -1;
						var top = (_this.cur_ins.ROW-1) * 16;
						_this.$DIV.find(".editor_cursor").css("top",top+"px");

						// 라인분석
						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
					}
					// 판의 마지막으로 이동
					else if("L" == keyChar){
						_this.cur_ins.ROW = _this.START_ROW + _this.PANN_ROW -1;
						var top = (_this.cur_ins.ROW-1) * 16;
						_this.$DIV.find(".editor_cursor").css("top",top+"px");

						// 라인분석
						_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
					}
					// 왼쪽
					else if("h" == keyChar){
						if(_this.cur_ins.COLUMN > 1){
							if(_this.line_ins.end < _this.cur_ins.COLUMN){
								_this.cur_ins.COLUMN = _this.line_ins.end;
							}
							_this.cur_ins.COLUMN--;
							var left = (_this.cur_ins.COLUMN-1) * _this.font_width;
							_this.$DIV.find(".editor_cursor").css("left",left+"px");
						}
					}
					// 오른쪽
					else if("l" == keyChar){
						if(_this.line_ins.end > _this.cur_ins.COLUMN){
							if(_this.line_ins.end < _this.cur_ins.COLUMN){
								_this.cur_ins.COLUMN = _this.line_ins.end;
							}
							_this.cur_ins.COLUMN++;
							var left = (_this.cur_ins.COLUMN-1) * _this.font_width;
							_this.$DIV.find(".editor_cursor").css("left",left+"px");
						}
					}
					// 아래로
					else if("j" == keyChar){
						if(_this.cur_ins.ROW <= _this.TOTAL_ROW){
							_this.cur_ins.ROW++;

							if( (_this.START_ROW + _this.PANN_ROW) <= _this.cur_ins.ROW){
								_this.START_ROW = (_this.cur_ins.ROW+1) - _this.PANN_ROW;

								var move_pann = (_this.START_ROW-1) * _this.font_height;
								angular.element("#editor_pann")[0].scrollTop=move_pann;
							}

							// 라인분석
							_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
							// 커서위치 재정렬
							_this.cur_ins.cursor_column_reset(_this.line_ins.end);

							var top = (_this.cur_ins.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");
						}
					}
					// 위로
					else if("k" == keyChar){
						if(_this.cur_ins.ROW > 1){
							_this.cur_ins.ROW--;

							if( _this.START_ROW > _this.cur_ins.ROW){
								_this.START_ROW = _this.cur_ins.ROW;

								var move_pann = (_this.START_ROW-1) * _this.font_height;
								angular.element("#editor_pann")[0].scrollTop=move_pann;
							}

							// 라인분석
							_this.line_ins.analisys(_this.$DIV.find("pre").eq(_this.cur_ins.ROW-1));
							// 커서위치 재정렬
							_this.cur_ins.cursor_column_reset(_this.line_ins.end);

							var top = (_this.cur_ins.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");
						}
					}
					// 라인 끝으로 이동
					else if("$" == keyChar){
						_this.cur_ins.COLUMN = _this.line_ins.end;
						var left = (_this.cur_ins.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 라인 처음으로 이동
					else if("^" == keyChar){
						_this.cur_ins.COLUMN = _this.line_ins.start+1;
						var left = (_this.cur_ins.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 이동(w)
					else if("w" == keyChar){

						if(_this.line_ins.end < _this.cur_ins.COLUMN){
							_this.cur_ins.COLUMN = _this.line_ins.end;
						}

						_this.cur_ins.COLUMN = _this.line_ins.move_w("w",_this.cur_ins.COLUMN);
						var left = (_this.cur_ins.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 이동(w)
					else if("e" == keyChar){

						if(_this.line_ins.end < _this.cur_ins.COLUMN){
							_this.cur_ins.COLUMN = _this.line_ins.end;
						}

						_this.cur_ins.COLUMN = _this.line_ins.move_w("e",_this.cur_ins.COLUMN);
						var left = (_this.cur_ins.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 뒤로(b)
					else if("b" == keyChar){

						if(_this.line_ins.end < _this.cur_ins.COLUMN){
							_this.cur_ins.COLUMN = _this.line_ins.end;
						}

						_this.cur_ins.COLUMN = _this.line_ins.move_b(_this.cur_ins.COLUMN);
						var left = (_this.cur_ins.COLUMN-1) * _this.font_width;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}

					// 되돌리기
					else if("u" == keyChar){

						//document.getElementById("editor_area").focus();
						document.execCommand('undo', false, null);
						document.execCommand('undo', false, null);
						document.execCommand('undo', false, null);
						//document.getElementById("editor_target").focus();
					}
					//else if([58].indexOf(keyCode) > -1){
						//_this.mode_change("COMMAND");
					//}

					//_this.cur_ins.cursor_blink();

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

				var _this = this;

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



	}
	// Class 정의 (커서클레스)
	function editor_cursor(font_width,$CURSOR_DIV){
		// 행
		this.ROW    = 1;
		// 열
		this.COLUMN = 1;
		// 폰트 넓이
		this.font_width = font_width;
		// 커서 돔 객체
		this.$CURSOR_DIV = $CURSOR_DIV;
		this.cursor_interval = null;

		if(typeof this.cursor_blink != "function"){
			editor_cursor.prototype.cursor_blink = function(){
				var _this = this;
				_this.$CURSOR_DIV.show();
				_this.cursor_interval = setInterval(function(){
					if(_this.$CURSOR_DIV.css('display')=='block'){
						_this.$CURSOR_DIV.hide();

					}else{
						_this.$CURSOR_DIV.show();
					}
				},350);
			}
		}
		if(typeof this.cursor_blink_stop != "function"){
			editor_cursor.prototype.cursor_blink_stop = function(show_hide){
				var _this = this;

				if('show'==show_hide){
					_this.$CURSOR_DIV.show();
				}else{
					_this.$CURSOR_DIV.hide();
				}
				clearInterval(_this.cursor_interval);
				_this.cursor_interval = null;
			}
		}

		// 컬럼위치 재정렬
		// reset_type 이 있을경우 line_ins.end값 무시
		if(typeof this.cursor_column_reset != "function"){
			editor_cursor.prototype.cursor_column_reset = function(line_end,reset_type){
				var _this = this;

				if(line_end < _this.COLUMN && !reset_type){
					var left = (line_end-1) * _this.font_width;
				}else{
					var left = (_this.COLUMN-1) * _this.font_width;
				}
				_this.$CURSOR_DIV.css("left",left+"px");

				var top = (_this.ROW-1) * 16;
				_this.$CURSOR_DIV.css("top",top+"px");

			}
		}
		// 일반모드에 커서위치 잡기
		if(typeof this.set_normal_cursor != "function"){
			editor_cursor.prototype.set_normal_cursor = function(line_string,lines){
				var _this = this;
				var org_length = line_string.length;
				var new_length = lines.eq(_this.ROW-1).html().replace(/(&nbsp;|&amp;)/g," ").length;
				var diff_len = new_length - org_length;
				_this.COLUMN = _this.COLUMN + diff_len;
			}
		}
		// 입력 모드에 커서위치 잡기
		if(typeof this.set_insert_cursor != "function"){
			editor_cursor.prototype.set_insert_cursor = function(line){
				var _this = this;

				//var orig_st = line.html().replace(/&nbsp;/g," ");
				var orig_st = editorservice.rhtmlspecialchars(line.html(),true);
				var pre_string  = orig_st.substr(0,_this.COLUMN-1);
				var next_string = orig_st.substring(_this.COLUMN-1,orig_st.length);

				var return_text = pre_string+"<caret>caret</caret>"+next_string;
				return_text = editorservice.htmlspecialchars(return_text,true);

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

	// 인스턴스 생성
	var editorPann = new editor_pann();
	editorPann.file_load();


	angular.element(window).resize(function(){
		editorPann.pann_resize();
	});

	$scope.key_down = function(event){
		editorPann.event_memory = event;

		var keyCode = editorPann.keycode(event);

		var keyChar = String.fromCharCode(keyCode);
		if(keyChar.match(/[0-9]/) && event.shiftKey){
			keyChar = editorPann.key_shift_rule[keyChar];
		}
		if(keyChar.match(/[A-Z]/) && !event.shiftKey){
			keyChar = editorPann.key_shift_rule[keyChar];
		}

		editorPann.key_fun(keyCode,keyChar,event.ctrlKey);

		if(event.ctrlKey){
			event.preventDefault();
		}
	}
	$scope.key_blur = function(event){
		if(editorPann.MODE == "NORMAL"){
			//document.getElementById("editor_target").focus();
			//$("#editor_target").focus();

			setTimeout(function() {
				$("#editor_target").focus();
			}, 0);

		}
		else if(editorPann.MODE == "INSERT"){
			//document.getElementById("editor_area").focus();
			//$("#editor_area").focus();
			setTimeout(function() {
				$("#editor_area").focus();
			}, 0);
		}
	}
	document.getElementById("editor_target").focus();

});

$("body").bind('focus',function(){
	document.getElementById("editor_target").focus();
});

$(document).keyup(function (e) {
	e.preventDefault();
	e.stopPropagation();
	return false;
});
