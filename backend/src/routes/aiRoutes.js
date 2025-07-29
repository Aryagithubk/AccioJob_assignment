// aiRoutes.js
const express = require('express');
const router = express.Router();
const { generate, patchComponent } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/generate', generate);
router.post('/update', patchComponent);

module.exports = router;
