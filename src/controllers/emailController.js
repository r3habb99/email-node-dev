const sendMail = require('../utils/sendMail.utils');
const {
  logAndRenderSuccess,
  logAndRenderError,
} = require('../utils/response.utils');

const sendEmail = async (req, res) => {
  try {
    // Destructure validated data
    const { recipients, subject, message, buttonLink, buttonText } = req.body;

    // Process attachments
    const attachments = req.files || [];
    const attachmentList = attachments.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // Send emails to each recipient
    await Promise.all(
      recipients.split(',').map((email) =>
        sendMail(
          email.trim(),
          subject,
          {
            subject,
            message: message.replace(/\r\n|\r|\n/g, '<br>'),
            buttonLink,
            buttonText,
            year: new Date().getFullYear(),
          },
          attachmentList
        )
      )
    );

    // Log success and set success message cookie
    return logAndRenderSuccess(res, 'Emails sent successfully!');
  } catch (error) {
    // Log error and render error message
    return logAndRenderError(
      res,
      'Failed to send emails. Please check the logs for more details.'
    );
  }
};

module.exports = { sendEmail };
