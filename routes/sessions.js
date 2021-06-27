const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");

const Session = require("../models/session");

const {
  validar_session,
  validate_user_session,
} = require("../middlewares/validar_session");

const router = Router();

router.get("/:id", [validate_user_session, validar_session], (req, res) => {
  let data = {
    user: req.user,
    session: {
      code: req.params.id,
    },
  };
  // console.log(data);
  res.render("session", req.user);
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
  // let url = "/session/" + code;
  // console.log(url);
  // res.redirect(url);
  res.json({
    code,
    message: true,
    session,
  });
});

module.exports = router;
