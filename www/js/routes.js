angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // .state('home', {
  //   url: '/',
  //   templateUrl: 'templates/home.html',
  //   controller: 'homeCtrl as home'
  // })

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
        controller: 'RiesgoCtrl'        
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
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl as login'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push('httpInterceptor');

})
