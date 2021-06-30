const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");

const Session = require("../models/session");

const {
  validar_session,
  validate_user_session,
} = require("../middlewares/validar_session");

const router = Router();

router.get("/:id", [validate_user_session, validar_session], (req, res) => {
  console.log("GET DE SESSION");
  let data = {
    user: req.user,
    session: {
      code: req.params.id,
    },
  };
  let anfitrion = req.user._id.toString() == req.sesion.user_id.toString();
  res.render("sesion", { user: req.user._id, anfitrion });
  // res.render("session", { user: req.user._id });
  console.log("FIN DE GET SESSION");
});

router.post("/", [validate_user_session], async (req, res) => {
  console.log("EN POST SESSION");
  const { id } = req.body;
  const sesion = await Session.findOne({ code: id });
  // console.log(sesion);
  let data = {
    user: req.user,
    session: sesion,
  };
  res.json(data);
  // console.log(data);
  // res.render("session", req.user);
});

router.get("/create/now", validate_user_session, async (req, res) => {
  console.log("EN SESSION CREATE GET");
  // console.log(req.session);
  const code = uuidv4().substring(0, 13);
  const session = new Session({
    user_id: req.user._id,
    code,
  });
  await session.save();
  res.json({
    code,
    message: true,
    session,
  });
});

module.exports = router;
