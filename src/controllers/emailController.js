const sendMail = require('../utils/sendMail.utils');
const {
  logAndRenderSuccess,
  logAndRenderError,
} = require('../utils/response.utils');
const Link = require('../models/Link');
const shortid = require('shortid');

// const sendEmail = async (req, res) => {
//   try {
//     // Destructure validated data
//     const { recipients, subject, message, buttonLink, buttonText } = req.body;

//     // Process attachments
//     const attachments = req.files || [];
//     const attachmentList = attachments.map((file) => ({
//       filename: file.originalname,
//       path: file.path,
//     }));

//     // Send emails to each recipient
//     await Promise.all(
//       recipients.split(',').map((email) =>
//         sendMail(
//           email.trim(),
//           subject,
//           {
//             subject,
//             message: message.replace(/\r\n|\r|\n/g, '<br>'),
//             buttonLink,
//             buttonText,
//             year: new Date().getFullYear(),
//           },
//           attachmentList
//         )
//       )
//     );

//     // Log success and set success message cookie
//     return logAndRenderSuccess(res, 'Emails sent successfully!');
//   } catch (error) {
//     // Log error and render error message
//     return logAndRenderError(
//       res,
//       'Failed to send emails. Please check the logs for more details.'
//     );
//   }
// };

const sendEmail = async (req, res) => {
  try {
    const { recipients, subject, message, buttonText, buttonLink } = req.body;

    const attachments = req.files || [];
    const attachmentList = attachments.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // Use the provided button link
    const fullLink = buttonLink;

    // Send emails to all recipients
    await Promise.all(
      recipients.split(',').map((email) =>
        sendMail(
          email.trim(),
          subject,
          {
            subject,
            message: message.replace(/\r\n|\r|\n/g, '<br>'),
            buttonLink: fullLink, // Use the provided link here
            buttonText,
            year: new Date().getFullYear(),
          },
          attachmentList
        )
      )
    );

    return logAndRenderSuccess(res, 'Emails sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error); // Detailed error logging
    return logAndRenderError(
      res,
      'Failed to send emails. Please check the logs for more details.'
    );
  }
};

module.exports = { sendEmail };
