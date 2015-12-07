// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic','ionMdInput','ionic-datepicker','app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function($ionicPlatform, $rootScope, Autentificacion, $urlRouter, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$locationChangeSuccess', function(e, toState, toParams, fromState, fromParams) {

    e.preventDefault();
    if (!Autentificacion.isLoggedIn()) {
      $state.go('login');
      return;
    }

    $urlRouter.sync();
    $urlRouter.listen();
  });
})
