const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth.service");
const { validate } = require("../middleware/validate.middleware");
const {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
} = require("../validations/auth.validation");

/**
 * Register a new user
 */
const register = catchAsync(async (req, res) => {
  validate(registerSchema, req);
  const { user, tokens } = await authService.registerUser(req.body);
  res.status(httpStatus.CREATED).json({ message: "User registered successfully", user, tokens });
});

/**
 * Login user with either email or phone
 */
const login = catchAsync(async (req, res) => {
  validate(loginSchema, req);

  const { email, phone, password } = req.body;
  let user, tokens;

  if (email) {
    ({ user, tokens } = await authService.loginUserWithEmailAndPassword(email, password));
  } else if (phone) {
    ({ user, tokens } = await authService.loginUserWithPhoneAndPassword(phone, password));
  } else {
    return res.status(httpStatus.BAD_REQUEST).json({ error: "Email or phone is required." });
  }

  res.json({ message: "Login successful", user, tokens });
});

/**
 * Logout user
 */
const logout = catchAsync(async (req, res) => {
  validate(refreshTokenSchema, req);
  await authService.logout(req.body.refreshToken);
  res.json({ message: "User logged out successfully" });
});

/**
 * Refresh authentication tokens
 */
const refreshToken = catchAsync(async (req, res) => {
  validate(refreshTokenSchema, req);
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.json({ tokens });
});

/**
 * Reset password
 */
const resetPassword = catchAsync(async (req, res) => {
  validate(resetPasswordSchema, req);
  await authService.resetPassword(req.body.token, req.body.newPassword);
  res.json({ message: "Password reset successful" });
});

/**
 * Verify email using a token
 */
const verifyEmail = catchAsync(async (req, res) => {
  validate(verifyEmailSchema, req);
  await authService.verifyEmail(req.body.token);
  res.json({ message: "Email verified successfully" });
});

/**
 * Change password
 */
const changePassword = catchAsync(async (req, res) => {
  validate(changePasswordSchema, req);
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.json({ message: "Password changed successfully" });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  resetPassword,
  verifyEmail,
  changePassword,
};
