const mongoose = require("mongoose");
const { tokenTypes } = require("../config/tokens");

const tokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(tokenTypes), required: true },
    blacklisted: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
