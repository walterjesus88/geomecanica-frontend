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
      //console.log(data);
      $scope.$parent.dato=data;
      almacenamientoLocal.guardarDatos('token', data.token);
      $scope.$parent.index.isAuth = true;

      $state.go('tab.web');
      login.alerta = '';
      if (login.isRemember) {
        almacenamientoLocal.guardarDatos('usuario', {user: login.user, password: login.password});
      } else {
        login.user = '';
        login.password = '';
        almacenamientoLocal.eliminarDatos('usuario');
      }
      $state.go('tab.web');
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


.controller('RiesgoCtrl',['$scope','$ionicPopup','Usuario','Labor',
'Pregunta','Inspeccion', '$ionicModal', 'Roca', 'Sostenimiento', 'Tipo', 'Porcentaje',
function($scope,$ionicPopup,Usuario,Labor,Pregunta,Inspeccion,
  $ionicModal, Roca, Sostenimiento, Tipo, Porcentaje) {

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

  Pregunta.query().$promise.then(function(preguntas) {
    createRiesgo.preguntasList = [];
    createRiesgo.respuestas = [];
    preguntas.forEach(function(item) {
      //habilitar o deshabilitar las preguntas: false es habilitado
      item.isDisabled = false;
      //setear variable que se filtrara en los ngRepeat para dividir en dos columnas
      //en la vista se realiza el ngRepeat 2 veces, una para cada columna
      if (item.posicion < 8) {
        item.columna = 'left';
      } else {
        item.columna = 'right';
      }
      //valor por defecto de las respuestas
      if (item.tipo === 'Opciones') {
        var valor = item.alternativas[0].value;
      } else if (item.tipo === 'Check') {
        var valor = false;
      } else if (item.tipo === 'Compuesto') {
        var valor = '';
      }
      //elementos del array que contendra las respuestas de las preguntas
      var resp = {value: valor, preguntaid: item.preguntaid, tipo: item.tipo};
      createRiesgo.preguntasList.push(item);
      createRiesgo.respuestas[item.preguntaid] = resp;
    });
  });

  createRiesgo.labores = Labor.query();
  createRiesgo.opcion=true;
  createRiesgo.usuarios = Usuario.query();

  createRiesgo.calcularPorAncho = function() {
    createRiesgo.ancho_exc_real = ((createRiesgo.ancho_real * 100) / createRiesgo.labor.ancho_pro) - 100;
    createRiesgo.calculariesgo();
  }

  createRiesgo.calcularPorAlto = function() {
    createRiesgo.alto_exc_real = ((createRiesgo.alto_real * 100) / createRiesgo.labor.alto_pro) - 100;
    createRiesgo.calculariesgo();
  }

  createRiesgo.calculariesgo = function(item)
  {
    createRiesgo.nivelRiesgo='BAJO';
    createRiesgo.estilo_nivel = estiloRiesgo(createRiesgo.nivelRiesgo);
    //si una de la condicionales relevantes es false entonces es critico
    if(!createRiesgo.inps_OL.sostenimiento || !createRiesgo.insp_install.resp || !createRiesgo.insp_recomendacion.rgeo) {
      createRiesgo.activo = 'B';
      createRiesgo.nivelRiesgo = 'CRITICO';
      createRiesgo.estilo_nivel = estiloRiesgo(createRiesgo.nivelRiesgo);
    }
    //si la pregunta 8 esta en false entonces es critico
    else if(!createRiesgo.respuestas['8'].value) {
      console.log(createRiesgo.respuestas['8'].value);
      createRiesgo.activo = 'B';
      createRiesgo.nivelRiesgo = 'CRITICO';
      createRiesgo.estilo_nivel = estiloRiesgo(createRiesgo.nivelRiesgo);
    }
    // dependiendo del porcentaje se calcula el nivel de riesgo
    else if (createRiesgo.alto_exc_real || createRiesgo.ancho_exc_real) {
      createRiesgo.activo = 'B';
      //realiza una consulta al servidor para ver que nivel de riesgo le corresponde a los porcentajes dados
      var respuesta = Porcentaje.query({roca: createRiesgo.tipo_roca, porAlto: createRiesgo.alto_exc_real, porAncho: createRiesgo.ancho_exc_real});
      respuesta.$promise.then(function(porcentaje) {
        createRiesgo.nivelRiesgo = porcentaje[0].nivel;
        createRiesgo.estilo_nivel = estiloRiesgo(createRiesgo.nivelRiesgo);
      });
    }
  }

  //funcion para cambiar el color del nivel de riesgo
  function estiloRiesgo(nivel) {
    if (nivel === 'CRITICO') {
      return 'button-assertive';
    } else if (nivel === 'MEDIO') {
      return 'button-energized';
    } else if (nivel === 'BAJO') {
      return 'button-balanced';
    }
  }

  //funcion que deshabilitara las preguntas deacuerdo a las restricciones dadas
  createRiesgo.habilitarPreguntas = function() {
    //habilitar todas las preguntas
    for (var i = 1; i < createRiesgo.preguntasList.length; i++) {
      createRiesgo.preguntasList[i].isDisabled = false;
    }
    //deshabilitar las preguntas 2, 3 y 4 si la pregunta 1 es sin personal
    if (createRiesgo.respuestas['1'] === 'SIN PERSONAL') {
      for (var i = 1; i < 4; i++) {
        createRiesgo.preguntasList[i].isDisabled = true;
      }
    }
    //deshabilitar la pregunta 6 si la pregunta 5 es false
    if (!createRiesgo.respuestas['5']) {
      createRiesgo.preguntasList[5].isDisabled = true;
    }
  }

  createRiesgo.guardia = [{ text: "Día", value:'DIA'}, { text: "Noche", value:'NOCHE'}];
  createRiesgo.insp_guard = {guardia: 'DIA' };

  createRiesgo.opcionlabor = [{ text: "Si", value: true},{text: "No", value: false}];
  createRiesgo.inps_OL = {sostenimiento: true };

  createRiesgo.geomecanica = [{ text: "Cumplió", value: true},{text: "No Cumplió", value: false}];
  createRiesgo.insp_recomendacion = {rgeo: true };

  createRiesgo.install = [{ text: "Correcta", value: true},{text: "Incorrecta", value: false}];
  createRiesgo.insp_install = {resp: true };


  createRiesgo.guardarinspeccion = function() {

    fecha = createRiesgo.datepickerObject.inputDate;

    var inspeccion = new Inspeccion();

    inspeccion.periodo = createRiesgo.insp_guard.guardia;
    inspeccion.recomendacion = createRiesgo.insp_recomendacion.rgeo;
    inspeccion.instalacion = createRiesgo.insp_install.resp;
    inspeccion.comentario = createRiesgo.comment;
    inspeccion.ancho_real = createRiesgo.ancho_real;
    inspeccion.alto_real = createRiesgo.alto_real;
    inspeccion.fecha = fecha;
    inspeccion.laborCodigo = createRiesgo.labor.codigo;
    inspeccion.recomendacion = createRiesgo.insp_recomendacion.rgeo;
    inspeccion.estado = createRiesgo.inps_OL.sostenimiento;

    inspeccion.ResponsableUid = createRiesgo.responsable.uid;
    inspeccion.SeguridadUid = createRiesgo.seguridad.uid;
    inspeccion.GeomecanicoUid = createRiesgo.geomecanico.uid;
    inspeccion.OperacionesUid = createRiesgo.operaciones.uid;

    inspeccion.tipo = createRiesgo.labor.tipoTipoId;
    inspeccion.RocaId = createRiesgo.tipo_roca;
    inspeccion.SostenimientoId = createRiesgo.tipo_sostenimiento;
    inspeccion.respuestas = createRiesgo.respuestas;

    inspeccion.nivel_riesgo = createRiesgo.nivelRiesgo;

    inspeccion.$save(function() {
      alert('Inspeccion Guardada');
    });
  }

  //modal de tablas de sostenimiento
  createRiesgo.rocas = Roca.query();
  createRiesgo.sostenimientos = Sostenimiento.query({tipo: createRiesgo.tipo});

  createRiesgo.cargarTipo = function() {
    createRiesgo.rocas = Roca.query();
    createRiesgo.sostenimientos = Sostenimiento.query({tipo: createRiesgo.labor.tipoTipoId});

    $ionicModal.fromTemplateUrl('popupSostenimiento.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      createRiesgo.modal = modal;
    });
  }


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

  //modal para editar el usuario
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

  //modal para cambiar la contrasena del usuario
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

//modal para crear usuarios
  $ionicModal.fromTemplateUrl('createUser.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    users.modal_create = modal;
  });

  users.openCreate = function() {
    users.modal_create.show();
  }

  users.closeCreate = function() {
    var user = new Usuario();
    user.uid = users.nuevo.uid;
    user.dni = users.nuevo.dni;
    user.nombre = users.nuevo.nombre;
    user.password = users.nuevo.password;
    user.rol_id = users.nuevo.rol_id;
    user.correo = users.nuevo.correo;
    user.$save(function() {
      users.modal_create.hide();
      users.usuarios = Usuario.query();
    });
  }

  users.cancelCreate = function() {
    users.modal_create.hide();
  }

  users.verificarNombre = function() {
    if (!/^([a-zA-ZñÑ-áéíóúÁÉÍÓÚ\s])*$/.test(users.nuevo.nombre)) {
      users.nuevo.nombre = users.nuevo.nombre.slice(0, users.nuevo.nombre.length - 1);
    }
  }

  users.verificarEmail = function() {
    if (!/\S+@\S+\.\S+/.test(users.nuevo.correo)) {
      users.nuevo.correo = '';
    }
  }

  users.verificarDni = function() {
    if (!/^([0-9])*$/.test(users.nuevo.dni)) {
      users.nuevo.dni = users.nuevo.dni.slice(0, users.nuevo.dni.length - 1);
    }
    if (users.nuevo.dni.length > 8) {
      users.nuevo.dni = users.nuevo.dni.slice(0, users.nuevo.dni.length - 1);
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



.controller('createLaborCtrl', ['Labor', 'Tipo', 'Empresa', '$state',
function(Labor, Tipo, Empresa, $state) {

  createLabor = this;

  createLabor.tipos = Tipo.query();
  createLabor.empresas = Empresa.query();

  createLabor.nuevaLabor = function() {

    var labor = new Labor();
    labor.codigo = createLabor.labor.codigo;
    labor.nombre = createLabor.labor.nombre;
    labor.nivel = createLabor.labor.nivel;
    labor.alto_pro = createLabor.labor.alto_pro;
    labor.ancho_pro = createLabor.labor.ancho_pro;
    labor.tipoTipoId = createLabor.labor.tipoTipoId;
    labor.empresaEmpresaid = createLabor.labor.empresaEmpresaid;
    labor.$save(function() {
      $state.go('tabsLabores.labores');
    });

  }

}])
