const router  = require('express').Router();
const { requireAuth } = require('../middleware/requireAuth');

const {
  bookEvent,
  getBookings,
  cancelBooking
} = require('../controllers/bookingController');


router.use(requireAuth);

router.post('/', bookEvent);
router.get('/', getBookings);
router.delete('/:id', cancelBooking);

module.exports = router;
