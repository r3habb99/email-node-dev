const Email = require('../models/Email');
const {
  logAndRenderSuccess,
  logAndRenderError,
} = require('../utils/response.utils');
const { sendMail } = require('../utils/index');
const logger = require('../utils/logger.utils');

/**
 * Controller function to handle sending emails.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
// const sendEmail = async (req, res) => {
//   try {
//     // Extract data from the request body
//     const { recipients, subject, message, buttonText, buttonLink } = req.body;
//     // Process file attachments if any
//     const attachments = req.files || []; // Get the uploaded files from request
//     const attachmentList = attachments.map((file) => ({
//       filename: file.originalname,
//       path: file.path,
//     }));

//     // Send emails to all recipients
//     await Promise.all(
//       recipients.split(',').map(async (email) => {
//         const fullLink = `${buttonLink}?email=${encodeURIComponent(
//           email.trim()
//         )}`;

//         // Send the email
//         await sendMail(
//           email.trim(),
//           subject,
//           {
//             subject,
//             message: message.replace(/\r\n|\r|\n/g, '<br>'),
//             buttonLink: fullLink,
//             buttonText,
//           },
//           attachmentList
//         );

//         // Save email details to the database
//         await Email.create({
//           to: email.trim(),
//           subject,
//           message,
//           attachments: attachmentList,
//         });
//       })
//     );
//     // Log success and render success message
//     return logAndRenderSuccess(res, 'Emails sent successfully!');
//   } catch (error) {
//     logger.error('Error sending email:', error); // Detailed error logging for debugging
//     return logAndRenderError(
//       res,
//       'Failed to send emails. Please check the logs for more details.'
//     );
//   }
// };

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
      recipients.split(',').map(async (email) => {
        const fullLink = `${buttonLink}?email=${encodeURIComponent(
          email.trim()
        )}`;

        // Send the email
        await sendMail(
          email.trim(),
          subject,
          {
            subject,
            message: message.replace(/\r\n|\r|\n/g, '<br>'),
            buttonLink: fullLink,
            buttonText,
          },
          attachmentList
        );

        // Save email details to the database
        await Email.create({
          to: email.trim(),
          subject,
          message,
          attachments: attachmentList,
        });
      })
    );

    // Log success and render success message
    return logAndRenderSuccess(res, 'Emails sent successfully!');
  } catch (error) {
    logger.error('Error sending email:', error); // Detailed error logging for debugging
    return logAndRenderError(
      res,
      'Failed to send emails. Please check the logs for more details.'
    );
  }
};

/**
 * Controller function to handle getting email history with pagination.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getEmailHistory = async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page, 10) || 1;

    const totalEmails = await Email.countDocuments();
    const emails = await Email.find()
      .sort({ sentAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalPages = Math.ceil(totalEmails / perPage);
    // Respond with JSON for consistency using custom success response handler
    return res.json({
      emails: emails.map((email, index) => ({
        serialNo: (page - 1) * perPage + index + 1,
        to: email.to,
        subject: email.subject,
        sentAt: email.sentAt,
      })),
      currentPage: page,
      totalPages: totalPages,
      totalEmails: totalEmails,
      pageSize: perPage, // Include pageSize for client-side use
      title: 'Dashboard',
    });
  } catch (error) {
    // Log error fetching email history
    logger.error('Error fetching email history:', error);
    // Respond with error using custom error response handler
    return logAndRenderError(res, 'Error fetching email history.');
  }
};

module.exports = { sendEmail, getEmailHistory };
