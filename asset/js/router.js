superlucky.config(['$routeProvider',
function($routeProvider) {
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
        redirectTo: '/'+superlucky.user_id+'/typingio'
      });
}]);
