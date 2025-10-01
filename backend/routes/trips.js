const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/middleware');
const db = require('../database'); 

/**
 * @route   GET /api/trips
 * @desc    Get all trips for the logged-in user
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const userTrips = await db.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC', 
      [userId]
    );

    res.json(userTrips.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;