angular.module('app.controllers', [])

.controller('indexCtrl', ['almacenamientoLocal', '$location', '$rootScope',
function(almacenamientoLocal, $location, $rootScope) {

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

.controller('loginCtrl', ['Autentificacion', 'almacenamientoLocal', '$location', '$scope','$state',
function(Autentificacion, almacenamientoLocal, $location, $scope, $state) {

  login = this;

  if($scope.$parent.index.isAuth === true) {
    //$location.path('/tab');
    $state.go('tab.home');
  }

  login.ingresar = function() {
    Autentificacion.loguearse(login.user, login.password)
    .then(function(data) {
      almacenamientoLocal.guardarDatos('token', data.token);
      $scope.$parent.index.isAuth = true;
      //$location.path('/tab');
      $state.go('tab.home');

    })
    .catch(function(err) {

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

.controller('RiesgoCtrl', function($scope,$ionicPopup) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.preguntasList = [
    { text: "Wireless", checked: true },
    { text: "GPS", checked: false },
    { text: "GPS1", checked: false },
    { text: "GPS2", checked: false },
    { text: "GPS3", checked: false },
    { text: "Bluetooth", checked: false }
  ];

  //Para el Datepicker//
  $scope.datepickerObject = {};
  $scope.datepickerObject.inputDate = new Date(2015, 6, 30);

  $scope.datepickerObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      setButtonType : 'button-assertive',  //Optional
      todayButtonType : 'button-assertive',  //Optional
      closeButtonType : 'button-assertive',  //Optional
      inputDate: $scope.datepickerObject.inputDate,   //Optional
      mondayFirst: true,  //Optional
      disabledDates: disabledDates, //Optional
      weekDaysList: weekDaysList, //Optional
      monthList: monthList, //Optional
      templateType: 'popup', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: new Date(2012, 8, 2), //Optional
      to: new Date(2018, 8, 25),  //Optional
      callback: function (val) {  //Mandatory
        datePickerCallback(val);
      },
      dateFormat: 'dd-MM-yyyy', //Optional
      closeOnSelect: false, //Optional
  };


  var datePickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        $scope.datepickerObject.inputDate = val;
        console.log('Selected date is : ', val)
      }
  };

  var disabledDates = [
      new Date(1437719836326),
      new Date(),
      new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
      new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
      new Date("08-14-2015"), //Short format
      new Date(1439676000000) //UNIX format
  ];

  var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];
  var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
});
