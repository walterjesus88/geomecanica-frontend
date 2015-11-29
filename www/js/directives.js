angular.module('app.directives', [])

// .directive('blankDirective', [function(){

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
    	template: 	'<div class="selectContainer">'
	                    +'<label class="item item-input item-stacked-label">' 
	                        +'<span class="input-label">{{label}}</span>'
	                            +'<div class="item item-input-inset">'
	                                +'<label class="item-input-wrapper">'
	                                    +'<i class="icon ion-ios7-search placeholder-icon"></i>'
	                                    +'<input id="filtro" type="search"  ng-model="ngModel" ng-value="ngValue" ng-keydown="onKeyDown()"/>'
	                                +'</label>'
	                                +'<button  ng-click="open()">'
	                                    +'<i class="icon ion-chevron-down"></i>'
	                                +'</button>'
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
            	return scope.showHide=!scope.showHide;
	        };

        	element.bind('click',function(){
                var vc=scope.open(); 
            	console.log(vc);
            });

	            
	        scope.onKeyDown = function(){
	        	console.log('onKeyDown');
	            scope.showHide = true;
	        	    if(!scope.ngModel){
	                    scope.showHide = false;
	                }
	        };
	            
	        scope.$watch('ngModel',function(newValue){
	        	
	        	console.log("newvalue"+newValue);

	        	if(newValue)
	          		element.find('input').val(newValue[scope.labelField]);	               
	        });
        },

   

 	 };

}]);