

// 컨트롤러 간 공유
superlucky.service('editorservice',function(){

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

		// 파일로드
		if(typeof this.file_load != "function"){
			editor_pann.prototype.file_load = function(){
				var _this = this;
				$http({ url: '/editor/prototype', method: "GET", async:false }).
					success(function(data){

						var pann = data.data.replace(/[\&]/g,"&amp;").replace(/[ ]/g,"&nbsp;").split(/\n/);
						//var pann = data.data.replace(/[ ]/g,"&nbsp;").split(/\n/);
						console.log(pann.length);

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


						//_this.$DIV.attr("contenteditable",true);

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
					document.getElementById("editor_area").focus();

				}
				// 일반모드
				else if(TYPE=="NORMAL"){
					console.log("NORMAL MODE");
					//_this.$DIV.attr("contenteditable",false);
					_this.MODE = "NORMAL";


					document.getElementById("editor_target").focus();
				}
				// 명령모드
				else if(TYPE=="COMMAND"){
					_this.MODE = "COMMAND";
				}
			}
		}
		// 키코드 액션
		if(typeof this.key_fun != "function"){
			editor_pann.prototype.key_fun = function(keyCode){
				var _this = this;
				console.log(keyCode);

				$scope.keytarget = "";

				if(_this.MODE=="NORMAL"){
					if([97,105,111].indexOf(keyCode) > -1){
						_this.mode_change("INSERT");
					}

					// 왼쪽
					else if(104 == keyCode){

						if(_this.COLUMN > 1){
							//_this.$DIV.find("div").eq(_this.ROW-1).removeClass("linehigh");
							//_this.$DIV.find("div").eq(_this.ROW).addClass("linehigh");

							_this.COLUMN--;

							var left = (_this.COLUMN-1) * 9;
							_this.$DIV.find(".editor_cursor").css("left",left+"px");
						}
					}
					// 오른쪽
					else if(108 == keyCode){
						if(_this.line_ins.end > _this.COLUMN){

							_this.COLUMN++;

							var left = (_this.COLUMN-1) * 9;
							_this.$DIV.find(".editor_cursor").css("left",left+"px");
						}
					}

					// 아래로
					else if(106 == keyCode){
						if(_this.ROW <= _this.TOTAL_ROW){
							_this.ROW++;

							// 라인분석
							_this.line_ins.analisys(_this.$DIV.find("div").eq(_this.ROW+1));

							var top = (_this.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");
						}
					}
					// 위로
					else if(107 == keyCode){
						if(_this.ROW > 1){
							_this.ROW--;

							// 라인분석
							_this.line_ins.analisys(_this.$DIV.find("div").eq(_this.ROW+1));

							var top = (_this.ROW-1) * 16;
							_this.$DIV.find(".editor_cursor").css("top",top+"px");
						}
					}
					// 라인 끝으로 이동
					else if(36 == keyCode){
						_this.COLUMN = _this.line_ins.end;
						var left = (_this.COLUMN-1) * 9;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 라인 처음으로 이동
					else if(94 == keyCode){
						_this.COLUMN = _this.line_ins.start;
						var left = (_this.COLUMN) * 9;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 이동(w)
					else if(119 == keyCode){
						_this.COLUMN = _this.line_ins.move_w("w",_this.COLUMN);
						var left = (_this.COLUMN-1) * 9;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 이동(w)
					else if(101 == keyCode){
						_this.COLUMN = _this.line_ins.move_w("e",_this.COLUMN);
						var left = (_this.COLUMN-1) * 9;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}
					// 한단어 뒤로(b)
					else if(98 == keyCode){
						_this.COLUMN = _this.line_ins.move_b(_this.COLUMN);
						var left = (_this.COLUMN-1) * 9;
						_this.$DIV.find(".editor_cursor").css("left",left+"px");
					}

					// 되돌리기
					else if(117 == keyCode){
						//_this.$DIV.attr("contenteditable",true);
						document.execCommand('undo', false, null);
						document.execCommand('undo', false, null);
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
					console.log('jj');
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
		// 라인 커서이동
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
		// 라인 커서이동
		if(typeof this.move_b != "function"){
			editor_line.prototype.move_b = function(start_pos){
				var _this = this;
				var line_s_cut = _this.line_string.substr(0,start_pos-1);
				line_s_cut = line_s_cut.split("").reverse().join("");

				var w_anal = line_s_cut.match(/([^\w ]|[\w]([ ]|[^\w]))/);
				var cursor = start_pos;
				if(w_anal){
					cursor = start_pos - w_anal['index']-1;
				}
				return cursor;
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
