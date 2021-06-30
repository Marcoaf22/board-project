const { Router } = require("express");
const { check } = require("express-validator");
const bcryptjs = require("bcryptjs");

const { User } = require("../models");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const router = Router();

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.get("/signin", (req, res) => {
  console.log("EN GET DE SIGNIN");
  if (req.session.token) {
    res.redirect("/home");
  }
  res.render("users/signin");
});

router.post("/logout", (req, res) => {
  console.log("ROUTE /LOGOUT");
  req.session.destroy();
  res.status(200).json({ message: "ok" });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("En SIGNUP");
  // console.log(name);
  const user = new User({ name, email, password });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  // Guardar en BD
  await user.save();

  const token = await generarJWT(user._id);

  console.log(user);
  req.session.token = token;

  // res.session.test = "hohla";
  res.redirect("/home");
});

router.post("/signin", async (req, res) => {
  console.log("EN SIGNIN");
  console.log(req.session);

  const { email, password } = req.body;
  console.log(email + " " + password);
  try {
    // Verificar si el email existe
    const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(400).json({
    //     msg: "Usuario/Contraseñá no son correctos - correo",
    //   });
    // }

    // SI el user está activo
    // if (!user.state) {
    //   return res.status(400).json({
    //     msg: "Usuario/Contraseñá no son correctos - estado: false",
    //   });
    // }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "user / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(user.id);
    req.session.token = token;
    req.session.isGoogle = false;
    console.log("REDIRIGIENDO A HOME");
    // console.log(req.session);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
});

router.post("/signin_google", async (req, res) => {
  console.log("EN SIGNIN_GOOGLE");
  const { google } = req.body;
  try {
    console.log(google);
    const { email, name, img } = await googleVerify(google);
    console.log("Esperando a google desde el servidor");
    console.log(email);
    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      // No exite -> debo crearlo
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true,
      };
      user = new User(data);
      console.log();
      console.log("Guardando");
      console.log(data);
      await user.save();
    }
    console.log("Generamos el JWT");
    // Generar el JWT
    const token = await generarJWT(user.id);
    req.session.token = token;
    req.session.isGoogle = true;
    res.redirect("/home");
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
});
module.exports = router;
