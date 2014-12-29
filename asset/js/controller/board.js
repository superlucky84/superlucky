

// 컨트롤러 간 공유
superlucky.service('boardservice',function(){

	this.dialog_instance = null;
	this.main_scope = null;
	this.main_scope_setting = function($scope){
		this.main_scope = $scope;
	}

})
// 다이얼로그 컨트롤러
.controller('boaardDialogController', function ($scope,$http,$modal,typingservice) {

	// STOP 클릭
	$scope.close = function(){
		typingservice.dialog_instance.dismiss('cancel');
	};


})
// 게시판 앱 컨트롤러
.controller('boardController', function ($scope,$http,$modal,typingservice) {

	var $navbar = angular.element(document.getElementById('navbar'));
	$navbar.find("li").removeClass('active');
	angular.element(document.getElementById('board')).addClass('active');


	// dialog
	dialog = function(size){
		typingservice.dialog_instance = $modal.open({
			templateUrl: 'dialog_comm',
			controller: 'boaardDialogController',
			size: size,
			backdrop : false,
			resolve: {
			}
		});
	}


});
