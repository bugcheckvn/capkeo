
var app = angular.module('FieldApp', []);

app.controller('FieldCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.field = {};
    $scope.fields = [];
    $scope.currentPosition = {};

    $scope.getCurrentPosition = function () {        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                //console.log(position.coords);
                $scope.$apply(function () {
                    $scope.currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
                    createMarker({ name: 'Vị trí của bạn', location: $scope.currentPosition });
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
        createMarker({ name: field.name, location: { lat: field.lat, lng: field.lng } });
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
    }
    
    $window.initMap = function initMap() {
        var chuvanan = { lat: 10.93957, lng: 106.82459639999999 };

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: chuvanan,
            zoom: 15
        });               

        $scope.infowindow = new google.maps.InfoWindow();
    }

    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: place.location
        });

        google.maps.event.addListener(marker, 'click', function () {            
            $scope.infowindow.setContent(place.name);
            $scope.infowindow.open($scope.map, this);
        });
    }

}]);


