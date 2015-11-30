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