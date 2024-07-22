// Import utility functions and modules
const sendClosePageScript = require('./sendClosePageScript.utils');
const getFormattedTimestamp = require('./formattedTimeStamp.utils');
const emailTemplates = require('./emailTemplates.utils');
const responses = require('./response.utils');
const sendMail = require('./sendMail.utils');

// Export all utility functions and modules
module.exports = {
  sendClosePageScript,
  getFormattedTimestamp,
  emailTemplates,
  responses,
  sendMail,
};
