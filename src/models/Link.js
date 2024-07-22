const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }, // To track if the link is active
  uniqueVisitorIds: [{ type: String }], // To store unique visitor IDs
  emails: { type: [String], default: [] }, // Updated to store multiple emails
});

module.exports = mongoose.model('Link', LinkSchema);
