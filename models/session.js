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
  data: {
    type: Object,
  },
  date_init: {
    type: Date,
    default: Date.now(),
  },
  date_finish: {
    type: Date,
  },
});

module.exports = model("Session", SessionSchema);
