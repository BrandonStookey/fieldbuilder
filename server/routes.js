var app = require('./server');
var request = require('request');
var path1 = require('path');
var public1 = path1.resolve('public') + '/';

var FieldService =  {
	getField: function(id) {
		return {
		  "label": "Sales region",
		  "required": false,
		  "choices": [
			"Asia",
			"Australia",
			"Western Europe",
			"North America",
			"Eastern Europe",
			"Latin America",
			"Middle East and Africa"
		  ],
		  "displayAlpha": true,
		  "default": "North America"
		}
	},
	saveField: function (fieldJson) {
		// Add the code here to call the API (or temporarily, just log fieldJson to the console)
		return this.getField();
	}
}

app.get('/fieldService/', function(req, res) {
    // if(error){
    // 	console.log(error);
    // }
    res.status(200).send(FieldService.saveField()) ;
});

app.post('/post', function(req, res){
	request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.mocky.io/v2/566061f21200008e3aabd919',
  body:    "'" + req.body + "'"
	}, function(error, response, body){
		if(error){
			console.log(error);
		}
		res.status(200).send(body);
	});
})