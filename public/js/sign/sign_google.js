var url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/"
  : "https://board-project-sw.herokuapp.com/";

function onSignIn(googleUser) {
  console.log("EN ONSIGNIN");
  var profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log("Name: " + profile.getName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.

  var id_token = googleUser.getAuthResponse().id_token;
  const data = { id_token };

  const form = document.getElementById("form");
  const input = document.getElementById("token_google");

  // axios
  //   .post(url + "google_signin", { google: data }, { withCredentials: true })
  //   .then((data) => {
  //     console.log(data);
  //     window.location = "/home";
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });

  form.action = "/signin_google";
  console.log(data);
  input.value = data.id_token;
  const ur = "http://localhost:8080/signin_google";

  console.log(form);
  form.submit();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
}
