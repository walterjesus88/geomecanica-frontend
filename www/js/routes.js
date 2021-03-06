angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // .state('tab', {
  //   url: '/tab',
  //   abstract: true,
  //   templateUrl: 'templates/tabs.html'
  // })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('tab.web', {
    url: "/web",
      views: {
        'menuContent': {
          templateUrl: "templates/web.html",
          controller: 'RiesgoCtrl as createRiesgo'
        },
        'fabContent': {
          template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
          // controller: function ($timeout) {
          //     $timeout(function () {
          //       document.getElementById('fab-activity').classList.toggle('on');
          //   }, 200);
          // }
        }
    }
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'homeCtrl as home'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('tab.riesgo', {
    url: "/riesgo",
      views: {
        'tab-riesgo': {
        templateUrl: "templates/riesgo.html",
        //controller: 'RiesgoCtrl as createRiesgo '
      }
    }
  })

  .state('tab.pregunta', {
    url: "/preguntas",
      views: {
        'tab-pregunta': {
        templateUrl: "templates/pregunta.html",
        //controller: 'RiesgoCtrl as createRiesgo '
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


  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl as login'
  })

  .state('tab.users', {
    url: '/users',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/users.html',
        controller: 'usersCtrl as users'
      }
    }
  })

  .state('tab.labores', {
    url: '/labores',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/labores.html',
        controller: 'laboresCtrl as labores'
      }
    }
  })

  .state('tabsLabores.create', {
    url: '/create',
    cache: false,
    views: {
      'tab2': {
        templateUrl: 'templates/createLabor.html',
        controller: 'createLaborCtrl as createLabor'
      }
    }
  })

  .state('tabsLabores', {
    url: '/adminLabores',
    abstract: true,
    templateUrl: 'templates/tabsLabores.html'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  $httpProvider.interceptors.push('httpInterceptor');

  // middleware que escucha los eventos de cambio de vista o estado
  $urlRouterProvider.deferIntercept();
})
