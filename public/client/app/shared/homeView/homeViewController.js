'use strict';

angular.module('project.homeView', ['ui.bootstrap', 'ngAnimate', 'ngSanitize','angular-loading-bar'])

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

		projectFactory.createForm(label, default1, choices, order).then(function(result){
      console.log('createForm: ', result);
    });

		console.log('label: ', label);
		console.log('default: ', default1);
		console.log('choice: ', choices);
		console.log('order: ', order);
	}

//=========================Textarea and Div
  $scope.$watch('choice', function(newValue){
    if(newValue === undefined){
      $("#textareaDiv").html('<div></div>');
    }
    var tempString;
    var newString = '';
    var newValue = newValue.split('\n');

    for(var i = 0; i < newValue.length; i++){
      if(newValue[i].length === 0){
        $scope.color = "black";
      }

      if(newValue[i].length > 4){

        var resultValue = newValue[i].split('');
        tempString = resultValue.splice(2);
        resultValue = resultValue.join('');
        tempString = tempString.join('');

        tempString = '<span style ="color: red">' + tempString + '</span>';
        newString = newString + ' '+ resultValue + tempString + '<br>';
      } else {

        console.log('else: ', newString);
        console.log('else: ', newValue[i]);
        newString = newString + ' ' + newValue[i] + '<br>';
        console.log('else after concat: ', newString);
      }
    }

    $("#textareaDiv").html('<div>' + newString + '</div>');
  });
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
});