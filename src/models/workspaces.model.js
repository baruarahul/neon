const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");
const softDelete = require("./plugins/softDelete");

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true }, // Enterprise owning the workspace
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Workspace owner
    parentWorkspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", default: null }, // Nested workspaces
    allowedUserRoles: [{ type: String }], // Roles allowed in this workspace
    billingInfo: {
      cardLast4: { type: String },
      billingAddress: { type: String },
    },
    settings: {
      crossWorkspaceVisibility: { type: Boolean, default: false }, // Can users see other workspaces?
      autoRoleAssignment: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Apply Plugins
workspaceSchema.plugin(toJSON);
workspaceSchema.plugin(paginate);
workspaceSchema.plugin(softDelete);

module.exports = mongoose.model("Workspace", workspaceSchema);
