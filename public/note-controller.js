angular
  .module("app")
  .controller("NoteController", [
    "$scope",
    "firebaseClient",
    function ($scope, firebaseClient) {
      $scope.userName = null;
      $scope.userId = null;
      $scope.signOut = firebaseClient.signOut;
      $scope.authStateHandler = function (user) {
        if (user) {
          $scope.userName = user.displayName;
          $scope.userId = user.uid;
          firebaseClient.bindToDb($scope.userId, $scope, "data");
        } else {
          $scope.userName = null;
        }
      };
      firebaseClient.onAuthStateChanged($scope.authStateHandler);
      firebaseClient.startAuthUI();
    },
  ]);
