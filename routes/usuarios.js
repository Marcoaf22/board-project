const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

// router.get("/", usuariosGet);
router.get("/", (req, res) => {
  res.redirect("/home");
});

module.exports = router;
