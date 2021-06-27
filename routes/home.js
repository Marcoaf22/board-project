const { Router } = require("express");

const { validarJWT, validarJWTP } = require("../middlewares");
const { validate_user_session } = require("../middlewares/validar_session");
const Session = require("../models/session");

const router = Router();

router.get("/", validate_user_session, (req, res) => {
  console.log("GET HOME");
  res.render("home", { user: req.user, isGoogle: req.session.isGoogle });
});

module.exports = router;
