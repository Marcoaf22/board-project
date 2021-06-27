const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { login, googleSignin } = require("../controllers/auth");
const { validate_user_session } = require("../middlewares/validar_session");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "El id_token es necesario").not().isEmpty(),
    validarCampos,
  ],
  googleSignin
);

router.get("/userId", validate_user_session, (req, res) => {
  res.status(200).json({ id: req.user._id });
});

module.exports = router;
