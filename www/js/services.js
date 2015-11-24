angular.module('app.services', ['ngStorage', 'ngResource'])



.value('servidorAPI', 'https://localhost:3000')


.factory('almacenamientoLocal', ['$localStorage', function($localStorage){

  return {

    guardarDatos: function(variable, valor) {
      $localStorage[variable] = valor;
    },

    eliminarDatos: function(variable) {
      delete $localStorage[variable];
    },

    getToken: function() {
      if ($localStorage.token) {
        return 'saved';
      } else {
        return 'not saved';
      }
    },

    getUsuario: function() {
      if ($localStorage.usuario) {
        return $localStorage.usuario;
      } else {
        return 'not saved';
      }
    }
  }
}])



.factory('Autentificacion', ['$http', '$q', 'servidorAPI', 'almacenamientoLocal',
function($http, $q, servidorAPI, almacenamientoLocal) {
  return {
    loguearse: function(user, password) {
      var defered = $q.defer();
      $http.post(servidorAPI + '/auth/authenticate', {uid: user, password: password})
      .success(function(data) {
        if (data === 'usuario no existe' || data === 'contraseña incorrecta') {
          defered.reject(data);
        } else {
          defered.resolve(data);
        }
      })
      .error(function(err) {
        defered.reject(err);
      });
      return defered.promise;
    },

    salir: function() {
      almacenamientoLocal.eliminarDatos('token');
    },

    isLoggedIn: function() {
      if (almacenamientoLocal.getToken() === 'saved') {
        return true;
      } else {
        return false;
      }
    }
  }
}])



.factory('Labor', ['$resource', 'servidorAPI', function($resource, servidorAPI) {
  return $resource(servidorAPI + '/labores/:id', {id:'@id'});
}])



.factory('Usuario', ['$resource', 'servidorAPI', function($resource, servidorAPI) {
  return $resource(servidorAPI + '/users/:id', {id: '@id'});
}])



.factory('Rol', ['$resource', 'servidorAPI', function($resource, servidorAPI) {
  return $resource(servidorAPI + '/roles/:id', {id: '@id'});
}])



.factory('httpInterceptor', ['$localStorage',
function($localStorage) {
  return {
    'request': function (config) {
      config.headers = config.headers || {};
      if ($localStorage.token) {
        config.headers.Authorization = 'Bearer ' + $localStorage.token;
      }
      return config;
    },
    'responseError': function(response) {
      if(response.status === 401 || response.status === 403) {
      }
      return response;
    }
  };
}]);
