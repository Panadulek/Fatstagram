var sqlService = "http://panadulek.pl:8080";

angular.module('instagramApp', ['ngRoute', 'ngMaterial'])
.controller('MainCtrl', mainCtrl)
.controller('LoginCtrl', loginCtrl)
.controller('RegisterCtrl', registerCtrl)
.config(function($routeProvider, $mdThemingProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'main.html',
		controller: 'MainCtrl' 
	}).when("/onas", {
		templateUrl: 'aboutus.html',
	}).otherwise({
		controller: 'ErrorCtrl'
	});
	$mdThemingProvider
	.theme('default')
	.primaryPalette('blue-grey', {'default': '900'})
	.warnPalette('red')
	.backgroundPalette('grey');
});
function mainCtrl($scope, $mdDialog) {
	$scope.showLogin = function(ev) {
		$scope.dialog = $mdDialog.show({
			controller: loginCtrl,
			templateUrl: 'loginTmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		}).then(function(status) {
			// zalogowano
		}, function() {
			// wcisniety x
		});
	}
	$scope.showRegister = function(ev){
		$mdDialog.show({
			controller: registerCtrl,
			templateUrl: 'registerTmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		});
	}
	$scope.closeDialog = function() {
		$mdDialog.cancel();
	}
}

function loginCtrl($scope, $mdDialog, $mdToast, $http) {
	$scope.login = function (email, passwd) {
		console.warn("logujemy");
		$http.post(sqlService+"/login", JSON.stringify({'email': email, 'password': passwd})).then(
			function(res) {
				if (res.data.status == "OK") {
					$mdDialog.hide();
					var prompt = $mdToast.simple().textContent("Logged in");
					$mdToast.show(prompt);
				}
				else
					$scope.errorMsg = errors[res.data.errorId];
				console.warn(res.data.status);
			}, 
			function(res) {
				$scope.errorMsg = errors[3]; 
			}
		);
	}
}

function registerCtrl($scope, $http, $mdDialog, $mdToast){
	$scope.register = function(user){
		console.warn("rejestrujemy sie");
		$http.post(sqlService+"/register", JSON.stringify({'username': user.username, 'password': user.password, 'email': user.email})).then(
			function(res){
				if(res.data.status == "OK"){
					$mdDialog.hide();
					var prompt = $mdToast.simple().textContent("Register successful");
					$mdToast.show(prompt);
				}
				else
					$scope.errorMsg = errors[res.data.errorId];	
				console.warn(res.data.status);
			},
			function(res){
				console.log("jebany error w rejestracji");
				$scope.errorMsg = errors[3];
			}
		);
	}
}

