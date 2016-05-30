var app = angular.module('myApp',[])

app.directive('tooltipLoader', function() {
  return function(scope, element, attrs) {
    element.tooltip({
      trigger:"hover",
      placement: "right"
    });
  };
});

app.controller('MainController',function ($scope, $http) {
	$http.get('/data').then(function(res){
        $scope.models = res.data;
  });
})