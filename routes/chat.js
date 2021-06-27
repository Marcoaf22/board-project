const { Router } = require("express");

const router = Router();

router.get("/:id", (req, res) => {
  // console.log(path.join(__dirname, "../views/chat.html"));
  // res.sendFile(path.join(__dirname, "../views/chat.html"));
  res.render("chat");
});

module.exports = router;
