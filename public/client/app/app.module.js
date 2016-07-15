angular.module('project.services', [])

.factory('projectFactory', ['$http', '$location', function($http, $location){

	var getFieldService = function(){	
		return $http({
			method: 'GET',
			url: '/fieldService/',
		}).then(function(result) {
			return result;
    }, function(err) {
      console.error('Post GET error:', err);
    });
	}

	var createForm = function(label, default1, choices, order){
    console.log('POST request data: ', {label: label, default1: default1, choices: choices, order: order})
    
    return $http({
      method: 'POST',
      url: '/post',
      data: {label: label, default1: default1, choices: choices, order: order}
    })
    .then(function(resp){
      $location.path('/secondView');
      return resp; 
    }, function(error){
      console.log(error);
    });
  };

	return{
		getFieldService: getFieldService,
		createForm: createForm,
	}
}]);