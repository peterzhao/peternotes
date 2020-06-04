$(function () {
  var config = {
    apiKey: "AIzaSyDMElXSW444x1gyCNo2msWfnNBeTgEwbB0",
    authDomain: "peterzhao-1012.firebaseapp.com",
    databaseURL: "https://peterzhao-1012.firebaseio.com",
    projectId: "peterzhao-1012",
    storageBucket: "peterzhao-1012.appspot.com",
    messagingSenderId: "129526295252",
    appId: "1:129526295252:web:f3a89fd3e319d35978e941",
  };

  var userId = null;

  function configureFirebaseLogin() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        $("#logged-out").hide();
        var name = user.displayName;
        var welcomeName = name ? name : user.email;
        userId = user.uid;
        $("#user").text(welcomeName);
        $("#logged-in").show();
        startToFetchNotes();
        startToSaveNotes();
      } else {
        $("#logged-in").hide();
        $("#logged-out").show();
      }
    });
  }

  function configureFirebaseLoginWidget() {
    var uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    };

    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }

  function startToFetchNotes() {
    firebase
      .database()
      .ref("notes/" + userId)
      .on("value", function (snapshot) {
        var noteInDb = snapshot.val().note;
        var noteField = $("#note-content");
        var note = noteField.val();
        if (note !== noteInDb) {
          noteField.val(noteInDb);
          console.log("*** updated local note from db");
        }
      });
  }

  function startToSaveNotes() {
    var noteField = $("#note-content");
    noteField.on('keyup mouseup change', function () {
      var note = noteField.val();
      firebase
        .database()
        .ref("notes/" + userId)
        .set({
          note: note,
        });
      console.log("*** updated remote note from local");
    });
  }

  $("#sign-out").click(function (event) {
    event.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(
        function () {
          console.log("Sign out successful");
        },
        function (error) {
          console.log(error);
        }
      );
  });

  $("#logged-in").hide();
  $("#logged-out").hide();
  configureFirebaseLogin();
  configureFirebaseLoginWidget();
});
