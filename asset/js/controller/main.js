superlucky.controller('mainController', function ($scope,$http,$routeParams) {
	$scope.move_category = function(category){
		location.href = "#"+$routeParams.user_id+"/"+category;
	}
});
