var url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/"
  : "https://restserver-curso-fher.herokuapp.com/api/auth/google";

const crear = document.getElementById("create");
const logout = document.getElementById("logout");

crear.addEventListener("click", (e) => {
  // user.token = token;
  console.log("click en el button");
  axios
    .get(url + "session/create/now", { withCredentials: true })
    .then((res) => {
      // console.log(res);
      // console.log(res.data.code);
      let code = res.data.code;
      window.location = "/session/" + code;
    })
    .catch((e) => {
      console.log("ErrOR");
      console.log(e);
    });
});

logout.addEventListener("click", (e) => {
  console.log("Click en logout");
  // onLoad();
  axios
    .post(url + "logout", { withCredentials: true })
    .then((then) => {
      if(typeof signOut === 'function') {
        //Es seguro ejecutar la función
        signOut();
    }
      window.location = "/signin";
    })
    .catch((e) => {
      console.log(e);
    });
});
