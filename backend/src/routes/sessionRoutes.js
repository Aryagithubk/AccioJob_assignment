// sessionRoutes.js
const express = require('express');
const router = express.Router();
const {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;
