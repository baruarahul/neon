const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate access and refresh tokens for authentication
 * @param {User} user
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
const generateAuthTokens = async (user) => {
  const accessToken = jwt.sign({ id: user._id, role: user.roleId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await Token.create({
    user: user._id,
    token: refreshToken,
    type: tokenTypes.REFRESH,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

/**
 * Verify a token's validity
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
  if (!tokenDoc) {
    throw new Error("Invalid or expired token");
  }
  return tokenDoc;
};

/**
 * Blacklist a token (logout)
 * @param {string} refreshToken
 */
const blacklistToken = async (refreshToken) => {
  await Token.findOneAndUpdate({ token: refreshToken }, { blacklisted: true });
};

module.exports = {
  generateAuthTokens,
  verifyToken,
  blacklistToken,
};
