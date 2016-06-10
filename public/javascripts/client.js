angular.module('visualizerApp', ['ui.router', 'ngAnimate', 'ui.bootstrap']);

angular.module('visualizerApp')
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise("/home");
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    })
});


angular.module('visualizerApp')
.controller('modalCtrl', function ($scope, $uibModal, $log, $http) {

  $scope.animationsEnabled = true;
  $scope.songs = [];

  $scope.getSongs = function() {
    $http.get('/api/songs').then(function(response){
      $scope.songs = response.data;
      console.log('In Scope',$scope.songs);
      $scope.openSong($scope.songs);
    });
  };

  $scope.openSong = function() {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/modal.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        songs: function () {
          return $scope.songs;
        }
      }
    });
  };

    $scope.openAbout = function() {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/about.html',
      controller: 'aboutInstanceCtrl',
    });
  };

});


angular.module('visualizerApp')
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, songs) {

  $scope.songs = songs;

  $scope.selected = {
    song: $scope.songs[0]
  };

  $scope.changeSong = function(song) {
    console.log("Hello");
    console.log(song);
    $('#audioElement').attr("src", "audio/" + song.filename);
    $('#songLoaded').text("  " + song.title + " - " + song.artist);
  };

  $scope.loadSong = function () {
    $uibModalInstance.close($scope.changeSong($scope.selected.song));
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('visualizerApp')
.controller('aboutInstanceCtrl', function ($scope, $uibModalInstance) {

  $scope.close = function () {
    $uibModalInstance.close();
  };
});


    // .state('about', {
    //   url: "/about",
    //   templateUrl: "views/about.html"
    // })
    // .state('song', {
    //   url: "/songs",
    //   templateUrl: "views/songs.html",
    //   controller: "songsCtrl",
    //   controllerAs: "ctrl"
    // })
    // .state('songsShow', {
    //   url: "/songs/:songId",
    //   templateUrl: "views/songs-show.html",
    //   controller: "songsShowCtrl",
    //   controllerAs: "ctrl"
    // });

// angular.module('visualizerApp')
// .controller('songsCtrl', function($http, $uibModal) {
//   console.log('songsCtrl is alive!');

//   var ctrl = this;
//   ctrl.songs = [];

//   ctrl.getSongs = function() {
//     $http.get('/api/songs').then(function(response){
//       ctrl.songs = response.data;
//       console.log('ctrl.songs', ctrl.songs);
//     });
//   };

//   ctrl.getSongs();

//   ctrl.changeSong = function($event) {
//     console.log("Hello");
//     console.log($event.currentTarget.id);
//     $('#audioElement').attr("src", "audio/" + $event.currentTarget.id);
//     $('#songLoaded').text("  " + $event.currentTarget.id);
//   };
//     // $http.get('/api/songs').then(function(response){
//     //   ctrl.songs = response.data;
//     //   console.log('ctrl.songs', ctrl.songs);
//     // });

//     // ctrl.open();

// });

// angular.module('visualizerApp')
// .controller('songsShowCtrl', function($http, $stateParams) {
//   console.log('songsShowCtrl is alive!');

//   var ctrl = this;
//   ctrl.song = {};

//   $http.get('/api/songs/' + $stateParams.songId).then(function(response){
//       ctrl.song = response.data;
//   });
// });

