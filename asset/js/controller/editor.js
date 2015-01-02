

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
		this.$DIV = angular.element(document.getElementById('editor_area'));
		this.$NUM_DIV = angular.element(document.getElementById('editor_num_area'));
		

		this.MODE = "NORMAL";
	}

	// 파일로드
	editor_pann.prototype.file_load = function(){
		var _this = this;
		$http({ url: '/editor/prototype', method: "GET", async:false }).
			success(function(data){

				var pann = data.data.replace(/[ ]/g,"&nbsp;").split(/\n/);
				console.log(pann.length);

				for(line_key in pann){

					var line = pann[line_key];
					if(!line){
						line = "&nbsp;";
					}
					var $SPAN = angular.element("<div>"+line+"</div>");
					_this.$DIV.append($SPAN);
					var num = parseInt(line_key) + 1;
					_this.$NUM_DIV.append(num+"<br>");

				}

			}).
			error(function(data){
				alert('SERVER ERROR');
			});
	}
	// 모드면경
	editor_pann.prototype.mode_change = function(TYPE){
		var _this = this;

		// 입력모드
		if(TYPE=="INSERT"){
			console.log("INSERT MODE");
			_this.$DIV.attr("contenteditable",true);
			_this.MODE = "INSERT";
			document.getElementById("editor_area").focus();

		}
		// 일반모드
		else if(TYPE=="NORMAL"){
			console.log("NORMAL MODE");
			_this.$DIV.attr("contenteditable",false);
			_this.MODE = "NORMAL";
			document.getElementById("editor_target").focus();
		}
		// 명령모드
		else if(TYPE=="COMMAND"){
			_this.MODE = "COMMAND";
		}
	}
	// 키코드 액션
	editor_pann.prototype.key_fun = function(keyCode){
		var _this = this;
		console.log(keyCode);
		if(_this.MODE=="NORMAL"){
			if([97,105,111].indexOf(keyCode) > -1){
				_this.mode_change("INSERT");
			}
			if([58].indexOf(keyCode) > -1){
				_this.mode_change("COMMAND");
			}
		}
	}
	// 키코드 esc
	editor_pann.prototype.key_esc = function(keyCode){
		var _this = this;
		console.log(_this.MODE);
		if(_this.MODE!="NORMAL" && keyCode==27){
			console.log('jj');
			_this.mode_change("NORMAL");
		}
	}
	// 키코드 잡기
	editor_pann.prototype.keycode = function(ev){
		var keyCode = 0;
		if(ev.keyCode==0){
			keyCode = ev.which;
		}else{
			keyCode = ev.keyCode;
		}
		return keyCode;
	}


	// Class 정의 (라인 클레스)
	function editor_line(){
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
		$scope.keytarget = "";
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
