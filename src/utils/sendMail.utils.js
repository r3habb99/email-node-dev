const transporter = require('../config/transporter.config'); // Import the email transporter configuration
const getTemplate = require('./emailTemplates.utils'); // Import the function to get email templates
const logger = require('./logger.utils'); // Import the logger utility

/**
 * Function to send an email with the given parameters.
 *
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {object} replacements - Object containing template replacements.
 * @param {Array} attachments - Array of attachments to include in the email.
 */
const sendMail = async (to, subject, replacements, attachments) => {
  // Generate the HTML content for the email using the template and replacements
  const htmlToSend = getTemplate('email', replacements);

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address from environment variables
    to, // Recipient's email address
    subject, // Subject of the email
    html: htmlToSend, // HTML content of the email
    attachments, // Attachments to include in the email
  };

  try {
    // Attempt to send the email
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`); // Log success message if email is sent
  } catch (error) {
    // Log error message if there is a problem sending the email
    logger.error(`Error sending email to ${to}: ${error.message}`);
  }
};

module.exports = sendMail; // Export the sendMail function for use in other modules
