'use strict';

angular.module('project.homeView', ['ui.bootstrap', 'ngAnimate', 'angular-loading-bar'])

.controller('homeViewController', ['$scope', 'projectFactory', function($scope, projectFactory){	
	$scope.maxlength = 5;
	$scope.label;
	$scope.default;
	$scope.choice = '';
  $scope.bool = true;
//===================Makes an API request to auto-fill form
	projectFactory.getFieldService().then(function(result){
    //logs json data to the console from API request
    console.log('result.data: ', result.data);
		$scope.label = result.data.label;
		$scope.default = result.data.default;

		for(var i = 0; i < result.data.choices.length; i++){
			$scope.choice += result.data.choices[i] + '\n';
		}
    $scope.choice = $scope.choice.split('\n');
    $scope.choice.splice(4);
    $scope.choice = $scope.choice.join('\n')
	});
//====================Allows user to clear input field by clicking on 'cancel'
  $scope.clearFields = function(){
    $scope.label = '';
    $scope.default = '';
    $scope.choice = '';
    $scope.order = '';
  }
//====================Collects form info, then invokes $http request in app.module.js
	$scope.formInfo = function(label, default1, choices, order){
    //Sorts choices in alphabetical order
    console.log('ORDER!!!: ', order);
		if(order === 'abcSort'){
			choices = choices.split('\n').sort();
		}
    //Invokes $http request in app.module.js
		projectFactory.createForm(label, default1, choices, order).then(function(result){
      console.log('createForm: ', result);
    });
		console.log('label: ', label);
		console.log('default: ', default1);
		console.log('choices sorted: ', choices);
		console.log('order: ', order);
	}

//=========================Textarea and textareaDiv
  $scope.$watch('choice', function(newValue){
    var tempString;
    var newString = '';
    newValue = newValue.split('\n');

    //If newValue is undefined, it sets the textareaDiv div to an empty div
    if(newValue === undefined){
      $("#textareaDiv").html('<div></div>');
    }

    if(newValue.length > 5){
      newValue.splice(4);
      console.log('look here: ', newValue);
    }

    for(var i = 0; i < newValue.length; i++){
      $scope.bool = true;
      console.log('inside for loop: ', newValue);
      //If the string is greater than 4, it changes the characters colors to red
      //That exceeds the threshold and then concats it back into newString
      if(newValue[i].length > 4){
        //ResultValue temporarily holds onto newValue's current index and splits it into an array
        //ResultValue is used, just so newValue is not modified, since it is needed to conduct a proper for loop
        //It then splices at 2 and stores it into tempString
        //Result value is joined back into a string, minus the portion spliced off

        var resultValue = newValue[i].split('');
        tempString = resultValue.splice(2);
        resultValue = resultValue.join('');
        tempString = tempString.join('');

        //Temp string is referencing the portion spliced off, and it is joined back together
        //It is now modified by being wraped in a span tag and then concated into a newString
        tempString = '<span style ="color: red"><b>' + tempString + '</b></span>';
        newString = newString + ' '+ resultValue + tempString + '<br>';
      } else {
        //If the current row is not longer than 4, it concats into the newString without being modified
        newString = newString + ' ' + newValue[i] + '<br>';
      }
    }
    //Checks to see if any line is greater than restricted amount
    newValue.filter(function(element){
      console.log('element: ', element);
      console.log('bool filter: ', $scope.bool);
      if($scope.bool === false){
        $scope.bool = false;
        $scope.myForm.myTextarea.$setValidity("default1", $scope.bool);
      } else {
        $scope.bool = element.length <= 4;
        $scope.myForm.myTextarea.$setValidity("default1", $scope.bool);
      }
    });

    //Once the loop is finished executing, the newString is wrapped in a div and then rendered to the DOM
    $("#textareaDiv").html('<div>' + newString + '</div>');
  });
}])
//This directive limits the maxline in the users' choices box
//If the copies and pasts more than 5 lines, it invalidates the form
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
//=====================This directive allows form to be validated if it is auto populated
.directive('formAutofillFix', function() {
  // http://victorblog.com/2014/01/12/fixing-autocomplete-autofill-on-angularjs-form-submit/
  return function(scope, elem, attrs) {
    // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
    elem.prop('method', 'POST');

    // Fix autofill issues where Angular doesn't know about autofilled inputs
    if(attrs.ngSubmit) {
      setTimeout(function() {
        elem.unbind('submit').submit(function(e) {
          e.preventDefault();
          elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
          scope.$apply(attrs.ngSubmit);
        });
      }, 0);
    }
  };
});