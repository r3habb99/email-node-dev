// models/Email.js

const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  attachments: [{ filename: String, path: String }],
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Email', emailSchema);
