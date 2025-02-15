const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");
const softDelete = require("./plugins/softDelete");

/**
 * @swagger
 * components:
 *   schemas:
 *     Enterprise:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         enterpriseId:
 *           type: number
 *           description: Unique numeric ID for the enterprise
 *         name:
 *           type: string
 *         ownerId:
 *           type: string
 *         industry:
 *           type: string
 *         website:
 *           type: string
 *         contactEmail:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *             postalCode:
 *               type: string
 *         settings:
 *           type: object
 *           properties:
 *             allowCrossTeamVisibility:
 *               type: boolean
 *             maxUsers:
 *               type: number
 *         subscriptionPlan:
 *           type: string
 *           enum: ["free", "basic", "premium", "enterprise"]
 */

const enterpriseSchema = new mongoose.Schema(
  {
    enterpriseId: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    name: { type: String, required: true, unique: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    industry: { type: String, default: null },
    website: { type: String, default: null },
    contactEmail: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      country: { type: String, required: false },
      postalCode: { type: String, required: false },
    },
    settings: {
      allowCrossTeamVisibility: { type: Boolean, default: false },
      maxUsers: { type: Number, default: 100 },
    },
    subscriptionPlan: { type: String, enum: ["free", "basic", "premium", "enterprise"], default: "free" },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  },
  { timestamps: true }
);

// Apply Plugins
enterpriseSchema.plugin(toJSON);
enterpriseSchema.plugin(paginate);
enterpriseSchema.plugin(softDelete);

// Auto-generate enterpriseId before saving (incremental unique number)
enterpriseSchema.pre("save", async function (next) {
  if (!this.enterpriseId) {
    const lastEnterprise = await mongoose.model("Enterprise").findOne().sort("-enterpriseId");
    this.enterpriseId = lastEnterprise ? lastEnterprise.enterpriseId + 1 : 1000; // Start from 1000
  }
  next();
});

module.exports = mongoose.model("Enterprise", enterpriseSchema);
