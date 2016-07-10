'use strict';

angular.module('project.homeView', ['ui.bootstrap', 'ngAnimate'])

.controller('homeViewController', ['$scope', 'projectFactory', function($scope, projectFactory){
	console.log('I am homeViewController!!!');
	
	$scope.color; 
	$scope.maxlength = 5;
	$scope.fieldServiceResult;
	$scope.label;
	$scope.default;
	$scope.choices;
	$scope.choice = '';
	$scope.count = 0;

	console.log($scope.fieldServiceResult);

	projectFactory.getFieldService().then(function(result){
		$scope.choices = result.data.choices;
		$scope.fieldServiceResult = result.data
		$scope.label = $scope.fieldServiceResult.label;
		$scope.default = $scope.fieldServiceResult.default;

		for(var i = 0; i < $scope.choices.length; i++){
			$scope.choice += $scope.choices[i] + '\n';
		}

		console.log('result: ', result.data.label);
	
	});

  $scope.clearFields = function(){
    $scope.label = '';
    $scope.default = '';
    $scope.choice = '';
  }

	$scope.formInfo = function(label, default1, choices, order){
		if(order === 'options1'){
			choices = choices.split('\n').sort();
		}

		projectFactory.createForm(label, default1, choices, order);

		console.log('label: ', label);
		console.log('default: ', default1);
		console.log('choice: ', choices);
		console.log('order: ', order);
	}

	$scope.userContent = '';
  $scope.$watch('choice', function(newValue){ 

  	 var resultArray = newValue.split('\n'); 
  	 console.log('newValue length: ', newValue.length);
     console.log('newValue: ', newValue.split('\n'));

     if(newValue.length > 12){
   //   	for(var i = 0; i < resultArray.length; i++){
   //   		if(resultArray[i].length > 4){
   //        // $scope.choice.splice()
  	//      	console.log('<span ng-bind-html="userContent" ng-style="{color: red}">' + resultArray[i].split('').splice(4) + '</span>');
   //        $scope.choice +=  '<span ng-bind-html="userContent" ng-style="{color: red}">' + newValue[i] + '</span>';
   //      }

     		// $scope.color = 'red';
       	console.log('Empty');

     } else if (newValue.length < 10){
     		 $scope.color = 'black';
     } else {
       console.log('Has content');
     }
  });

 //  $('#test2').on({
 //  	// http://stackoverflow.com/questions/23392935/html-textarea-color-characters-after-maxlength
 //    focus: function() {
        
 //        if (this.value.length >= 10) $('#test1').focus();
 //    },
 //    keyup: function() {
 //        if (this.value.length >= 10) $('#test1').focus();
 //        $('#test1').val(this.value)
 //    }
	// })
}])
//this directive limits the maxline in the users' choices box
.directive('maxlines', function() {
	// http://stackoverflow.com/questions/26497492/limit-number-of-lines-or-rows-in-textarea
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      var maxLines = 1;
      attrs.$observe('maxlines', function(val) {
        maxLines = parseInt(val);
      });
      ngModel.$validators.maxlines = function(modelValue, viewValue) {
        var numLines = (modelValue || '').split("\n").length;
        return numLines <= maxLines;
      };
      attrs.$observe('maxlinesPreventEnter', function(preventEnter) {
        // if attribute value starts with 'f', treat as false. Everything else is true
        preventEnter = (preventEnter || '').toLocaleLowerCase().indexOf('f') !== 0;
        if (preventEnter) {
          addKeypress();
        } else {
          removeKeypress();
        }
      });

      function addKeypress() {
        elem.on('keypress', function(event) {
          // test if adding a newline would cause the validator to fail
          if (event.keyCode == 13 && !ngModel.$validators.maxlines(ngModel.$modelValue + '\n', ngModel.$viewValue + '\n')) {
            event.preventDefault();
          }
        });
      }

      function removeKeypress() {
        elem.off('.maxlines');
      }

      scope.$on('$destroy', removeKeypress);
    }
  };
})
.directive('contenteditable', ['$sce', function($sce) {
	// https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#custom-control-example
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };

}]);
