// models/channel.model.js
const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");
const softDelete = require("./plugins/softDelete");

// Channel schema – introduces a top-level entity for RBAC (channel > enterprise > user)
const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    channelId: { type: Number, unique: true, required: true },
    subscriptionPlan: { 
      type: String, 
      enum: ["free", "basic", "premium", "enterprise"], 
      default: "free" 
    },
  },
  { timestamps: true }
);

// Plugins encapsulate common functionalities (OCP: extending without modifying core schema)
channelSchema.plugin(toJSON);
channelSchema.plugin(paginate);
channelSchema.plugin(softDelete);

module.exports = mongoose.model("Channel", channelSchema);
