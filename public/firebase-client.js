angular
  .module("app")
  .factory("firebaseClient", [
    "$firebaseObject",
    "$firebaseAuth",
    function ($firebaseObject, $firebaseAuth) {
      var config = {
        apiKey: "AIzaSyDMElXSW444x1gyCNo2msWfnNBeTgEwbB0",
        authDomain: "peterzhao-1012.firebaseapp.com",
        databaseURL: "https://peterzhao-1012.firebaseio.com",
        projectId: "peterzhao-1012",
        storageBucket: "peterzhao-1012.appspot.com",
        messagingSenderId: "129526295252",
        appId: "1:129526295252:web:f3a89fd3e319d35978e941",
      };
      
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      
      var auth = $firebaseAuth();
      return {
        startAuthUI: function () {
          var uiConfig = {
            signInSuccessUrl: "/",
            signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
          };
          var ui = new firebaseui.auth.AuthUI(firebase.auth());
          ui.start("#firebaseui-auth-container", uiConfig);
        },
        bindToDb: function (userId, $scope, prop) {
          var ref = firebase.database().ref("notes/" + userId);
          var syncObject = $firebaseObject(ref);
          syncObject.$bindTo($scope, prop);
        },
        onAuthStateChanged: function (handler) {
          auth.$onAuthStateChanged(handler);
        },
        signOut: function () {
          auth.$signOut();
        },
      };
    },
  ]);
