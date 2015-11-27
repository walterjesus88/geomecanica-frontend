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
    $state.go('tab.home');
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

      $state.go('tab.home');


      login.alerta = '';
      if (login.isRemember) {
        almacenamientoLocal.guardarDatos('usuario', {user: login.user, password: login.password});
      } else {
        login.user = '';
        login.password = '';
        almacenamientoLocal.eliminarDatos('usuario');
      }
      $state.go('tab.home');
    })
    .catch(function(err) {
      if (err === 'usuario no existe') {
        login.user = '';
        login.password = '';
      } else if (err === 'contraseña incorrecta') {
        login.password = '';
      }
      login.alerta = err;
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


.controller('RiesgoCtrl',['$scope','$ionicPopup','Question',function($scope,$ionicPopup,Question) {
  $scope.settings = {
    enableFriends: true
  };

  home = this;

  $scope.$parent.index.isAuth = true;

  // home.questionsList = Question.query();
  // console.log(home.questionsList);
  home.guardarinspeccion = function() {
    console.log('hoolla');

    Inspeccion.guardarDatos(proyectoid,revision_cronograma,codigoproy)
    .then(function(data) {  
      va.thi=data; 
    })
    .catch(function(err) {
      va.thi = {};
    });

  }


  // var user = new Usuario();
  //   user.uid = createUser.usuario.uid;
  //   user.dni = createUser.usuario.dni;
  //   user.nombre = createUser.usuario.nombre;
  //   user.password = createUser.usuario.password;
  //   user.rol_id = createUser.usuario.rol_id;
  //   user.correo = createUser.usuario.correo;
  //   user.$save(function() {
  //     $state.go('tabsUsers.users');
  // });



  // $scope.preguntasList = [
  //   { text: "Wireless", checked: true },
  //   { text: "GPS", checked: false },
  //   { text: "GPS1", checked: false },
  //   { text: "GPS2", checked: false },
  //   { text: "GPS3", checked: false },
  //   { text: "Bluetooth", checked: false }
  // ];

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
}])


.controller('usersCtrl', ['Usuario', 'Rol', '$ionicModal', '$scope',
function(Usuario, Rol, $ionicModal, $scope) {

  users = this;

  users.usuarios = Usuario.query();
  users.roles = Rol.query();

  users.darBaja = function(usuario) {
    usuario.estado = 'Inactivo';
    Usuario.update({id: usuario.uid}, usuario, function() {
      users.usuarios = Usuario.query();
    });
  }

  users.darAlta = function(usuario) {
    usuario.estado = 'Activo';
    Usuario.update({id: usuario.uid}, usuario, function() {
      users.usuarios = Usuario.query();
    });
  }

  users.eliminarUsuario = function(uid) {
    Usuario.delete({id: uid}, function() {
      users.usuarios = Usuario.query();
    });
  }

  $ionicModal.fromTemplateUrl('edit-user-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    users.modal_edit = modal;
  });

  users.openEditUser = function(usuario) {
    users.editUser = usuario;
    users.modal_edit.show();
  }

  users.closeEditUser = function() {
    users.modal_edit.hide();
    Usuario.update({id: users.editUser.uid}, users.editUser, function() {
      users.usuarios = Usuario.query();
    });
  }

  users.cancelEditUser = function() {
    users.editUser = {};
    users.modal_edit.hide();
  }

  $ionicModal.fromTemplateUrl('change-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    users.modal_pass = modal;
  });

  users.openResPass = function(uid) {
    users.uid_pass = uid;
    users.modal_pass.show();
  }

  users.closeResPass = function() {
    users.modal_pass.hide();
    Usuario.update({id: users.uid_pass}, {password: users.new_pass}, function() {
      users.usuarios = Usuario.query();
    });
  }

  users.cancelResPass = function() {
    users.uid_pass = '';
    users.modal_pass.hide();
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
    user.correo = createUser.usuario.correo;
    user.$save(function() {
      $state.go('tabsUsers.users');
    });
  }

  createUser.verificarNombre = function() {
    if (!/^([a-zA-ZñÑ-áéíóúÁÉÍÓÚ\s])*$/.test(createUser.usuario.nombre)) {
      createUser.usuario.nombre = createUser.usuario.nombre.slice(0, createUser.usuario.nombre.length - 1);
    }
  }

  createUser.verificarEmail = function() {
    if (!/\S+@\S+\.\S+/.test(createUser.usuario.correo)) {
      createUser.usuario.correo = '';
    }
  }

  createUser.verificarDni = function() {
    if (!/^([0-9])*$/.test(createUser.usuario.dni)) {
      createUser.usuario.dni = createUser.usuario.dni.slice(0, createUser.usuario.dni.length - 1);
    }
    if (createUser.usuario.dni.length > 8) {
      createUser.usuario.dni = createUser.usuario.dni.slice(0, createUser.usuario.dni.length - 1);
    }
  }

}])
