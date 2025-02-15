const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");
const softDelete = require("./plugins/softDelete");

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: false },
    action: { type: String, required: true }, // E.g., "created_campaign"
    details: { type: Object }, // Stores old and new values if applicable
    ipAddress: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
  },
  { timestamps: true }
);

// Apply Plugins
auditLogSchema.plugin(toJSON);
auditLogSchema.plugin(paginate);
auditLogSchema.plugin(softDelete);

module.exports = mongoose.model("AuditLog", auditLogSchema);
