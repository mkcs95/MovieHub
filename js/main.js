var apiKey = 'bdf36392df2c9629ed9d91bfac412943:0:73633609';

// Create app
var myApp = angular.module('myApp', ['ui.router', 'firebase']);

//App Factory
myApp.factory("Auth", function ($firebaseAuth) {
	var ref = new Firebase('https://moviehub.firebaseio.com/');
	return $firebaseAuth(ref);
});

//App Config
myApp.config(function ($stateProvider) {
	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'templates/home.html',
			controller: 'HomeController'
		})

		.state('critic', {
			url: '/critic',
			templateUrl: 'templates/critic.html',
			controller: 'CriticController'
		})

		.state('favorites', {
			url: '/favorites',
			templateUrl: 'templates/favorites.html',
			controller: 'HomeController'
		})

		.state('explore', {
			url: '/explore',
			templateUrl: 'templates/explore.html',
			controller: 'HomeController'
		})

		.state('movie', {
			url: '/movie',
			templateUrl: 'templates/movie.html',
			controller: 'HomeController',
		})
});

myApp.factory('hubService', function () {
	var currentReviewer;
	var currentMovie;
	var currentMovieReviewer;
	var currentMovieID;

	var setCurrentMovie = function (movie, reviewer, id) {
		currentMovie = movie;
		currentMovieReviewer = reviewer;
		currentMovieID = id;
	};

	var getCurrentMovie = function () {
		return currentMovie;
	};

	var getCurrentMovieReviewer = function () {
		return currentMovieReviewer;
	};

	var getCurrentMovieID = function () {
		return currentMovieID;
	};

	var setCurrentReviewer = function (reviewer) {
		currentReviewer = reviewer;
	};

	var getCurrentReviewer = function () {
		return currentReviewer;
	};

	return {
		setCurrentMovie: setCurrentMovie,
		setCurrentReviewer: setCurrentReviewer,
		getCurrentMovie: getCurrentMovie,
		getCurrentMovieReviewer: getCurrentMovieReviewer,
		getCurrentMovieID: getCurrentMovieID,
		getCurrentReviewer: getCurrentReviewer
	};
});

