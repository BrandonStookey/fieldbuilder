angular.module('project.services', [])

.factory('projectFactory', ['$http', function($http){

	var getFieldService = function(){	
		console.log('inside of app.module.js!');
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
   return $http({
      method: 'POST',
      url: '/post',
      data: {label: label, default1: default1, choices: choices, order: order}
    })
    .then(function(resp){
      console.log('resp: ', resp);     
    }, function(error){
      console.log(error);
    });
  };

	return{
		getFieldService: getFieldService,
		createForm: createForm
	}
}]);