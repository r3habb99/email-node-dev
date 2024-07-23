const {
  logAndRenderSuccess,
  logAndRenderError,
} = require('../utils/response.utils');
const { sendMail } = require('../utils/index');

/**
 * Controller function to handle sending emails.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const sendEmail = async (req, res) => {
  try {
    // Extract data from the request body
    const { recipients, subject, message, buttonText, buttonLink } = req.body;
    // Process file attachments if any
    const attachments = req.files || []; // Get the uploaded files from request
    const attachmentList = attachments.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // Send emails to all recipients
    await Promise.all(
      recipients.split(',').map((email) => {
        // Create a full link by appending the email as a query parameter
        const fullLink = `${buttonLink}?email=${encodeURIComponent(
          email.trim()
        )}`;

        return sendMail(
          email.trim(), // Recipient email address
          subject, // Email subject
          {
            subject,
            message: message.replace(/\r\n|\r|\n/g, '<br>'), // Convert newlines to HTML line breaks
            buttonLink: fullLink, // Include the personalized link
            buttonText, // Text for the button in the email
          },
          attachmentList // List of attachments
        );
      })
    );
    // Log success and render success message
    return logAndRenderSuccess(res, 'Emails sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error); // Detailed error logging for debugging
    return logAndRenderError(
      res,
      'Failed to send emails. Please check the logs for more details.'
    );
  }
};
module.exports = { sendEmail };
