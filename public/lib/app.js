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
  $http.get('/data',{ cache: false }).then(function(res){
      // console.log('Before assign--------');
      // console.log('$scope.model : ' + $scope.models);
      // console.log('res.data     : ' + res.data.length);
      $scope.models = res.data;
      // console.log('After assign--------');
      // console.log('$scope.model : ' + $scope.models.length);
      // console.log('res.data     : ' + res.data.length);
  });
  $http.get('/allGroup',{ cache: false }).then(function(res){
      $scope.groups = res.data;
      $scope.groups.unshift(new Object({name:""}))
  });
  $scope.deleteService = function(_id, name, method, url){
    swal({
      title: 'Delete '+name+' service ?',
      text: "Method : " + method + ", URL : " + url,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(function(isConfirm) {
      if (isConfirm) {
        window.location.href = "/delete?_id=" + _id
      }
    })
  }
  $scope.copy = function copy(path){
    var aux = document.createElement("input");
    // Get the text from the element passed into the input
    aux.setAttribute("value",location.host + path);
    // Append the aux input to the body
    document.body.appendChild(aux);
    // Highlight the content
    aux.select();
    // Execute the copy command
    document.execCommand("copy");
    // Remove the input from the body
    document.body.removeChild(aux);
    swal({
      title: 'Copy path',
      text: location.host + path,
      timer: 700,
      showConfirmButton: false,
      type:'success'
    })
  }
})

app.controller('GroupController',function ($scope) {
  $scope.deleteService = function(_id, name, method, url){

    swal({
      title: 'Delete '+name+' service ?',
      text: "Method : " + method + ", URL : " + url,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(function(isConfirm) {
      if (isConfirm) {
        window.location.href = "/delete?_id=" + _id
      }
    })
  }
})

app.controller('checkList',function ($scope, $http) {
  // $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  //,"_id="+document.getElementById('_id').value
  var checkedList = document.getElementById('list').value
  $http.post('/ServiceList',{ cache: false }).then(function(res){
        $scope.models = res.data;
        $scope.models.forEach(function(model){
          if(checkedList.indexOf(model._id) > -1)
            model.checked = true
          else
            model.checked = false
        })
    })

    $scope.list = []
    if(document.getElementById('list').value){
      var ids = document.getElementById('list').value.split(',')
      ids.forEach(function (endp) {
        $scope.list.push(endp)
      })
    }

    $scope.includeId = function(id) {
    var i = $.inArray(id, $scope.list);
      if (i > -1) {
          $scope.list.splice(i, 1);
      } else {
          $scope.list.push(id);
      }
    }
})

app.controller('logContoller',function ($scope, $http, $interval) {

  $scope.toTime = function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }

  getData = function() {
    $http.get('/log',{ cache: false }).then(function(res){
          $scope.logs = res.data;
    })
  }
  getData()
  $interval(function(){
      getData()
  },1000)
})
