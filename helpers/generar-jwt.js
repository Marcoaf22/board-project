const jwt = require("jsonwebtoken");
const { User, Diagram, Session } = require("../models");
const diagram = require("../models/diagram");
// const session = require("../models/session");

const generarJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const getUser = async (uid) => {
  const user = await User.findById(uid);
  //   console.log(user);
  return user;
};

const getSession = async (code) => {
  const user = await Session.findOne({ code });
  //   console.log(user);
  return user;
};

const sessionFinish = async (code) => {
  try {
    await Session.findOneAndUpdate(
      { code },
      { active: false, date_finish: Date.now() }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
  //   console.log(user);
  return true;
};

const saveDiagram = async (data, diagram_id) => {
  console.log(data);
  console.log(diagram_id);
  try {
    if (diagram_id) {
      await Diagram.findByIdAndUpdate(diagram_id, { data: data.data });
      return true;
    }
    console.log("guardando diagrama");
    const diagrama = new Diagram({ ...data });
    await diagrama.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getDiagrams = async (uid) => {
  const diagramas = await Diagram.find({ user_id: uid });
  // console.log(diagramas);
  return diagramas;
};

module.exports = {
  getDiagrams,
  getSession,
  generarJWT,
  getUser,
  saveDiagram,
  sessionFinish,
};
