const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");
const softDelete = require("./plugins/softDelete");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true }, // Links to enterprise
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in team
    permissions: [{ type: String }], // Team-wide permissions
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Creator of team
  },
  { timestamps: true }
);
// Apply plugins
teamSchema.plugin(toJSON);
teamSchema.plugin(paginate);
teamSchema.plugin(softDelete);

module.exports = mongoose.model("Team", teamSchema);
