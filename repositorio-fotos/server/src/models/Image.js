const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  originalname: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  buffer: {
    type: Buffer, // Campo para almacenar el archivo en memoria
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  alias: {
    type: String, // Campo para almacenar el alias del usuario
    required: true,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
