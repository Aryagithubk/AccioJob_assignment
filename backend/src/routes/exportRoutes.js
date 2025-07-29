// exportRoutes.js
const express = require('express');
const router = express.Router();
const { exportSession } = require('../controllers/exportController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:id', protect, exportSession);

module.exports = router;
