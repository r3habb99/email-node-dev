const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }, // To track if the link is active
  uniqueVisitorIds: [{ type: String }], // To store unique visitor IDs
  email: { type: String, required: false }, // Optional field to store email addresses associated with the link
});

module.exports = mongoose.model('Link', LinkSchema);
