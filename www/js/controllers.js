angular.module('app.controllers', [])

.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {

  login = this;

  login.ingresar = function() {
    $http.post('https://localhost:3000/auth/authenticate', {uid: login.user, password: login.password})
    .success(function(data) {
      console.log(data);
    })
    .error(function(err) {
      console.log(err);
    });
  }

}])
