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
angular.bootstrap(document.getElementById("App2"), ['myApp']);