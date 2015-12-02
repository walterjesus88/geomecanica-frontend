angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])


.directive('multiSelectDate', [function($filter) {
	return {
		restrict:'E',
		require:'?ngModel',
		templateUrl: 'multiSelectDate',
		link: function(scope, element, attrs, ngModel) {
			if (!ngModel) return;

			ngModel.$render = function() {
		        scope.date = {
		            day: $filter('date')(ngModel.$viewValue, 'dd'),
          			month: $filter('date')(ngModel.$viewValue, 'MM'),
          			year: $filter('date')(ngModel.$viewValue, 'yyyy')
		        };
      		};

      		scope.selects = {
	       		days: function() {
		          // Get number of days based on month + year
		          // (January = 31, February = 28, April = 30, February 2000 = 29) or 31 if no month selected yet
		          var nbDays = new Date(scope.date.year, scope.date.month, 0).getDate() || 31;

		          var daysList = [];
		          for (var i = 1; i <= nbDays; i++) {
		            var iS = i.toString();
		            daysList.push((iS.length < 2) ? '0' + iS : iS); // Adds a leading 0 if single digit
		          }
		          return daysList;
		        },
		        months: function() {
		          var monthList = [];
		          for (var i = 1; i <= 12; i++) {
		            var iS = i.toString();
		            monthList.push((iS.length < 2) ? '0' + iS : iS); // Adds a leading 0 if single digit
		          }
		          return monthList;
		        },
		        years: function() {
		          var yearsList = [];
		          for (var i = endYear; i >= startYear; i--) {
		            yearsList.push(i.toString());
		          }
		          return yearsList;
		        }
	      };
		}
	}
}])


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
.directive('tbSostenimiento', ['Roca', 'Sostenimiento', function(Roca, Sostenimiento) {

	return {
		restric: 'A',
		scope: {
			sostenimientos: '=',
			rocas: '=',
			tiporoca: '=',
			tiposostenimiento: '='
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

				dibujarAreas(ctx, colores);
				dibujarLineas(ctx);

			});

			element.bind('click', function(event) {
				var ejex = event.offsetX;
				var ejey = event.offsetY;
				var ctx = element[0].getContext('2d');
				if (ejex >= 450 && ejex <= 650 && ejey >= 250 && ejey <= 520) {
					//verificar en que cuadradito se hizo click
					var cuadro = getCuadro(ctx, ejex, ejey);
					$scope.rocas.$promise.then(function(rocas) {
						rocas.forEach(function(roca) {
							if (roca.codigo === cuadro) {
								$scope.tiporoca = roca.rocaid;
							}
						});
					});
					//verificar en que color se hizo click
					var color = getColor(ctx, ejex, ejey);
					$scope.sostenimientos.$promise.then(function(sostenimientos) {
						sostenimientos.forEach(function(sost) {
							if (sost.color === color) {
								$scope.tiposostenimiento = sost.sostenimientoid;
							}
						});
					});
				}

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

				ctx.strokeRect(200,20,450,500);

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
		}
	}



}])
