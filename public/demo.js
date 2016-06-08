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
  let id = document.getElementById("id");
  if(id)
  	id = id.value
  else
  	id = ""
  $http.get('/checkBoxGroup?_id=' + id ).then(function(res){
        $scope.cbg = res.data;
			  angular.forEach($scope.cbg,function(cb,index){
			  	console.log('check : ' + cb.check);
			  	if(cb.check===true)
			  		$scope.selection.push(cb._id)
			  })
			  console.log('selection : ' + $scope.selection);
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
  };
});
angular.bootstrap(document.getElementById("App2"), ['myApp']);