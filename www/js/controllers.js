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


.controller('RiesgoCtrl',['$scope','$ionicPopup','Usuario','Empresa','Labor','Pregunta','Inspeccion', '$ionicModal', 'Roca', 'Sostenimiento',
function($scope,$ionicPopup,Usuario,Empresa,Labor,Pregunta,Inspeccion, $ionicModal, Roca, Sostenimiento) {
  $scope.settings = {
    enableFriends: true
  };

  createRiesgo = this;
  $scope.$parent.index.isAuth = true;

    //Para el Datepicker//
  createRiesgo.datepickerObject = {};
  createRiesgo.datepickerObject.inputDate = new Date;
  $scope.datepickerObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      setButtonType : 'button-assertive',  //Optional
      todayButtonType : 'button-assertive',  //Optional
      closeButtonType : 'button-assertive',  //Optional
      inputDate: createRiesgo.datepickerObject.inputDate,   //Optional
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
      dateFormat: 'yyyy-MM-d', //Optional
      closeOnSelect: false, //Optional
  };


  var datePickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        createRiesgo.datepickerObject.inputDate = val;
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

  createRiesgo.tipolabor = [{ text: "Avance", value:'AVANCE', },{ text: "Explotacion", value:'EXPLOTACION', }, ];
  createRiesgo.insp_tlabor= {tipolabor: 'AVANCE' };


  createRiesgo.preguntasList = Pregunta.query();
  console.log(createRiesgo.preguntasList);


  $scope.labores = Labor.query();
  //console.log($scope.labores);

  createRiesgo.usuarios = Usuario.query();
  //console.log(createRiesgo.usuarios);

  createRiesgo.empresas= Empresa.query();
  createRiesgo.insp_empresa = {empresa: 'CMA' };
  //console.log(createRiesgo.empresas);


  createRiesgo.operators =
  {
    "value": "suma",
    "values": ["suma", "resta", "mutliplicacion", "division"]
  };

  createRiesgo.calcular = function()
  {
    //console.log(createRiesgo.insp_install.resp);
    //createRiesgo.inps_OL.sostenimiento
    //createRiesgo.insp_recomendacion.rgeo

    if(createRiesgo.inps_OL.sostenimiento=='FALSE' )
    {
      resultado='CRITICO';
    }
    else if(createRiesgo.inps_OL.sostenimiento=='TRUE' && createRiesgo.insp_recomendacion.rgeo=='TRUE' && createRiesgo.insp_install.resp=='TRUE')
    {
      resultado='BAJO';
    }
    else if(createRiesgo.inps_OL.sostenimiento=='TRUE' && (createRiesgo.insp_install.resp=='TRUE' || createRiesgo.insp_recomendacion.rgeo=='TRUE'))
    {
      resultado='MEDIO';
    }
    else if(createRiesgo.inps_OL.sostenimiento=='TRUE' && createRiesgo.insp_install.resp=='FALSE'  && createRiesgo.insp_recomendacion.rgeo=='FALSE')
    {
      resultado='CRITICO';
    }

    createRiesgo.nivelRiesgo=resultado;
  }

   $scope.$watch(createRiesgo.calcular);

  // var items = angular.fromJson($scope.labores);
  // angular.forEach(items, function(item) {
  //   //models.push(item);
  //   console.log(item);
  // });

  // $scope.labores.$promise.then(function(data) {
  //     console.log(data);
  //     //console.log(JSON.stringify(data));
  // });

  // var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
  // $scope.veiculos = data;
  // console.log($scope.veiculos);

  createRiesgo.guardia = [{ text: "Dia", value:'DIA', },{ text: "Noche", value:'NOCHE', }, ];
  createRiesgo.insp_guard = {guardia: 'DIA' };

  createRiesgo.opcionlabor = [{ text: "Labor con sostenimiento", value:'TRUE'},{text: "Labor sin sostenimiento", value:'FALSE'}];
  createRiesgo.inps_OL = {sostenimiento: 'TRUE' };

  createRiesgo.geomecanica = [{ text: "Cumplio", value:'TRUE'},{text: "No Cumplio", value:'FALSE'}];
  createRiesgo.insp_recomendacion = {rgeo: 'TRUE' };

  createRiesgo.install = [{ text: "Correcta", value:'TRUE'},{text: "Incorrecta", value:'FALSE'}];
  createRiesgo.insp_install = {resp: 'TRUE' };

  createRiesgo.ver= function(id) {
       console.log(id);
  }

  $scope.$watch(createRiesgo.ver);


  createRiesgo.guardarinspeccion = function() {

    //console.log(createRiesgo.datepickerObject.inputDate);
    fecha = new Date(createRiesgo.datepickerObject.inputDate);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
    if (month.toString().length < 2)
    {
      month = '0' + month;
    }
    if (day.toString().length < 2)
    {
      day = '0' + day;
    }
    fecha=year+"-"+month+"-"+day;

    //console.log(createRiesgo.insp_empresa.empresa);

    var inspeccion = new Inspeccion();

    //console.log(createRiesgo.responsable);

    inspeccion.periodo = createRiesgo.insp_guard.guardia;
    inspeccion.recomendacion = createRiesgo.insp_recomendacion.rgeo;
    inspeccion.instalacion = createRiesgo.insp_install.resp;
    inspeccion.tipo = createRiesgo.insp_tlabor.tipolabor;
    inspeccion.comentario = createRiesgo.comment;
    inspeccion.ancho_real = createRiesgo.ancho_real;
    //createRiesgo.ancho_exc_tabla;
    inspeccion.alto_real= createRiesgo.alto_real;
    inspeccion.empresaEmpresaid= createRiesgo.insp_empresa.empresa;
    inspeccion.fecha= fecha;
    inspeccion.laborCodigo=createRiesgo.labor.codigo;
    inspeccion.recomendacion=createRiesgo.insp_recomendacion.rgeo;
    inspeccion.estado=createRiesgo.inps_OL.sostenimiento;

    inspeccion.ResponsableUid=createRiesgo.responsable;
    inspeccion.SeguridadUid=createRiesgo.seguridad;
    inspeccion.GeomecanicoUid=createRiesgo.geomecanico;
    inspeccion.OperacionesUid=createRiesgo.operaciones;
    inspeccion.RegistroUid=createRiesgo.responsable;

    inspeccion.RocaId = createRiesgo.tipo_roca;
    iunspeccion.SostenimientoId = createRiesgo.tipo_sostenimiento;

    console.log(inspeccion);

    inspeccion.$save(function() {
      //$state.go('tabsUsers.users');
      console.log('hoolla');
    });
  }



  //modal de tablas de sostenimiento
  createRiesgo.tipo = 'A';
  createRiesgo.rocas = Roca.query();
  createRiesgo.sostenimientos = Sostenimiento.query({tipo: createRiesgo.tipo});

  $ionicModal.fromTemplateUrl('popupSostenimiento.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    createRiesgo.modal = modal;
  });

  createRiesgo.openTablaSostenimiento = function() {
    createRiesgo.modal.show();
  }

  createRiesgo.closeTablaSostenimiento = function() {
    createRiesgo.modal.hide();
  }

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
      users.editUser = {};
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



.controller('laboresCtrl', ['Labor', '$ionicModal', '$scope', 'Tipo',
function(Labor, $ionicModal, $scope, Tipo) {

  labores = this;

  labores.labores = Labor.query();

  labores.eliminarLabor = function(uid) {
    Labor.delete({id: uid}, function() {
      labores.labores = Labor.query();
    });
  }

  $ionicModal.fromTemplateUrl('edit-labor-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    labores.modal = modal;
  });

  labores.openEditLabor = function(labor) {
    labores.tipos = Tipo.query();
    labores.editLabor = labor;
    labores.modal.show();
  }

  labores.closeEditLabor = function() {
    labores.modal.hide();
    Labor.update({id: labores.editLabor.codigo}, labores.editLabor, function() {
      labores.editLabor = {};
      labores.labores = Labor.query();
    });
  }

  labores.cancelEditLabor = function() {
    labores.editLabor = {};
    labores.modal.hide();
  }

}])



.controller('createLaborCtrl', ['Labor', 'Tipo', '$state',
function(Labor, Tipo, $state) {

  createLabor = this;

  createLabor.tipos = Tipo.query();

  createLabor.nuevaLabor = function() {

    var labor = new Labor();
    labor.codigo = createLabor.labor.codigo;
    labor.nombre = createLabor.labor.nombre;
    labor.nivel = createLabor.labor.nivel;
    labor.alto_pro = createLabor.labor.alto_pro;
    labor.ancho_pro = createLabor.labor.ancho_pro;
    labor.tipoTipoId = createLabor.labor.tipoTipoId;
    labor.$save(function() {
      $state.go('tabsLabores.labores');
    });

  }

}])
