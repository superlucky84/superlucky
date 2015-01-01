superlucky.config(['$routeProvider',
function($routeProvider) {

	var hash_base = location.hash.split("/");
	hash_base = hash_base[hash_base.length-1];

	var hash_type =  ['board','typingio'];
	if(hash_type.indexOf(hash_base) > -1){
		superlucky.main_category = hash_base;
	}else{
		superlucky.main_category = "typingio";
	}

    $routeProvider.
		when('/:user_id/typingio', {
			templateUrl: 'view/typing',
			controller: 'typingController'
		}).
		when('/:user_id/board', {
			templateUrl: 'view/board',
			controller: 'boardController'
		}).
		when('/logout', {
			templateUrl: 'user/logout',
			controller: 'logoutController'
		}).
		otherwise({
			redirectTo: '/'+superlucky.user_id+'/'+superlucky.main_category
		});
}]);
