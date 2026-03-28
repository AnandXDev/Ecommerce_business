const mongoose = require('mongoose');

const deliveryQRSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['generated', 'scanned', 'verified', 'expired'],
    default: 'generated'
  },
  scanLocation: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: Date
  },
  verificationDetails: {
    scannedAt: Date,
    verifiedAt: Date,
    ipAddress: String,
    userAgent: String,
    deviceInfo: String,
    photoUrl: String // Optional photo as proof
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate QR code
deliveryQRSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    const crypto = require('crypto');
    const uniqueString = `${this.order}-${this.deliveryBoy}-${Date.now()}`;
    this.qrCode = crypto.createHash('sha256').update(uniqueString).digest('hex').substring(0, 12).toUpperCase();
  }
  next();
});

// Update timestamps
deliveryQRSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
deliveryQRSchema.index({ order: 1 });
deliveryQRSchema.index({ deliveryBoy: 1 });
deliveryQRSchema.index({ qrCode: 1 });
deliveryQRSchema.index({ status: 1 });
deliveryQRSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('DeliveryQR', deliveryQRSchema);
