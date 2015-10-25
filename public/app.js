
var app = angular.module('FieldApp', []);

app.controller('FieldCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.field = {};
    $scope.fields = [];
    $scope.currentPosition = {};

    $scope.getCurrentPosition = function () {        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                //console.log(position.coords);
                $scope.$apply(function () {
                    $scope.currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
                });                
            });
        }
        else {
            $scope.geoLocErr = 'Your browser does not support geo location';
        }        
    };

    $scope.getFields = function () {
        if ($scope.currentPosition.lat) {
            var uri = '/search?lat=' + $scope.currentPosition.lat + '&lng=' + $scope.currentPosition.lng + '&maxdistance=5000';
            console.log('uri: ' + uri);
            $http.get(uri).then(function (result) {
                console.log(JSON.stringify(result.data.fields));
                $scope.fields = result.data.fields;
            }, function (err) {
                console.log(err);
            });
        }
        else {
            alert('Bạn chưa chọn vị trí hiện tại');
        }
    }

    $scope.viewOnMap = function (field) {
        console.log(field);
    }

    $scope.saveField = function () {
        $http.post('/fields', {
            lat: $scope.currentPosition.lat,
            lng: $scope.currentPosition.lng,
            name: $scope.field.name,
            phone: $scope.field.phone,
            addr: $scope.field.addr,
            soSan5: $scope.field.sosan5,
            soSan7: $scope.field.soSan7,
            soSan11: $scope.field.soSan11
        }).then(function (result) {
            //console.log(result);
            $scope.currentPosition = {};
            $scope.field = {};
            $scope.message = 'Đã lưu thông tin sân!';
        }, function (err) {
            //console.log(err);
            $scope.message = 'Thất bại. Vui lòng thử lại!';
        });
        //console.log($scope.currentPosition);
        //console.log($scope.field);
    }

}]);