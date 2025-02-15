// utils/catchAsync.js

/**
 * A wrapper function for handling async errors in Express controllers.
 * It ensures that any rejected promise is passed to the next() function,
 * triggering Express's error handling middleware.
 *
 * @param {Function} fn - The asynchronous function to be wrapped.
 * @returns {Function} - A middleware function that catches errors and forwards them to next().
 */
module.exports = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  