'use strict';

angular.module('project.homeView', ['ui.bootstrap', 'ngAnimate', 'angular-loading-bar'])

.controller('homeViewController', ['$scope', 'projectFactory', function($scope, projectFactory){	
	$scope.label;
	$scope.default;
	$scope.choice = '';
  $scope.bool = true;
//===================Makes an API request to auto-fill form
	projectFactory.getFieldService().then(function(result){
    //logs json data to the console from API request
    console.log('GET request data: ', result.data);
		$scope.label = result.data.label;
		$scope.default = result.data.default;

		for(var i = 0; i < result.data.choices.length; i++){
      if(i === result.data.choices.length - 1){
  			$scope.choice += result.data.choices[i];
      } else {
        $scope.choice += result.data.choices[i] + '\n';
      }
		}
    //checks to see if default is included in choices in api request, if not it is added in
    if(!$scope.choice.includes($scope.default)){
      $scope.choice += '\n' + $scope.default ;
    }
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
    choices = choices.split('\n')
    //checks to see if default is included in choices, if not adds it to the array
    if(!choices.includes($scope.default)){
      console.log('inside of whatever')
      choices[choices.length] = default1;
    }
    
    //Sorts choices in alphabetical order
		if(order === 'abcSort'){
			choices = choices.sort();
		}
    //Invokes $http request in app.module.js
		projectFactory.createForm(label, default1, choices, order).then(function(result){
      console.log('createForm: ', result);
    });
	}

//=========================Textarea and textareaDiv
  $scope.$watch('choice', function(newValue){
    var tempString;
    var newString = '';
    $scope.bool = true;
    //Enables div and textarea to scroll together
    $('.edit').on('scroll', function() {
      $('#textareaDiv').scrollTop($('.edit').scrollTop());
    });

    //If newValue is undefined, it sets the textareaDiv div to an empty div
    if(newValue === undefined){
      $("#textareaDiv").html('<div></div>');
    }
    //if it is not undefined we will split it on the new lines, then iterate over each index to check to see if the characters length exceeds 40
    newValue = newValue.split('\n');

    for(var i = 0; i < newValue.length; i++){
      //If the string is greater than 4, it changes the characters colors to red
      //That exceeds the threshold and then concats it back into newString
      if(newValue[i].length > 40){
        //ResultValue temporarily holds onto newValue's current index and splits it into an array
        //ResultValue is used, just so newValue is not modified, since it is needed to conduct a proper for loop
        //It then splices at 39 and stores it into tempString
        //Result value is joined back into a string, minus the portion spliced off

        var resultValue = newValue[i].split('');
        tempString = resultValue.splice(39);
        resultValue = resultValue.join('');
        tempString = tempString.join('');

        //Temp string is referencing the portion spliced off, and it is joined back together
        //It is now modified by being wraped in a span tag and then concated into a newString
        tempString = '<span style ="color: red">' + tempString + '</span>';
        newString = newString + ' '+ resultValue + tempString + '<br>';
      } else {
        //If the current row is not longer than or equal to 40, it concats into the newString without being modified
          newString = newString + ' ' + newValue[i] + '<br>';
      }
    }
    //Checks to see if any line is greater than or equal to 40 
    newValue.filter(function(element){
      if($scope.bool === false){
        $scope.bool = false;
        //If it is greater than 40, this invalidates the form, so the user can not submit the textarea
        $scope.myForm.myTextarea.$setValidity("default1", $scope.bool);
      } else {
        $scope.bool = element.length <= 40;
        //this validates the form, so the user can submit the textarea
        $scope.myForm.myTextarea.$setValidity("default1", $scope.bool);
      }
    });

    //Once the loop is finished executing, the newString is wrapped in a div and then rendered to the DOM
    //Here it is important to note that our textarea box's background and text is set to transparent
      //the div is aligned perfectly under it and it renders what the user types from the textarea box into the div, the reason this is done, is so the text 
      //can be modified if the user exceeds more than 40 characters on a single line. Texts inside of textarea boxes cannot be modified, the way it is being modified in the div


    $("#textareaDiv").html('<div>' + newString + '</div><br><div></div>');
  });
}])
//This directive limits the maxline in the users' choices box
//If the copies and pasts more than 40 lines, it invalidates the form
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