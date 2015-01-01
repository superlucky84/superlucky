



// 컨트롤러 간 공유
superlucky.service('boardservice',function(){

	this.dialog_instance = null;
	this.main_scope = null;
	this.main_scope_setting = function($scope){
		this.main_scope = $scope;
	}

})
// 다이얼로그 컨트롤러
.controller('boardDialogController', function ($scope,$http,$modal,boardservice) {


	// STOP 클릭
	$scope.close = function(){
		boardservice.dialog_instance.dismiss('cancel');
	};


	 $scope.options = {
		  height: 150,
		  lang :'ko-KR'
	/*
		  toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']]
		  ]
	*/
	};


})
// 게시판 앱 컨트롤러
.controller('boardController', function ($scope,$http,$modal,$routeParams,boardservice) {

	// category nabi
	var $navbar = angular.element(document.getElementById('navbar'));
	$navbar.find("li").removeClass('active');
	angular.element(document.getElementById('board')).addClass('active');

	
	var board = {
		page : 1,
		lists : function(){
			$http({ url: '/board/lists?user_id='+$routeParams.user_id+'&page='+board.page, method: "GET", async:false }).
			success(function(data){
				if(data.result=='true'){
					$scope.lists = data.data;
				}
			}).
			error(function(data){
				alert('SERVER ERROR');
			});
		}
	};

	board.lists();


	$scope.write_dialog = function(){
		dialog('lg');
	}


	// dialog
	dialog = function(size){
		boardservice.dialog_instance = $modal.open({
			templateUrl: 'dialog_comm',
			controller: 'boardDialogController',
			size: size,
			backdrop : false,
			resolve: {
			}
		});
	}


});
