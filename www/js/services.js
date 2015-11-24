angular.module('app.services', ['ngStorage', 'ngResource'])

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
    }
  }
}])

.factory('Autentificacion', ['$http', '$q', function($http, $q) {
  return {
    loguearse: function(user, password) {
      var defered = $q.defer();
      $http.post('https://localhost:3000/auth/authenticate', {uid: user, password: password})
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
    }
  }
}])

.factory('Labor', ['$resource', function($resource) {
  return $resource('https://localhost:3000/labores/:id', {id:'@id'});
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
