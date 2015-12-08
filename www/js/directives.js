angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])


// .directive('multiSelectDate', [function($filter) {
// 	return {
// 		restrict:'E',
// 		require:'?ngModel',
// 		templateUrl: 'multiSelectDate',
// 		link: function(scope, element, attrs, ngModel) {
// 			if (!ngModel) return;

// 			ngModel.$render = function() {
// 		        scope.date = {
// 		            day: $filter('date')(ngModel.$viewValue, 'dd'),
//           			month: $filter('date')(ngModel.$viewValue, 'MM'),
//           			year: $filter('date')(ngModel.$viewValue, 'yyyy')
// 		        };
//       		};

//  			scope.yearOrder = (attrs.yearOrder && attrs.yearOrder === 'asc') ? false : true;
//       		var endYear = attrs.endYear || new Date().getFullYear(); // default: this year
//       		var startYear = attrs.startYear || startYear - 100; // default: this year - 100

//       		scope.selects = {
// 	       		days: function() {
// 		          // Get number of days based on month + year
// 		          // (January = 31, February = 28, April = 30, February 2000 = 29) or 31 if no month selected yet
// 		          var nbDays = new Date(scope.date.year, scope.date.month, 0).getDate() || 31;

// 		          var daysList = [];
// 		          for (var i = 1; i <= nbDays; i++) {
// 		            var iS = i.toString();
// 		            daysList.push((iS.length < 2) ? '0' + iS : iS); // Adds a leading 0 if single digit
// 		          }
// 		          return daysList;
// 		        },
// 		        months: function() {
// 		          var monthList = [];
// 		          for (var i = 1; i <= 12; i++) {
// 		            var iS = i.toString();
// 		            monthList.push((iS.length < 2) ? '0' + iS : iS); // Adds a leading 0 if single digit
// 		          }
// 		          return monthList;
// 		        },
// 		        years: function() {
// 		          var yearsList = [];
// 		          for (var i = endYear; i >= startYear; i--) {
// 		            yearsList.push(i.toString());
// 		          }
// 		          return yearsList;
// 		        }
// 	        };


// 	        scope.$watch('date', function(date) {
// 		        // IF REQUIRED
// 	        	if (attrs.required) {

// 		          // VALIDATION RULES
// 		          var yearIsValid = !!date.year && parseInt(date.year) <= endYear && parseInt(date.year) >= startYear;
// 		          var monthIsValid = !!date.month;
// 		          var dayIsValid = !!date.day;

// 		          console.log(yearIsValid, monthIsValid, dayIsValid);

// 		          // SET INPUT VALIDITY
// 		          ngModel.$setValidity('required', yearIsValid || monthIsValid || dayIsValid ? true : false);
// 		          ngModel.$setValidity('yearRequired', yearIsValid ? true : false);
// 		          ngModel.$setValidity('monthRequired', monthIsValid ? true : false);
// 		          ngModel.$setValidity('dayRequired', dayIsValid ? true : false);

// 		          // UPDATE NG MODEL
// 		          if (yearIsValid && monthIsValid && dayIsValid) {
// 		            ngModel.$setViewValue(new Date(date.year, date.month - 1, date.day));
// 		          }
// 		        }

// 		        // IF NOT REQUIRED (still need the 3 values filled to update the model)
// 		        else if (date.year && date.month && date.day) {
// 		          ngModel.$setViewValue(new Date(date.year, date.month - 1, date.day));
// 		        }

// 		        // IF NOT REQUIRED (still need the 3 values filled to update the model)
// 		        else if (date.year && date.month && date.day) {
// 		          ngModel.$setViewValue(new Date(date.year, date.month - 1, date.day));
// 		        }
// 		    }, true);


// 		}
// 	}
// }])


