angular.module('app.controllers', [])



.controller('indexCtrl', ['Autentificacion', '$state',
function(Autentificacion, $state) {

  index = this;

  index.isAuth = true;

  index.salir = function() {
    Autentificacion.salir();
    $state.go('login');
    index.isAuth = false;
  }

}])



.controller('loginCtrl', ['Autentificacion', 'almacenamientoLocal', '$state', '$scope',
function(Autentificacion, almacenamientoLocal, $state, $scope) {

  login = this;

  if (Autentificacion.isLoggedIn()) {
    $state.go('home');
  } else {
    $scope.$parent.index.isAuth = false;
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
      $state.go('home');
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



.controller('homeCtrl', ['Labor', '$scope', '$state',
function(Labor, $scope, $state) {

  home = this;

  $scope.$parent.index.isAuth = true;

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



.controller('createUserCtrl', ['Usuario', '$state', 'Rol',
function(Usuario, $state, Rol) {

  createUser = this;

  createUser.usuario = {};

  createUser.roles = Rol.query();

  createUser.nuevoUsuario = function() {
    var user = new Usuario();
    user.uid = createUser.usuario.uid;
    user.dni = createUser.usuario.dni;
    user.nombre = createUser.usuario.nombre;
    user.password = createUser.usuario.password;
    user.rol_id = createUser.usuario.rol_id;
    user.$save(function() {
      createUser.usuario = {};
      $state.go('tabsUsers.users');
    });
  }

}])
