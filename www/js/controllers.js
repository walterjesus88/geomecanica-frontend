angular.module('app.controllers', [])

.controller('indexCtrl', ['almacenamientoLocal', '$location',
function(almacenamientoLocal, $location) {

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

  if(almacenamientoLocal.getUsuario() !== 'not saved') {
    login.user = almacenamientoLocal.getUsuario().user;
    login.password = almacenamientoLocal.getUsuario().password;
    login.isRemember = true;
  }

  login.ingresar = function() {
    Autentificacion.loguearse(login.user, login.password)
    .then(function(data) {
      almacenamientoLocal.guardarDatos('token', data.token);
      $scope.$parent.index.isAuth = true;
      login.alerta = '';
      if (login.isRemember) {
        almacenamientoLocal.guardarDatos('usuario', {user: login.user, password: login.password});
      } else {
        login.user = '';
        login.password = '';
        almacenamientoLocal.eliminarDatos('usuario');
      }
      $location.path('/');
    })
    .catch(function(err) {
      if (err === 'usuario no existe') {
        login.user = '';
        login.password = '';
        login.alerta = err;
      } else if (err === 'contraseña incorrecta') {
        login.password = '';
        login.alerta = err;
      }
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

}])

.controller('usersCtrl', ['Usuario', function(Usuario) {

  users = this;

  users.usuarios = Usuario.query();

  users.eliminarUsuario = function(uid) {
    Usuario.delete({id: uid}, function() {
      users.usuarios = Usuario.query();
    });
  }

  users.modificarUsuario = function() {

  }

}])

.controller('createUserCtrl', ['Usuario', '$location', function(Usuario, $location) {

  createUser = this;

  createUser.usuario = {};

  createUser.nuevoUsuario = function() {
    var user = new Usuario();
    user.uid = createUser.usuario.uid;
    user.dni = createUser.usuario.dni;
    user.nombre = createUser.usuario.nombre;
    user.password = createUser.usuario.password;
    user.$save(function() {
      createUser.usuario = {};
      $location.path('/adminUsers/users');
    });
  }

}])
