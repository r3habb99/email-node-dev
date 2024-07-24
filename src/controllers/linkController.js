const DeviceData = require('../models/DeviceData');
const Link = require('../models/Link');
const useragent = require('useragent');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');
const {
  getFormattedTimestamp,
  sendClosePageScript,
} = require('../utils/index');
const logger = require('../utils/logger.utils');
const { logAndRenderError } = require('../utils/response.utils');

// Generates a new link with a unique short URL and sets its expiration date
exports.generateLink = async (req, res) => {
  const shortUrl = shortid.generate();
  const originalUrl = `http://localhost:3000/link/${shortUrl}`;

  // Set expiration to 1 hour from now
  // const expirationDuration = 1 * 60 * 1000;
  const expirationDuration = 1 * 60 * 60 * 1000; // 1 hours in milliseconds
  const expirationDate = new Date(Date.now() + expirationDuration);

  // Create a new link document with initial values
  const newLink = new Link({
    originalUrl,
    shortUrl,
    isActive: true,
    uniqueVisitorIds: [],
    emails: [], // Initialize as an empty array
    expirationDate,
  });

  try {
    // Save the new link to the database
    await newLink.save();
    logger.info(`Generated link: ${originalUrl}`);
    res.send(`${originalUrl}`);
  } catch (error) {
    logger.error('Error generating link:', error);
    return logAndRenderError(res, 'Error generating link.');
  }
};
// Processes a click on the link, collecting device data and updating the link
exports.processLink = async (req, res) => {
  const { shortUrl } = req.params;
  const { email } = req.query;

  try {
    // Retrieve the link based on the short URL
    let link = await getLink(shortUrl);
    if (!link) {
      logger.warn(`Link not found or is inactive: ${shortUrl}`);
      return logAndRenderError(res, 'Link not found or is inactive.', 404);
    }
    // Add email to the link if provided
    if (email) {
      link.emails.push(email);
      await link.save();
    }
    // Collect device data and save it
    const deviceData = await collectDeviceData(req, link._id, email);
    await saveDeviceData(deviceData, link);
    // Save device data to a file and send close page script
    const fileName = await saveDeviceDataToFile(deviceData);
    sendClosePageScript(res);
    logger.info(`Processed link: ${shortUrl}, data saved to: ${fileName}`);
  } catch (error) {
    logger.error('Error processing link:', error);
    return logAndRenderError(res, 'Error processing link.');
  }
};
// Fetches a link from the database using the short URL
async function getLink(shortUrl) {
  try {
    let link = await Link.findOne({ shortUrl });
    logger.info(
      `Fetched link for shortUrl: ${shortUrl}, found: ${link ? 'yes' : 'no'}`
    );
    return link && link.isActive ? link : null;
  } catch (error) {
    logger.error(`Error fetching link for shortUrl: ${shortUrl}`, error);
    return null;
  }
}
// Collects device data from the request and includes email and link ID
async function collectDeviceData(req, linkId, email) {
  const ua = useragent.parse(req.headers['user-agent']);
  const uniqueVisitorId = shortid.generate();
  let ip = getIP(req);

  return new DeviceData({
    ip,
    ips: req.ips,
    browser: ua.family || 'Unknown',
    os: ua.os.family || 'Unknown',
    device: ua.device?.family || 'Unknown',
    timestamp: new Date(),
    headers: req.headers,
    path: req.path,
    query: req.query,
    method: req.method,
    protocol: req.protocol,
    hostname: req.hostname,
    httpVersion: req.httpVersion,
    originalUrl: req.originalUrl,
    subdomains: req.subdomains,
    referrer: req.get('Referrer') || req.get('Referer') || 'Unknown',
    cookies: req.cookies || 'None',
    body: req.body || 'None',
    userId: req.user ? req.user.id : null,
    userAgent: req.headers['user-agent'],
    linkId,
    uniqueVisitorId,
    email, // Associate the email with the device data
  });
}
// Retrieves the IP address from the request headers or connection
function getIP(req) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return ip === '::1' || ip === '127.0.0.1' ? '8.8.8.8' : ip;
}

// Saves the device data to the database and updates the link
async function saveDeviceData(deviceData, link) {
  await deviceData.save();
  link.uniqueVisitorIds.push(deviceData.uniqueVisitorId);
  // Ensure email is added only once to the link
  if (!link.emails.includes(deviceData.email)) {
    link.emails.push(deviceData.email);
  }

  await link.save();
}
// Saves the device data to a JSON file
async function saveDeviceDataToFile(deviceData) {
  const timestamp = getFormattedTimestamp();
  const fileName = `deviceData_${timestamp}.json`;
  const filePath = path.join(__dirname, '../../data', 'browser-data', fileName);

  return new Promise((resolve, reject) => {
    fs.writeFile(
      filePath,
      JSON.stringify(deviceData.toObject(), null, 2),
      (error) => {
        if (error) {
          logger.error('Error writing to JSON file:', error);
          reject(error);
        } else {
          resolve(fileName);
        }
      }
    );
  });
}
