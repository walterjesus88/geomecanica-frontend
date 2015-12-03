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

				dibujarContenedor(ctx);
				dibujarAreas(ctx, colores);
				dibujarLineas(ctx);
				dibujarSostenimientos(ctx);
				dibujarRocas(ctx);

			});

			element.bind('click', function(event) {
				var ejex = event.offsetX;
				var ejey = event.offsetY;
				var ctx = element[0].getContext('2d');
				var defered = $q.defer();
				var defered1 = $q.defer();
				if (ejex >= 450 && ejex <= 650 && ejey >= 250 && ejey <= 520) {
					//verificar en que cuadradito se hizo click
					var cuadro = getCuadro(ctx, ejex, ejey);
					$scope.rocas.$promise.then(function(rocas) {
						rocas.forEach(function(roca) {
							if (roca.codigo === cuadro) {
								$scope.tiporoca = roca.rocaid;
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

			function getCuadro(ctx, x, y) {
				var sup = '';
				var est = '';
				if (y >= 250 && y <= 340) {
					est = 'F';
				} else if (y >= 340 && y <= 430) {
					est = 'MF';
				} else if (y >= 430 && y <= 520) {
					est = 'IF';
				}
				if (x >= 450 && x <= 500) {
					sup = 'B';
				} else if (x >= 500 && x <= 550) {
					sup = 'R';
				} else if (x >= 550 && x <= 600) {
					sup = 'P';
				} else if (x >= 600 && x <= 650) {
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

			function dibujarSostenimientos(ctx) {
				$scope.sostenimientos.$promise.then(function(sostenimientos) {
					var i = 40;
					sostenimientos.forEach(function(item) {
						ctx.fillStyle = item.color;
						ctx.fillRect(210, i, 25, 20);
						ctx.strokeStyle = '#000';
						ctx.strokeRect(210, i, 25, 20);
						ctx.fillStyle = '#000';
						ctx.font = "bold 16px Arial";
						ctx.fillText(item.codigo, 217, i + 15);
						ctx.font = "8px Arial";
						dibujarTextoNormal(ctx, item.descripcion, 240, i + 5, 40);
						ctx.fillText(item.tiempo_colocacion, 240, i + 25);
						i = i + 34;
					});
				});
			}

			function dibujarRocas(ctx) {
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
							y = 300;
						}
						if (item.Estructura.codigo === 'MF') {
							y = 390;
						}
						if (item.Estructura.codigo === 'IF') {
							y = 480;
						}

						if (item.Superficie.codigo === 'B') {
							x = 460 - c;
						}
						if (item.Superficie.codigo === 'R') {
							x = 510 - c;
						}
						if (item.Superficie.codigo === 'P') {
							x = 560 - c;
						}
						if (item.Superficie.codigo === 'MP') {
							x = 610 - c;
						}
						ctx.fillStyle = '#000';
						ctx.fillText(item.codigo, x, y);
						ctx.strokeStyle = '#fff';
						ctx.strokeText(item.codigo, x, y);
						console.log(item);
						ctx.font = "10px Arial";
						if (item.Estructura.codigo === 'F' && cf === 0) {
							cf = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.fillText(item.Estructura.condicion, 205, y - 30);
							ctx.fillStyle = '#000';
							dibujarTextoNormal(ctx, item.Estructura.descripcion, 205, y - 20, 35);
						} else if (item.Estructura.codigo === 'MF' && cmf === 0) {
							cmf = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.fillText(item.Estructura.condicion, 205, y - 30);
							ctx.fillStyle = '#000';
							dibujarTextoNormal(ctx, item.Estructura.descripcion, 205, y - 20, 35);
						} else if (item.Estructura.codigo === 'IF' && cif === 0) {
							cif = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.fillText(item.Estructura.condicion, 205, y - 30);
							ctx.fillStyle = '#000';
							dibujarTextoNormal(ctx, item.Estructura.descripcion, 205, y - 20, 35);
						}

						if (item.Superficie.codigo === 'B' && cb === 0) {
							cb = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, 240);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, 240, 40);
						} else if (item.Superficie.codigo === 'R' && cr === 0) {
							cr = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, 240);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, 240, 40);
						} else if (item.Superficie.codigo === 'P' && cp === 0) {
							cp = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, 240);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, 240, 40);
						} else if (item.Superficie.codigo === 'MP' && cmp === 0) {
							cmp = 1;
							ctx.fillStyle = 'PURPLE';
							ctx.save();
							ctx.translate(x + c, 240);
							ctx.rotate(-0.5*Math.PI);
							ctx.fillText(item.Superficie.condicion, 0, 0);
							ctx.restore();
							ctx.fillStyle = '#000';
							dibujarTextoVertical(ctx, item.Superficie.descripcion, x + c + 10, 240, 40);
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

			function dibujarAreas(ctx, colores) {

				ctx.beginPath();
				ctx.fillStyle = colores[0];
				ctx.moveTo(450, 250);
				ctx.lineTo(550, 250);
				ctx.lineTo(450, 430);
				ctx.lineTo(450, 250);
				ctx.closePath();
				ctx.fill();

				ctx.beginPath();
				ctx.fillStyle = colores[1];
				ctx.moveTo(550, 250);
				ctx.lineTo(600, 250);
				ctx.lineTo(450, 520);
				ctx.lineTo(450, 430);
				ctx.lineTo(550, 250);
				ctx.closePath();
				ctx.fill();

				ctx.beginPath();
				ctx.fillStyle = colores[2];
				ctx.moveTo(600, 250);
				ctx.lineTo(650, 250);
				ctx.lineTo(500, 520);
				ctx.lineTo(450, 520);
				ctx.lineTo(600, 250);
				ctx.closePath();
				ctx.fill();

				ctx.beginPath();
				ctx.fillStyle = colores[3];
				ctx.moveTo(650, 250);
				ctx.lineTo(650, 340);
				ctx.lineTo(550, 520);
				ctx.lineTo(500, 520);
				ctx.lineTo(650, 250);
				ctx.closePath();
				ctx.fill();

				ctx.beginPath();
				ctx.fillStyle = colores[4];
				ctx.moveTo(650, 340);
				ctx.lineTo(650, 430);
				ctx.lineTo(600, 520);
				ctx.lineTo(550, 520);
				ctx.lineTo(650, 340);
				ctx.closePath();
				ctx.fill();

				ctx.beginPath();
				ctx.fillStyle = colores[5];
				ctx.moveTo(650, 430);
				ctx.lineTo(650, 520);
				ctx.lineTo(600, 520);
				ctx.lineTo(650, 430);
				ctx.closePath();
				ctx.fill();
			}

			function dibujarLineas(ctx) {

				ctx.beginPath();

				ctx.moveTo(200, 250);
				ctx.lineTo(650, 250);
				ctx.moveTo(200, 340);
				ctx.lineTo(650, 340);
				ctx.moveTo(200, 430);
				ctx.lineTo(650, 430);

				ctx.moveTo(600, 20);
				ctx.lineTo(600, 520);
				ctx.moveTo(550, 20);
				ctx.lineTo(550, 520);
				ctx.moveTo(500, 20);
				ctx.lineTo(500, 520);
				ctx.moveTo(450, 20);
				ctx.lineTo(450, 520);

				ctx.stroke();
				ctx.closePath();
			}

			function dibujarContenedor(ctx) {
				ctx.strokeRect(200, 20, 450, 500);
				ctx.fillStyle = '#fff';
				ctx.fillRect(200, 20, 450, 500);
			}
		}
	}



}])
