const { Schema, model } = require("mongoose");

const DiagramSchema = Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  data: Object,
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Diagram", DiagramSchema);
