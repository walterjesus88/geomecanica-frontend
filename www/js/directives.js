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

}]);