.directive('ionSelect',[function(){
	'use strict';
	return {
		restrict: 'EAC',
		scope: {
        	label:'@',
            labelField:'@',
            provider:'=',
            ngModel: '=?',
            ngValue: '=?',
        },
        require: '?ngModel',
        transclude : false,
        replace: false,
    	template: 	'<div >'
	                    +'<label class="item item-input ">'
	                        +'<div class="item item-input-inset">'
	                        +'<button  ng-click="open()"  >'
		                        +'<i class="icon ion-chevron-down"></i>'
		                    +'</button>'

	                            +'<label class="item-input-wrapper">'
	                                +'<i class="icon ion-ios7-search placeholder-icon"></i>'
	                                +'<input id="filtro" type="search"  ng-model="ngModel" ng-value="ngValue" ng-keydown="onKeyDown()"/>'
	                            +'</label>'
	                        +'</div>'
	                    +'</label>'

	                    +'<div class="optionList padding-left padding-right" ng-show="showHide" >'
	        				+'<ion-scroll>'
	                            +'<ul class="list">'
	        						+'<li class="item" ng-click="selecionar(item)" ng-repeat="item in provider | filter:ngModel">{{item[labelField]}}</li>'
	                            +'</ul>'
	        				+'</ion-scroll>'
	                    +'</div>'
                	+'</div>',

        link: function (scope, element, attrs,ngModel) {

        	scope.ngValue = scope.ngValue !== undefined ? scope.ngValue :'item';

            scope.selecionar = function(item){
            	console.log('seleccion');
                ngModel.$setViewValue(item);
                scope.showHide = false;
            };

            scope.open = function(){
            	console.log('estoy en open');
            	scope.ngModel = "";
            	//scope.showHide = false;
            	//return
            	scope.showHide=!scope.showHide;
	        };

        	element.bind('click',function(){
            	console.log('bind');
            });


	        scope.onKeyDown = function(){
	        	console.log('onKeyDown');
	            scope.showHide = true;
	        	    if(!scope.ngModel){
	                    scope.showHide = false;
	                }
	        };

	        scope.$watch('ngModel',function(newValue){
	        	if(newValue)
	          		element.find('input').val(newValue[scope.labelField]);
	        });
        },

 	 };

}])



