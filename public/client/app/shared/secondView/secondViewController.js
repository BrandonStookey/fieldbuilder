'use strict';

angular.module('project.secondView', ['angular-loading-bar'])

.controller('secondViewController', ['$scope', 'projectFactory', function($scope, projectFactory){
	$scope.boolean = projectFactory.boolean;
	console.log('projectFactory.boolean: ', projectFactory.boolean);

	console.log('secondView Boolean: ', $scope.boolean);

	console.log('I am secondViewController!')

}]);