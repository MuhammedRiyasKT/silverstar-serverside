const Table = require('../models/Table');
const Order = require('../models/Order');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });

    res.json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Occupy table
// @route   PUT /api/tables/:id/occupy
// @access  Public
const occupyTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      {
        isOccupied: true,
        lastOccupiedAt: new Date()
      },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      message: 'Table occupied',
      data: table
    });
  } catch (error) {
    console.error('Occupy table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Vacate table
// @route   PUT /api/tables/:id/vacate
// @access  Public
const vacateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      {
        isOccupied: false,
        currentOrder: null
      },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      message: 'Table vacated',
      data: table
    });
  } catch (error) {
    console.error('Vacate table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getTables,
  occupyTable,
  vacateTable
};