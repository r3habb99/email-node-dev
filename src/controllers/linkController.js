const DeviceData = require('../models/DeviceData');
const Link = require('../models/Link');
const useragent = require('useragent');
const shortid = require('shortid');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const {
  getFormattedTimestamp,
  sendClosePageScript,
} = require('../utils/index');
const logger = require('../utils/logger.utils');

exports.generateLink = async (req, res) => {
  const shortUrl = shortid.generate();
  const originalUrl = `http://localhost:3000/link/${shortUrl}`;

  const newLink = new Link({
    originalUrl,
    shortUrl,
    isActive: true,
    uniqueVisitorIds: [],
    emails: [], // Initialize as an empty array
  });

  try {
    await newLink.save();
    logger.info(`Generated link: ${originalUrl}`);
    res.send(`${originalUrl}`);
  } catch (error) {
    logger.error('Error generating link:', error);
    res.status(500).send('Error generating link.');
  }
};

exports.processLink = async (req, res) => {
  const { shortUrl } = req.params;
  const { email } = req.query;

  try {
    logger.info(`Processing link with shortUrl: ${shortUrl}`);
    let link = await getLink(shortUrl);
    if (!link) {
      logger.warn(`Link not found or is inactive: ${shortUrl}`);
      return res.status(404).send('Link not found or is inactive.');
    }

    if (email) {
      link.emails.push(email);
      await link.save();
    }

    const deviceData = await collectDeviceData(req, link._id, email);
    await saveDeviceData(deviceData, link);

    const fileName = await saveDeviceDataToFile(deviceData);
    sendClosePageScript(res);
    logger.info(`Processed link: ${shortUrl}, data saved to: ${fileName}`);
  } catch (error) {
    logger.error('Error processing link:', error);
    res.status(500).send('Error processing link.');
  }
};

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

function getIP(req) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return ip === '::1' || ip === '127.0.0.1' ? '8.8.8.8' : ip;
}

async function fetchLocationData(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching location data:', error);
    return {};
  }
}

async function saveDeviceData(deviceData, link) {
  await deviceData.save();
  link.uniqueVisitorIds.push(deviceData.uniqueVisitorId);

  if (!link.emails.includes(deviceData.email)) {
    link.emails.push(deviceData.email);
  }

  await link.save();
}

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
