import AppError from '../utils/customErrors.js';

const standardResponseMiddleware = (req, res, next) => {
  // Custom success response method
  res.sendSuccess = (
    data,
    message = 'Success!',
    statusCode = 200,
    appCode = 'OK'
  ) => {
    logger.info(`Sending success response: ${message}, Status Code: ${statusCode}`);
    res.status(statusCode).json({
      status: 'success',
      message,
      data,
      appCode,
      timestamp: new Date().toISOString(),
    });
  };

  // Improved custom error response method
  res.sendError = (error) => {
    // Default to 400 status for unexpected errors
    if (process.env.DEBUG === 'true') {
      logger.info(error);
      logger.info('Error details:', error);
    }

    let statusCode = error.statusCode || 400;
    let responseStatus = statusCode === 400 ? 'failed' : 'error';
    let message = 'An unexpected error occurred';
    let details = null;
    let appCode = 'UNKNOWN_ERROR';

    // Handle known AppError instances
    if (error instanceof AppError) {
      statusCode = error.statusCode;
      message = error.message;
      details = error.details;
      appCode = error.appCode;
      logger.info(`AppError detected: ${message}, Code: ${appCode}`);
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      details = error.errors;
      appCode = 'VALIDATION_ERROR';
      logger.info(`ValidationError: ${message}`);
    } else {
      logger.info(`Unexpected error: ${message}`);
    }

    res.status(statusCode).json({
      status: responseStatus,
      message,
      appCode,
      details,
      timestamp: new Date().toISOString(),
    });
  };

  next();
};

export default standardResponseMiddleware;