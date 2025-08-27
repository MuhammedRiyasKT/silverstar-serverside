const express = require('express');
const {
  getTables,
  occupyTable,
  vacateTable
} = require('../controllers/tableController');

const router = express.Router();

// @route   GET /api/tables
router.get('/', getTables);

// @route   PUT /api/tables/:id/occupy
router.put('/:id/occupy', occupyTable);

// @route   PUT /api/tables/:id/vacate
router.put('/:id/vacate', vacateTable);

module.exports = router;