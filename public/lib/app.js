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
  $scope.test = "scope"
})

app.controller('logContoller',function ($scope, $http,$interval) {

  $scope.toTime = function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }

  getData = function() {
    $http.get('/log').then(function(res){
          $scope.logs = res.data;
    })
  }
  getData()
  $interval(function(){
      getData()
  },1000)
  $scope.test = "scope"

})
