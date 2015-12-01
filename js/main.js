// Create app
var myApp = angular.module('myApp', ['ui.router', 'firebase']);

//App Factory
myApp.factory("Auth", function ($firebaseAuth) {
	var ref = new Firebase('');
	return $firebaseAuth(ref);
});

//App Config
myApp.config(function ($stateProvider) {
	$stateProvider
		.state('index', {
			url: '',
			templateUrl: 'templates/home.html',
			controller: 'HomeController'
		})
});