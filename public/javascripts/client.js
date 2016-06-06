angular.module('visualizerApp', ['ui.router']);

angular.module('visualizerApp')
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise("/home");
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "views/about.html"
    })
    .state('visualizer', {
      url: "/visualizer",
      templateUrl: "views/visualizer.html"
    })
    .state('song', {
      url: "/songs",
      templateUrl: "views/songs.html",
      controller: "visualizerCtrl",
      controllerAs: "ctrl"
    })
    .state('songsShow', {
      url: "/songs/:songId",
      templateUrl: "views/songs-show.html",
      controller: "visualizerShowCtrl",
      controllerAs: "ctrl"
    });
});

angular.module('visualizerApp')
.controller('visualizerCtrl', function($http) {
  console.log('visualizerCtrl is alive!');

  var ctrl = this;
  ctrl.songs = [];

  ctrl.getSongs = function() {
    $http.get('/api/songs').then(function(response){
      ctrl.songs = response.data;
      console.log('ctrl.songs', ctrl.songs);
    });
  };

  ctrl.getSongs();
});

angular.module('visualizerApp')
.controller('visualizerShowCtrl', function($http, $stateParams) {
  console.log('visualizerShowCtrl is alive!');

  var ctrl = this;
  ctrl.song = {};

  $http.get('/api/songs/' + $stateParams.songId).then(function(response){
      ctrl.song = response.data;
  });
});

