var app = angular.module('demo', ['ngSanitize', 'jsonFormatter']);

app.controller('MainCtrl', function ($attrs, $scope, $http, JSONFormatterConfig) {
  $scope.textarea = $attrs.text;
  $scope.$watch('textarea', function (str){
    var result = {};
    try {
        $scope.textareaJson = JSON.parse(str);
    } catch (e) {}
  });
});
app.controller('GroupCtrl', function ($scope, $http) {
  $scope.selection = []
  var id = document.getElementById("id");
  if(id)
  	id = id.value
  else
  	id = ""
  $http.get('/checkBoxGroup?_id=' + id ,{ cache: false }).then(function(res){
        $scope.cbg = res.data;
			  angular.forEach($scope.cbg,function(cb,index){
			  	if(cb.check===true)
			  		$scope.selection.push(cb._id)
          document.getElementById("group").value = $scope.selection
          // console.log('value : ', document.getElementById("group").value);
			  })
  });
  $scope.toggleSelection = function toggleSelection(_id) {
      var idx = $scope.selection.indexOf(_id);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selection.push(_id);
      }
      document.getElementById("group").value = $scope.selection
      // console.log('value : ', document.getElementById("group").value);

  };
});
angular.bootstrap(document.getElementById("App2"), ['myApp']);