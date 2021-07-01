const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Session = require("../models/session");
const { User } = require("../models");
const session = require("../models/session");

const validar_session = async (req = request, res = response, next) => {
  console.log("VALIDANDO EL CODE DE SESION");
  const code = req.params.id;
  console.log(req.params);
  // console.log("code:" + code);
  const session = await Session.findOne({ code: code });

  // console.log("session: " + session);
  // console.log("session: " + session.active);

  if (Object.keys(session).length === 0 || !session.active) {
    // console.log("LA SESSION NO ES VALIDA");
    // return res.status(401).json({
    //   message: "El codigo de la sesion no exite",
    // });
    return res.render("404");
    // next("404");
  }
  req.sesion = session;
  console.log("TERMINANDO DE VALIDAR SESION");
  next();
};

const validate_user_session = async (req = request, res = response, next) => {
  console.log("VALIDADNDO USER_SESSION");
  if (!req.session.token) {
    res.redirect("/signin");
  }

  try {
    const token = req.session.token;
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    // leer el usuario que corresponde al uid
    const user = await User.findById(uid);
    req.user = user;
  } catch (error) {
    console.log(error);
    console.log("ERROR EN VALIDAR_USER_SESSION");
    req.session.destroy();
    res.redirect("/signin");
  }
  // console.log(req.user);
  console.log("TERMINANDO DE VALIDAR_USER_SESSION");
  next();
};

module.exports = {
  validar_session,
  validate_user_session,
};
