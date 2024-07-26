const Email = require('../models/Email');
const logger = require('../utils/logger.utils');

/**
 * Create a new email document.
 * @param {Object} emailData - The email data.
 * @returns {Promise<Email>} - The created email document.
 */
const createEmail = async (emailData) => {
  try {
    return await Email.create(emailData);
  } catch (error) {
    throw new logger.error('Error while creating email data', error);
  }
};

/**
 * Retrieve email documents with pagination.
 * @param {number} page - The page number.
 * @param {number} perPage - The number of documents per page.
 * @returns {Promise<Object>} - An object containing the total email count and the email documents.
 */
const getEmails = async (page, perPage) => {
  try {
    const totalEmails = await Email.countDocuments();
    const emails = await Email.find()
      .sort({ sentAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return { totalEmails, emails };
  } catch (error) {
    throw new logger.error(
      'Error while fetching email count and email-data',
      error
    );
  }
};

module.exports = { createEmail, getEmails };
