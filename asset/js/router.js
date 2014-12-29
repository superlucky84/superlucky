superlucky.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
      when('/typingio', {
        templateUrl: 'view/typing',
        controller: 'typingController'
      }).
      when('/board', {
        templateUrl: 'view/board',
        controller: 'boardController'
      }).
      when('/logout', {
        templateUrl: 'user/logout',
        controller: 'logoutController'
      }).
      otherwise({
        redirectTo: '/typingio'
      });
}]);
