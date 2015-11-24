angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('home', {
      url: '/',
      cache: false,
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl as home'
    })



    .state('login', {
      url: '/login',
      cache: false,
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl as login'
    })



    .state('tabsUsers.users', {
      url: '/users',
      cache: false,
      views: {
        'tab1': {
          templateUrl: 'templates/users.html',
          controller: 'usersCtrl as users'
        }
      }
    })



    .state('tabsUsers.create', {
      url: '/create',
      views: {
        'tab2': {
          templateUrl: 'templates/createUser.html',
          controller: 'createUserCtrl as createUser'
        }
      }
    })



    .state('tabsUsers', {
      url: '/adminUsers',
      abstract: true,
      templateUrl: 'templates/tabsUsers.html'
    })



    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push('httpInterceptor');


  // middleware que escucha los eventos de cambio de vista o estado
  $urlRouterProvider.deferIntercept();



})
