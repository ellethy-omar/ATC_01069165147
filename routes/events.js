const router       = require('express').Router();
const { requireAuth }  = require('../middleware/requireAuth');

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/:id', getEventById);

router.use(requireAuth);

router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
