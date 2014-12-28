superlucky.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
      when('/typingio', {
        templateUrl: 'view/typing',
        controller: 'typingController'
      }).
      when('/logout', {
        templateUrl: 'user/logout',
        controller: 'logoutController'
      }).
      otherwise({
        redirectTo: '/typingio'
      });
}]);
