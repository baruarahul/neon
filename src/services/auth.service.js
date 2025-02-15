const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");
const userService = require("./users.service");
const tokenService = require("./token.service");
const emailService = require("./email.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

/**
 * Register a new user, create enterprise with address, default workspace, and team if necessary
 * @param {Object} userData
 * @returns {Promise<{user: User, tokens: {accessToken, refreshToken}}>}
 */
const registerUser = async (userData) => {
  let enterprise = await enterpriseService.getEnterpriseByName(userData.enterpriseName);

  if (!enterprise) {
    enterprise = await enterpriseService.createEnterprise({
      name: userData.enterpriseName,
      ownerId: null, // Owner will be assigned after user creation
      address: userData.address,
      contactEmail: userData.email,
      phone: userData.phone,
    });
  }

  // Ensure default workspace and team are created
  const workspace = await enterpriseService.getOrCreateDefaultWorkspace(enterprise._id);
  const team = await enterpriseService.getOrCreateDefaultTeam(enterprise._id, workspace._id);

  // Hash password
  userData.passwordHash = await bcrypt.hash(userData.password, 10);
  delete userData.password;

  // Create user
  const user = await userService.createUser({
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    passwordHash: userData.passwordHash,
    enterpriseId: enterprise._id,
    workspaceId: workspace._id,
    teamId: team._id,
    address: userData.address,
  });

  // Assign ownership if this is the first user in the enterprise
  const enterpriseUsersCount = await userService.countUsersByEnterprise(enterprise._id);
  if (enterpriseUsersCount === 1) {
    enterprise.ownerId = user._id;
    await enterprise.save();
  }

  // Generate authentication tokens
  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: User, tokens: {accessToken, refreshToken}}>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  if (user.status !== "approved") {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is not approved yet.");
  }

  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

/**
 * Login with phone and password
 * @param {string} phone
 * @param {string} password
 * @returns {Promise<{user: User, tokens: {accessToken, refreshToken}}>}
 */
const loginUserWithPhoneAndPassword = async (phone, password) => {
  const user = await userService.getUserByPhone(phone);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect phone number or password");
  }

  if (user.status !== "approved") {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is not approved yet.");
  }

  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

/**
 * Logout (invalidate refresh token)
 * @param {string} refreshToken
 */
const logout = async (refreshToken) => {
  await tokenService.blacklistToken(refreshToken);
};

/**
 * Refresh authentication tokens
 * @param {string} refreshToken
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }

    await Token.deleteOne({ _id: refreshTokenDoc._id });
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
};

/**
 * Verify email using token
 * @param {string} verifyEmailToken
 */
const verifyEmail = async (verifyEmailToken) => {
  const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
  const user = await userService.getUserById(verifyEmailTokenDoc.user);
  if (!user) {
    throw new Error("User not found");
  }

  await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
  await userService.updateUserById(user.id, { isEmailVerified: true });
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  const resetTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
  const user = await userService.getUserById(resetTokenDoc.user);
  if (!user) {
    throw new Error();
  }

  await userService.updateUserById(user.id, { password: newPassword });
  await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  await emailService.sendPasswordResetConfirmationEmail(user);
};

/**
 * Change password
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userService.getUserById(userId);
  if (!user || !(await user.isPasswordMatch(currentPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
  }

  await userService.updateUserById(user.id, { password: newPassword });
};

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
  loginUserWithPhoneAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  changePassword,
};
