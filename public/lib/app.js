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

app.controller('checkList',function ($scope, $http) {
  // $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  //,"_id="+document.getElementById('_id').value
  var checkedList = document.getElementById('list').value
  $http.post('/ServiceList').then(function(res){
        $scope.models = res.data;
        $scope.models.forEach(function(model){
          if(checkedList.indexOf(model._id) > -1)
            model.checked = true
          else
            model.checked = false
        })
  });
})

app.controller('logContoller',function ($scope, $http, $interval) {

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
