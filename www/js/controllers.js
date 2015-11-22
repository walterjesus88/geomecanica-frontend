angular.module('app.controllers', [])

.controller('indexCtrl', ['almacenamientoLocal', '$location', '$rootScope',
function(almacenamientoLocal, $location, $rootScope) {

  index = this;

  if (almacenamientoLocal.getToken() === 'saved') {
    index.isAuth = true;
  } else {
    index.isAuth = false;
  }

  index.salir = function() {
    almacenamientoLocal.eliminarDatos('token');
    $location.path('/login');
    index.isAuth = false;
  }

}])

.controller('loginCtrl', ['Autentificacion', 'almacenamientoLocal', '$location', '$scope',
function(Autentificacion, almacenamientoLocal, $location, $scope) {

  login = this;

  if($scope.$parent.index.isAuth === true) {
    $location.path('/');
  }

  login.ingresar = function() {
    Autentificacion.loguearse(login.user, login.password)
    .then(function(data) {
      almacenamientoLocal.guardarDatos('token', data.token);
      $scope.$parent.index.isAuth = true;
      $location.path('/');
    })
    .catch(function(err) {

    });
  }

}])

.controller('homeCtrl', ['Labor', '$scope', '$location',
function(Labor, $scope, $location) {

  home = this;

  if ($scope.$parent.index.isAuth === false) {
    $location.path('/login');
  }

  home.listarLabores = function() {
    home.labores = Labor.query();
  }

}]);
