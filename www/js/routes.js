angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'home-tab': {
        templateUrl: "templates/home.html",
        controller: 'homeCtrl as home'
      }
    }
  })

  .state('tab.riesgo', {
    url: "/riesgo",
      views: {
        'tab-riesgo': {
        templateUrl: "templates/riesgo.html",
        controller: 'RiesgoCtrl'
      }
    }
  })

  .state('tab.pregunta', {
    url: "/preguntas",
      views: {
        'tab-pregunta': {
        templateUrl: "templates/pregunta.html",
        controller: 'RiesgoCtrl as riesgo'
      }
    }
  })

  .state('tab.responsable', {
    url: "/responsable",
      views: {
        'tab-responsable': {
        templateUrl: "templates/responsable.html",
        //controller: 'RiesgoCtrl'
      }
    }
  })

  .state('tab.web', {
    url: "/web",
      views: {
        'tab-web': {
        templateUrl: "templates/web.html",
        controller: 'RiesgoCtrl as riesgo'
      }
    }
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
      cache: false,
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
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  $httpProvider.interceptors.push('httpInterceptor');


  // middleware que escucha los eventos de cambio de vista o estado
  $urlRouterProvider.deferIntercept();



})
