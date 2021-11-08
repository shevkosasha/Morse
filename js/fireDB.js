firebase.initializeApp({
  apiKey: "AIzaSyAoS3nXGYz5mgMHte-Yb6eLA743xE1eqS4",
  authDomain: "morse-8ec80.firebaseapp.com",
  databaseURL: "https://morse-8ec80-default-rtdb.firebaseio.com",
  projectId: "morse-8ec80",
  storageBucket: "morse-8ec80.appspot.com",
  messagingSenderId: "836952105124",
  appId: "1:836952105124:web:cc71e5839f6f5c74a84631",
  measurementId: "G-NLLBE2TY0E"
  });

  const myDB = firebase.database();
  const myDBRef = firebase.database().ref();
  // const usersRef = dbRef.child('users');
  // const usersRef = myDBRef.child('users');
  // myDB.ref("users/").once("value")
  //           .then(function(snapshot) {
  //               console.log("Users list:");
  //               console.log(snapshot.val());
  //           }).catch(function (error) {
  //               console.log("Error: " + error.code);
  //           });
  // const userListUI = document.getElementById("userList");
    // usersRef.on("child_added", snap => {
    //   let user = snap.val();
    //   console.log(user);
      // let $li = document.createElement("li");
      // $li.innerHTML = user.name;
      // $li.setAttribute("child-key", snap.key);
      // $li.addEventListener("click", userClicked) userListUI.append($li);
  // });