myApp.controller('HomeController', function ($scope, $stateParams, $http, $state, Auth, $firebaseArray, $firebaseObject, hubService) {
	/***REFERENCES AND AUTH***/

	var ref = new Firebase('https://moviehub.firebaseio.com/');

	var usersRef = ref.child("users");

	var moviesRef = ref.child("movies");

    $scope.users = $firebaseObject(usersRef);

	$scope.authObj = Auth;

	$scope.authObj.$onAuth(function (authData) {
		$scope.authData = authData

		if (authData != null) {
			$scope.user = $scope.users[authData.uid];
		}
		else {
			$scope.user = null;
		}

	});

	//Sign Up
	$scope.signUp = function () {

		$scope.authObj.$createUser({
			email: $scope.email,
			password: $scope.password,
		})

			.then($scope.logIn)

		// Once logged in, set and save the user data
			.then(function (authData) {
				$scope.authData = authData;

				//CHANGE
				$scope.users[authData.uid] = {
					firstName: $scope.firstName,
					lastName: $scope.lastName,
					favorites: null
				}

				$scope.users.$save()
			})

			.then(function () {
				$('#signupModal').modal('hide');
			})

			.catch(function (error) {
				console.error("Error: ", error);
			});
	}
	
	// SignIn function
	$scope.signIn = function () {
		$scope.logIn().then(function (authData) {
			$scope.authData = authData;
		})

			.then(function () {
				$('#loginModal').modal('hide');
			})
	}

	// LogIn function
	$scope.logIn = function () {
		console.log('log in')
		return $scope.authObj.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		})
	}

	// LogOut function
	$scope.logOut = function () {
		$scope.authObj.$unauth()
		$scope.authData = null
		$scope.user = null
	}
	
	/***SEARCH***/	
	
	//Search For Reviews By Movie
	
	var moviesUrlFirst = 'http://api.nytimes.com/svc/movies/v2/reviews/search.json?query=';
	var moviesUrlLast = '&critics-pick=Y&api-key=' + apiKey;

	$scope.searchMovies = function () {
		var search = ($scope.searchKeywords).split(' ');

		var stringBuilder = "";

		var s;
		for (s in search) {
			stringBuilder += search[s];
			stringBuilder += "+";
		}

		var moviesUrlComplete = moviesUrlFirst + stringBuilder + moviesUrlLast;

		$http.get(moviesUrlComplete).success(function (response) {
			$scope.searchResults = response.results
		})
	}

	/***MOVIE / REVIEWER SELECTION***/
	
	//Select A Movie
	$scope.selectMovie = function (movieName, movieReviewer, movieID) {
		$scope.currentMovieName = movieName;
		$scope.currentMovieReviewer = movieReviewer;
		$scope.currentMovieID = movieID;
		
		//Check if new movie
		
		
		//If new movie, make new movie object
		
		
		//Set scope movie info
		

		$state.go('movie');
	}
	
	//Select A Reviewer
	$scope.selectReviewer = function (reviewer) {
		hubService.setCurrentReviewer(reviewer);
		
		/*
		
		$scope.currentReviewer = reviewer;
		
		console.log($scope.currentReviewer);

		var reviewersUrlFirst = 'http://api.nytimes.com/svc/movies/v2/reviews/reviewer/';
		var reviewersUrlLast = '.json?critics-pick=Y&api-key=' + apiKey;
		var search;
			
		//Get Reviewer Movies
		if (($scope.currentReviewer).indexOf('. ') > -1) {
			search = ($scope.searchKeywords).split('. ');
		}
		else {
			search = ($scope.searchKeywords).split(' ');
		}

		var stringBuilder = "";

		var s;
		for (s in search) {
			stringBuilder += search[s];
			stringBuilder += "-";
		}

		var reviewersUrlComplete = reviewersUrlFirst + stringBuilder + reviewersUrlLast;

		//Set scope reviewer movies 
		$http.get(reviewersUrlComplete).success(function (response) {
			$scope.currentReviewerMovies = response.results;
			
			console.log("Got Reviewer Movies");
		})
		
		//Get Reviewer Details
				
		var reviewerUrlFirst = 'http://api.nytimes.com/svc/movies/v2/critics/';
		var reviewerUrlLast = '.json?api-key=' + apiKey;
		var reviwerUrlComplete = reviewerUrlFirst + stringBuilder + reviewerUrlLast;
		
		//Set scope reviewer details
		$http.get(reviwerUrlComplete).success(function(response) {
			$scope.currentReviewerDetails = response.results[0]
		})

		*/

		$state.go('critic');
	}
	
	/***ADD A FAVORITE***/

	$scope.addFavorite = function () {

	}
});

myApp.controller('CriticController', function ($scope, $stateParams, $http, $state, Auth, $firebaseArray, $firebaseObject, hubService) {
	$scope.currentReviewer = hubService.getCurrentReviewer();

	var reviewersUrlFirst = 'http://api.nytimes.com/svc/movies/v2/reviews/reviewer/';
	var reviewersUrlLast = '.json?critics-pick=Y&api-key=' + apiKey;
	var search;
			
	//Get Reviewer Movies
	if (($scope.currentReviewer).indexOf('. ') > -1) {
		search = ($scope.currentReviewer).split('. ');
	}
	else {
		search = ($scope.currentReviewer).split(' ');
	}

	var stringBuilder = "";

	var s;
	for (s in search) {
		stringBuilder += search[s];
		stringBuilder += "-";
	}

	var reviewersUrlComplete = reviewersUrlFirst + stringBuilder + reviewersUrlLast;

	//Set scope reviewer movies 
	$http.get(reviewersUrlComplete).success(function (response) {
		$scope.currentReviewerMovies = response.results;
	})
		
	//Get Reviewer Details
				
	var reviewerUrlFirst = 'http://api.nytimes.com/svc/movies/v2/critics/';
	var reviewerUrlLast = '.json?api-key=' + apiKey;
	var reviwerUrlComplete = reviewerUrlFirst + stringBuilder + reviewerUrlLast;
		
	//Set scope reviewer details
	$http.get(reviwerUrlComplete).success(function (response) {
		$scope.currentReviewerDetails = response.results[0]
	})
});