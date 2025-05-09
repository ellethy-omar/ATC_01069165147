const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event:    { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  bookedAt: { type: Date, default: Date.now },
  status:   { type: String, enum: ['booked'], default: 'booked' }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
