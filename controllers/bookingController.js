const Booking = require('../models/Booking');
const Event   = require('../models/Event');

const bookEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existing = await Booking.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).json({ message: 'Already booked' });
    }

    const count = await Booking.countDocuments({ event: eventId });
    if (count >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const booking = new Booking({ user: userId, event: eventId });
    await booking.save();

    res.status(201).json({ message: 'Booked successfully', booking });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId })
      .populate('event')
      .sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findOneAndDelete({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not yours' });
    }

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    bookEvent,
    getBookings,
    cancelBooking
}