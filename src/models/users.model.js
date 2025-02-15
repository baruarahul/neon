const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");
const softDelete = require("./plugins/softDelete");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "default_avatar.png" }, // URL for profile picture
    phone: { type: String, required: true, unique: true },
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true }, // Links to enterprise
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: false },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: false }, // Shared team
    parentUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Delegated admins

    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // Links to Role model
    permissionsOverride: [
      {
        name: { type: String, required: true },
        allowed: { type: Boolean, default: true },
      }
    ], // Allows user-specific permission overrides

    socialLogin: {
      googleId: { type: String, default: null },
      facebookId: { type: String, default: null },
    },
    mfaEnabled: { type: Boolean, default: false },
    ssoProvider: { type: String, default: null },
    status: { type: String, enum: ["active", "suspended", "deleted"], default: "active" },
  },
  { timestamps: true }
);

// Apply Plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(softDelete);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if mobile number is taken
 * @param {string} phone - The user's mobile number
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
