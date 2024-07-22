const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const logger = require('./logger.utils');

const getTemplate = (templateName, replacements) => {
  try {
    const filePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.html`
    );
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    return template(replacements);
  } catch (error) {
    logger.error(`Error reading template: ${error.message}`);
    throw new Error('Error reading email template');
  }
};

module.exports = getTemplate;
