const { createLogger, format, transports } = require('winston');

// Create a logger instance with custom configurations
const logger = createLogger({
  // Define the log level, i.e., the minimum level of messages to log
  level: 'info', // Logs will be of 'info' level and above ('info', 'warn', 'error')

  // Combine multiple formats for logging
  format: format.combine(
    // Add a timestamp to each log entry for file transports
    format.timestamp(),

    // Custom log message formatting
    format.printf(({ timestamp, level, message }) => {
      // Format the log message to include timestamp, log level, and the message
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),

  // Define where the log messages should be output
  transports: [
    // Console transport: logs messages to the console without timestamp and with a prefix
    new transports.Console({
      format: format.combine(
        format.colorize(), // Add color to log levels for better readability
        format.printf(({ level, message }) => {
          // Format the log message to include only the log level and the message with a custom prefix
          return `INFO: ${message}`;
        })
      ),
    }),

    // File transport: logs messages to a file with timestamp
    new transports.File({
      filename: 'logs/combined.log', // File where logs are saved
      format: format.combine(
        format.timestamp(), // Include timestamp in log entries
        format.json() // Format logs as JSON for structured logging
      ),
    }),

    // Error log transport: separate file for error logs with timestamp
    new transports.File({
      filename: 'logs/error.log', // File where error logs are saved
      level: 'error', // Only log 'error' level messages to this file
      format: format.combine(
        format.timestamp(), // Include timestamp in log entries
        format.json() // Format logs as JSON for structured logging
      ),
    }),
  ],

  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new transports.File({
      filename: 'logs/exceptions.log', // File where uncaught exceptions are logged
      format: format.combine(
        format.timestamp(), // Include timestamp in log entries
        format.json() // Format logs as JSON for structured logging
      ),
    }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new transports.File({
      filename: 'logs/rejections.log', // File where unhandled promise rejections are logged
      format: format.combine(
        format.timestamp(), // Include timestamp in log entries
        format.json() // Format logs as JSON for structured logging
      ),
    }),
  ],
});

module.exports = logger;
