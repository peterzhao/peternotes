$(function () {
  var backendHostUrl = "<your-backend-url>";

  var config = {
    apiKey: "AIzaSyDMElXSW444x1gyCNo2msWfnNBeTgEwbB0",
    authDomain: "peterzhao-1012.firebaseapp.com",
    databaseURL: "https://peterzhao-1012.firebaseio.com",
    projectId: "peterzhao-1012",
    storageBucket: "peterzhao-1012.appspot.com",
    messagingSenderId: "129526295252",
    appId: "1:129526295252:web:f3a89fd3e319d35978e941",
  };

  var userIdToken = null;

  function configureFirebaseLogin() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        $("#logged-out").hide();
        var name = user.displayName;

        var welcomeName = name ? name : user.email;

        user.getIdToken().then(function (idToken) {
          userIdToken = idToken;

          /* Now that the user is authenicated, fetch the notes. */
          // fetchNotes();

          $("#user").text(welcomeName);
          $("#logged-in").show();
        });
      } else {
        $("#logged-in").hide();
        $("#logged-out").show();
      }
    });
  }

  // [START configureFirebaseLoginWidget]
  // Firebase log-in widget
  function configureFirebaseLoginWidget() {
    var uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    };

    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
  function fetchNotes() {
    $.ajax(backendHostUrl + "/notes", {
      /* Set header for the XMLHttpRequest to get data from the web server
      associated with userIdToken */
      headers: {
        Authorization: "Bearer " + userIdToken,
      },
    }).then(function (data) {
      $("#notes-container").empty();
      // Iterate over user data to display user's notes from database.
      data.forEach(function (note) {
        $("#notes-container").append($("<p>").text(note.message));
      });
    });
  }
  var signOutBtn = $("#sign-out");
  signOutBtn.click(function (event) {
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

  // Save a note to the backend
  var saveNoteBtn = $("#add-note");
  saveNoteBtn.click(function (event) {
    event.preventDefault();

    var noteField = $("#note-content");
    var note = noteField.val();
    noteField.val("");

    /* Send note data to backend, storing in database with existing data
    associated with userIdToken */
    $.ajax(backendHostUrl + "/notes", {
      headers: {
        Authorization: "Bearer " + userIdToken,
      },
      method: "POST",
      data: JSON.stringify({ message: note }),
      contentType: "application/json",
    }).then(function () {
      // Refresh notebook display.
      fetchNotes();
    });
  });

  configureFirebaseLogin();
  configureFirebaseLoginWidget();
});
