const { Schema, model } = require("mongoose");

const SessionSchema = Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: [true, "El id del usuario es obligatorio"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  code: {
    type: String,
    required: [true, "El codigo es necesario"],
  },
});

// UsuarioSchema.methods.toJSON = function () {
//   const { __v, password, _id, ...usuario } = this.toObject();
//   usuario.uid = _id;
//   return usuario;
// };

module.exports = model("Session", SessionSchema);
