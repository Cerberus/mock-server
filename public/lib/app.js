var app = angular.module('myApp',[])

app.controller('MainController',function ($scope, $http) {
	$http.get('/data').then(function(res){
        $scope.models = res.data;
  });
})