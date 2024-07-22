const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger.utils');
// Function to send the content of the closePage.html file as a response
module.exports = function sendClosePageScript(res) {
  // Define the path to the HTML file
  const filePath = path.join(__dirname, '../../', 'views', 'closePage.html');
  // Read the content of the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // Log an error if reading the file fails
      logger.error('Error reading HTML file:', err);
      // Send a 500 Internal Server Error response to the client
      res.status(500).send('Error loading page.');
      return;
    }
    // Send the HTML content as the response
    res.send(data);
  });
};

