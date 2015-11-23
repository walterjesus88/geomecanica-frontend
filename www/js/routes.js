angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl as home'
    })



    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl as login'
    })



    .state('tabsUsers.users', {
      url: '/users',
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

})
