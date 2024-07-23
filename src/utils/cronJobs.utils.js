const cron = require('node-cron');
const Link = require('../models/Link');
const logger = require('./logger.utils');

// Schedule a job to run every 1 hour
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // Update links where expirationDate is less than or equal to the current time and isActive is true
    const expiredLinks = await Link.updateMany(
      { expirationDate: { $lte: now }, isActive: true },
      { $set: { isActive: false } }
    );
    // Log the number of updated documents
    if (expiredLinks.nModified > 0) {
      logger.info(`Deactivated ${expiredLinks.nModified} expired links`);
    }
  } catch (error) {
    // Log any errors that occur
    logger.error('Error deactivating expired links:', error);
  }
});
