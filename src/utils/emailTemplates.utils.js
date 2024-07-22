const fs = require('fs'); // Use the Promise-based fs module
const path = require('path');
const handlebars = require('handlebars');
const logger = require('./logger.utils');

// Asynchronous function to get and compile a template
const getTemplate = (templateName, replacements) => {
  try {
    // Construct the file path for the template
    const filePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.html`
    );

    // Read the template file content asynchronously
    const source = fs.readFileSync(filePath, 'utf-8').toString();

    // Compile the template using Handlebars
    const template = handlebars.compile(source);

    // Render and return the compiled template with replacements
    return template(replacements);
  } catch (error) {
    // Log the error with a message and rethrow a generic error
    logger.error(`Error reading template: ${error.message}`);
    throw new Error('Error reading email template');
  }
};

module.exports = getTemplate;
