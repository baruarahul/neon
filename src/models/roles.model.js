const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");
const softDelete = require("./plugins/softDelete");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    level: { 
      type: String, 
      enum: ["channel_admin",  "enterprise_admin", "user", "device", "global_admin"],
      required: true 
    },
    parentRoleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", default: null }, // For inheritance
    permissions: [
      {
        name: { type: String, required: true }, // E.g., "manage_screens"
        allowed: { type: Boolean, default: true }, // Can override inherited settings
      }
    ],
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: false }, // Only applicable for enterprise-level roles
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: false }, // Only applicable for channel-level roles
  },
  { timestamps: true }
);

// Apply Plugins
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);
roleSchema.plugin(softDelete);


module.exports = mongoose.model("Role", roleSchema);