//directiva para las tablas de sostenimiento
.directive('tbSostenimiento', ['Roca', 'Sostenimiento', '$q', function(Roca, Sostenimiento,$q) {

	return {
		restric: 'A',
		scope: {
			sostenimientos: '=',
			rocas: '=',
			tiporoca: '=',
			tiposostenimiento: '=',
			color: '=',
			porcentaje: '=',
			close: '&'
		},
		link: function($scope, element) {

			$scope.sostenimientos.$promise.then(function (sostenimientos) {

				colores = [];

				sostenimientos.forEach(function(sost) {
					colores.push(sost.color);
				});

				if (colores.length === 5) {
					colores.push('WHITE');
				}

				var ctx = element[0].getContext('2d');

				var inicialx = 200;
				var inicialy = 20;
				var ancho = 450;
				var alto = 560;
				var columna = 50;
				var fila = 90;
				var verticales = [];
				for (var i = 0; i < 4; i++) {
					verticales.push(inicialx + ancho - columna * (4 - i));
				}
				var horizontales = [];
				for (var i = 0; i < 3; i++) {
					horizontales.push(inicialy + alto - fila * (3 - i));
				}

				dibujarContenedor(ctx, inicialx, inicialy, alto, ancho);
				dibujarAreas(ctx, colores, inicialx, inicialy, alto, ancho, horizontales, verticales);
				dibujarLineas(ctx, inicialx, inicialy, ancho, alto, verticales, horizontales);
				dibujarSostenimientos(ctx, inicialx, inicialy);
				dibujarRocas(ctx, inicialx, inicialy, ancho, alto, verticales, horizontales);

			});

			element.bind('click', function(event) {
				var ejex = event.offsetX;
				var ejey = event.offsetY;
				var ctx = element[0].getContext('2d');

				var defered = $q.defer();
				var defered1 = $q.defer();

				var inicialx = 200;
				var inicialy = 20;
				var ancho = 450;
				var alto = 560;
				var columna = 50;
				var fila = 90;
				var verticales = [];
				for (var i = 0; i < 4; i++) {
					verticales.push(inicialx + ancho - columna * (4 - i));
				}
				var horizontales = [];
				for (var i = 0; i < 3; i++) {
					horizontales.push(inicialy + alto - fila * (3 - i));
				}

				if (ejex >= verticales[0] && ejex <= inicialx + ancho && ejey >= horizontales[0] && ejey <= inicialy + alto) {
					//verificar en que cuadradito se hizo click
					var cuadro = getCuadro(ctx, ejex, ejey, inicialx, inicialy, alto, ancho, verticales, horizontales);
					$scope.rocas.$promise.then(function(rocas) {
						rocas.forEach(function(roca) {
							if (roca.codigo === cuadro) {
								$scope.tiporoca = roca.rocaid;
								$scope.porcentaje = roca.porcentaje;
								defered.resolve();
							}
						});
					});
					//verificar en que color se hizo click
					var color = getColor(ctx, ejex, ejey);
					$scope.sostenimientos.$promise.then(function(sostenimientos) {
						sostenimientos.forEach(function(sost) {
							if (sost.color === color) {
								$scope.tiposostenimiento = sost.sostenimientoid;
								switch(color) 
					            {  
					                case 'YELLOW':
										$scope.color = 'button-energized';					              		
					                break;
					                case 'RED':               
										$scope.color = 'button-assertive';
					                break;
					                case 'GREEN':              
										$scope.color = 'button-balanced';					                                    
					                break;         
					               	case 'CYAN':              
										$scope.color = 'button-calm';					                                    
					                break;         
					                case 'BLUE':              
										$scope.color = 'button-positive';					                                    
					                break; 
					                case 'PURPLE':              
										$scope.color = 'button-royal';					                                    
					                break;	
					                default:  
										$scope.color = 'button-light';        
					            }
								defered1.resolve();
							}
						});
					});
				}
				defered.promise.then(function() {
					defered1.promise.then(function() {
						$scope.close();
					});
				});
			});

			function getCuadro(ctx, x, y, inix, iniy, alto, ancho, ver, hor) {
				var sup = '';
				var est = '';
				if (y >= hor[0] && y <= hor[1]) {
					est = 'F';
				} else if (y >= hor[1] && y <= hor[2]) {
					est = 'MF';
				} else if (y >= hor[2] && y <= iniy + alto) {
					est = 'IF';
				}
				if (x >= ver[0] && x <= ver[1]) {
					sup = 'B';
				} else if (x >= ver[1] && x <= ver[2]) {
					sup = 'R';
				} else if (x >= ver[2] && x <= ver[3]) {
					sup = 'P';
				} else if (x >= ver[3] && x <= inix + ancho) {
					sup = 'MP';
				}
				return est + '/' + sup;
			}

			function getColor(ctx, x, y) {
				canales = ctx.getImageData(x, y, 1, 1).data;
				if (canales[0] === 255 && canales[1] === 255 && canales[2] === 0) {
					return 'YELLOW';
				}
				if (canales[0] === 0 && canales[1] === 128 && canales[2] === 0) {
					return 'GREEN';
				}
				if (canales[0] === 0 && canales[1] === 255 && canales[2] === 255) {
					return 'CYAN';
				}
				if (canales[0] === 0 && canales[1] === 0 && canales[2] === 255) {
					return 'BLUE';
				}
				if (canales[0] === 128 && canales[1] === 0 && canales[2] === 128) {
					return 'PURPLE';
				}
				if (canales[0] === 255 && canales[1] === 255 && canales[2] === 255) {
					return 'WHITE';
				}
				if (canales[0] === 255 && canales[1] === 0 && canales[2] === 0) {
					return 'RED';
				}
			}

			function dibujarSostenimientos(ctx, inix, iniy) {
				$scope.sostenimientos.$promise.then(function(sostenimientos) {
					var i = 40;
					sostenimientos.forEach(function(item) {
						ctx.fillStyle = item.color;
						ctx.fillRect(inix + 10, i, 25, 20);
						ctx.strokeStyle = '#000';
						ctx.strokeRect(inix + 10, i, 25, 20);
						ctx.fillStyle = '#000';
						ctx.font = "bold 16px Arial";
						ctx.fillText(item.codigo, inix + 17, i + 15);
						ctx.font = "8px Arial";
						dibujarTextoNormal(ctx, item.descripcion, inix + 40, i + 5, 40);
						ctx.fillText(item.tiempo_colocacion, inix + 40, i + 25);
						i = i + 40;
					});
				});
			}

			function dibujarRocas(ctx, inix, iniy, ancho, alto, ver, hor) {
				$scope.rocas.$promise.then(function(rocas) {
					var cf = 0;
					var cmf = 0;
					var cif = 0;
					var cb = 0;
					var cr = 0;
					var cp = 0;
					var cmp = 0;
					rocas.forEach(function(item) {
						var x = 0;
						var y = 0;
						var c = 0;
						ctx.font = "bold 14px Arial";
						if (item.codigo.length === 5) {
							c = 5;
						} else if (item.codigo.length === 4) {
							c = 3;
						} else if (item.codigo.length === 3) {
							c = -3;
						}
						if (item.Estructura.codigo === 'F') {
							y = hor[0] + 50;
						}
						if (item.Estructura.codigo === 'MF') {
							y = hor[1] + 50;
						}
						if (item.Estructura.codigo === 'IF') {
							y = hor[2] + 50;
						}

						if (item.Superficie.codigo === 'B') {
							x = ver[0] + 10 - c;
						}
						if (item.Superficie.codigo === 'R') {
							x = ver[1] + 10 - c;
						}
						if (item.Superficie.codigo === 'P') {
							x = ver[2] + 10 - c;
						}
						if (item.Superficie.codigo === 'MP') {
							x = ver[3] + 10 - c;
						}
						ctx.fillStyle = '#000';
						ctx.fillText(item.codigo, x, y);
						ctx.strokeStyle = '#fff';
						ctx.strokeText(item.codigo, x, y);
						ctx.font = "10px Arial";
						if (item.Estructura.codigo === 'F' && cf === 0) {
							cf = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.fillText(item.Estructura.condicion, inix + 5, y - 30);
							ctx.fillStyle = '#000';
							dibujarTextoNormal(ctx, item.Estructura.descripcion, inix + 5, y - 20, 35);
						} else if (item.Estructura.codigo === 'MF' && cmf === 0) {
							cmf = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.fillText(item.Estructura.condicion, inix + 5, y - 30);
							ctx.fillStyle = '#000';
							dibujarTextoNormal(ctx, item.Estructura.descripcion, inix + 5, y - 20, 35);
						} else if (item.Estructura.codigo === 'IF' && cif === 0) {
							cif = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.fillText(item.Estructura.condicion, inix + 5, y - 30);
							ctx.fillStyle = '#000';
							dibujarTextoNormal(ctx, item.Estructura.descripcion, inix + 5, y - 20, 35);
						}

						if (item.Superficie.codigo === 'B' && cb === 0) {
							cb = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, hor[0] - 10);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, hor[0] - 10, 40);
						} else if (item.Superficie.codigo === 'R' && cr === 0) {
							cr = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, hor[0] - 10);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, hor[0] - 10, 40);
						} else if (item.Superficie.codigo === 'P' && cp === 0) {
							cp = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, hor[0] - 10);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, hor[0] - 10, 40);
						} else if (item.Superficie.codigo === 'MP' && cmp === 0) {
							cmp = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, hor[0] - 10);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, hor[0] - 10, 40);
						}
					});
				});
			}

			function dibujarTextoNormal(ctx, texto, x, y, largo) {
				var tam = texto.length;
				while (tam > 0) {
					imp = texto.slice(0, largo);
					texto = texto.slice(largo, tam);
					ctx.fillText(imp, x, y);
					tam = texto.length;
					y = y + 10;
				}
			}

			function dibujarTextoVertical(ctx, texto, x, y, largo) {
				var tam = texto.length;
				while (tam > 0) {
					imp = texto.slice(0, largo);
					texto = texto.slice(largo, tam);
					ctx.save();
					ctx.translate(x, y);
					ctx.rotate(-0.5*Math.PI);
					ctx.fillText(imp, 0, 0);
					ctx.restore();
					tam = texto.length;
					x = x + 10;
				}
			}

			function dibujarAreas(ctx, colores, inix, iniy, alto, ancho, hor, ver) {

				for (var i = 0; i < colores.length; i++) {
					ctx.beginPath();
					ctx.fillStyle = colores[i];
					if (i === 0) {
						ctx.moveTo(ver[0], hor[0]);
						ctx.lineTo(ver[2], hor[0]);
						ctx.lineTo(ver[0], hor[2]);
						ctx.lineTo(ver[0], hor[0]);
					} else if (i === 1) {
						ctx.moveTo(ver[2], hor[0]);
						ctx.lineTo(ver[3], hor[0]);
						ctx.lineTo(ver[0], iniy + alto);
						ctx.lineTo(ver[0], hor[2]);
						ctx.lineTo(ver[2], hor[0]);
					} else if (i === 2) {
						ctx.moveTo(ver[3], hor[0]);
						ctx.lineTo(inix + ancho, hor[0]);
						ctx.lineTo(ver[1], iniy + alto);
						ctx.lineTo(ver[0], iniy + alto);
						ctx.lineTo(ver[3], hor[0]);
					} else if (i === 3) {
						ctx.moveTo(inix + ancho, hor[0]);
						ctx.lineTo(inix + ancho, hor[1]);
						ctx.lineTo(ver[2], iniy + alto);
						ctx.lineTo(ver[1], iniy + alto);
						ctx.lineTo(inix + ancho, hor[0]);
					} else if (i === 4) {
						ctx.moveTo(inix + ancho, hor[1]);
						ctx.lineTo(inix + ancho, hor[2]);
						ctx.lineTo(ver[3], iniy + alto);
						ctx.lineTo(ver[2], iniy + alto);
						ctx.lineTo(inix + ancho, hor[1]);
					} else if (i === 5) {
						ctx.moveTo(inix + ancho, hor[2]);
						ctx.lineTo(inix + ancho, iniy + alto);
						ctx.lineTo(ver[3], iniy + alto);
						ctx.lineTo(inix + ancho, hor[2]);
					}
					ctx.closePath();
					ctx.fill();
				}
			}

			function dibujarLineas(ctx, inix, iniy, ancho, alto, ver, hor) {

				ctx.beginPath();

				for (var i = 0; i < hor.length; i++) {
					ctx.moveTo(inix, hor[i]);
					ctx.lineTo(inix + ancho, hor[i]);
				}

				for (var i = 0; i < ver.length; i++) {
					ctx.moveTo(ver[i], iniy);
					ctx.lineTo(ver[i], iniy + alto);
				}

				ctx.stroke();
				ctx.closePath();
			}

			function dibujarContenedor(ctx, x, y, alto, ancho) {
				ctx.strokeStyle = '#000';
				ctx.strokeRect(x, y, ancho, alto);
				ctx.fillStyle = '#fff';
				ctx.fillRect(x, y, ancho, alto);
			}
		}
	}



}])
