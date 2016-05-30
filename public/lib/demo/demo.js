var app = angular.module('demo', ['ngSanitize', 'jsonFormatter']);

app.controller('MainCtrl', function ($scope, $http, JSONFormatterConfig) {
  $scope.textarea = '{}';
  $scope.$watch('textarea', function (str){
    var result = {};
    try {
        $scope.textareaJson = JSON.parse(str);
    } catch (e) {}
  });
});
