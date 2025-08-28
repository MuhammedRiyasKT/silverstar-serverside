// const Order = require('../models/Order');
// const MenuItem = require('../models/MenuItem');

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Public
// const createOrder = async (req, res) => {
//   try {
//     const { tableId, userId, items, notes } = req.body;

//     // Validate input
//     if (!tableId || !userId || !items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide table ID, user ID, and at least one menu item'
//       });
//     }

//     // Calculate total and validate items
//     let totalAmount = 0;
//     const orderItems = [];

//     for (const item of items) {
//       const menuItem = await MenuItem.findById(item.menuItemId);
//       if (!menuItem) {
//         return res.status(404).json({
//           success: false,
//           message: `Menu item not found: ${item.menuItemId}`
//         });
//       }

//       const price = item.size && menuItem.sizes[item.size] 
//         ? menuItem.sizes[item.size] 
//         : menuItem.price;

//       totalAmount += price * item.quantity;

//       orderItems.push({
//         menuItem: item.menuItemId,
//         name: menuItem.name,
//         quantity: item.quantity,
//         price,
//         size: item.size,
//         specialInstructions: item.specialInstructions
//       });
//     }

//     // Create order
//     const order = await Order.create({
//       tableId,
//       userId,
//       items: orderItems,
//       totalAmount,
//       notes,
//       status: 'pending'
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       data: order
//     });
//   } catch (error) {
//     console.error('Create order error:', error);
    
//     if (error.name === 'ValidationError') {
//       const message = Object.values(error.errors).map(val => val.message).join(', ');
//       return res.status(400).json({
//         success: false,
//         message
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // @desc    Get all orders
// // @route   GET /api/orders
// // @access  Private
// const getOrders = async (req, res) => {
//   try {
//     const { status, tableId } = req.query;
//     let query = {};

//     if (status) {
//       query.status = status;
//     }

//     if (tableId) {
//       query.tableId = tableId;
//     }

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .populate('items.menuItem', 'name price');

//     res.json({
//       success: true,
//       count: orders.length,
//       data: orders
//     });
//   } catch (error) {
//     console.error('Get orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // @desc    Get single order
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('items.menuItem', 'name price');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: order
//     });
//   } catch (error) {
//     console.error('Get order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // @desc    Update order status
// // @route   PUT /api/orders/:id/status
// // @access  Private
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide status'
//       });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     ).populate('items.menuItem', 'name price');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Order status updated',
//       data: order
//     });
//   } catch (error) {
//     console.error('Update order status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// module.exports = {
//   createOrder,
//   getOrders,
//   getOrder,
//   updateOrderStatus
// };

// const Order = require('../models/Order');
// const MenuItem = require('../models/MenuItem');
// const Settings = require('../models/Settings');


// // const HOTEL_LAT = 10.841156;
// // const HOTEL_LON = 76.109505;


// // 📌 Helper: Haversine formula to calculate distance
// function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
//   const R = 6371000; // radius of Earth in meters
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * Math.PI / 180) *
//       Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }


// // POST /api/orders  (Public)
// const createOrder = async (req, res) => {

// // 🏨 Fixed hotel location (replace with your actual coordinates)
// const settings = await Settings.findOne();
// const HOTEL_LAT = settings?.hotelLat ?? 10.841156;
// const HOTEL_LON = settings?.hotelLon ?? 76.109505;
//   try {
//     const { tableId, userId, items, notes, latitude, longitude } = req.body;

//     if (!tableId || !userId || !items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide table ID, user ID, and at least one menu item'
//       });
//     }

//     // ✅ Step 1: Check location
//     if (!latitude || !longitude) {
//       return res.status(400).json({
//         success: false,
//         message: "Location is required to place an order"
//       });
//     }

//     const distance = getDistanceFromLatLonInMeters(
//       latitude,
//       longitude,
//       HOTEL_LAT,
//       HOTEL_LON
//     );

//     if (distance > 50) {
//       return res.status(403).json({
//         success: false,
//         message: "You are outside the hotel. Orders can only be placed inside (within 50m)."
//       });
//     }

//     // ✅ Step 2: Validate menu items
//     let totalAmount = 0;
//     const orderItems = [];

//     for (const item of items) {
//       const menuItem = await MenuItem.findById(item.menuItemId);
//       if (!menuItem) {
//         return res.status(404).json({
//           success: false,
//           message: `Menu item not found: ${item.menuItemId}`
//         });
//       }

//       const price = item.size && menuItem.sizes?.[item.size]
//         ? menuItem.sizes[item.size]
//         : menuItem.price;

//       totalAmount += price * item.quantity;

//       orderItems.push({
//         menuItem: item.menuItemId,
//         name: menuItem.name,
//         quantity: item.quantity,
//         price,
//         size: item.size,
//         specialInstructions: item.specialInstructions
//       });
//     }

//     // ✅ Step 3: Save order
//     const order = await Order.create({
//       tableId,
//       userId,
//       items: orderItems,
//       totalAmount,
//       notes,
//       status: 'pending',
//       location: { latitude, longitude } // save user location
//     });

//     // 🔔 Real-time notify
//     const io = req.app.get('io');
//     if (io) {
//       const plainOrder = order.toObject();
//       io.to(`table:${tableId}`).emit('order:new', plainOrder);
//       io.to('admins').emit('order:new', plainOrder);
//       console.log("🔔 Emitted order:new to table:", tableId);
//       console.log("🔔 Emitted order:new to admins");
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       data: order
//     });
//   } catch (error) {
//     console.error('Create order error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


// // GET /api/orders
// const getOrders = async (req, res) => {
//   try {
//     const { status, tableId, date } = req.query;
//     const query = {};

//     if (status) query.status = status;
//     if (tableId) query.tableId = tableId;

//     // ✅ Date filter (YYYY-MM-DD format)
//     if (date) {
//       const start = new Date(date);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);

//       query.createdAt = { $gte: start, $lte: end };
//     }

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .populate("items.menuItem", "name price");

//     res.json({ success: true, count: orders.length, data: orders });
//   } catch (error) {
//     console.error("Get orders error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// // GET /api/orders/:id
// const getOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('items.menuItem', 'name price');
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }
//     res.json({ success: true, data: order });
//   } catch (error) {
//     console.error('Get order error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // PUT /api/orders/:id/status
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     if (!status) {
//       return res.status(400).json({ success: false, message: 'Please provide status' });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     ).populate('items.menuItem', 'name price');

//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // 🔔 Real-time: notify the table and admins
//     const io = req.app.get('io');
//     if (io) {
//       const plainOrder = order.toObject();
//       io.to(`table:${order.tableId}`).emit('order:updated', plainOrder);
//       io.to('admins').emit('order:updated', plainOrder);
//       console.log("🔔 Emitted order:updated to table:", order.tableId);
//       console.log("🔔 Emitted order:updated to admins");
//     }

//     res.json({ success: true, message: 'Order status updated', data: order });
//   } catch (error) {
//     console.error('Update order status error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };

const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Settings = require("../models/Settings");
const FcmToken = require("../models/FcmToken");
const admin = require("firebase-admin");

// 📌 Helper: Haversine formula to calculate distance
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // radius of Earth in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 📌 Helper: send FCM notification
async function sendNotification(tokens, title, body, data = {}) {
  if (!tokens || tokens.length === 0) return;

  try {
    const message = {
      notification: { title, body },
      data,
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("✅ FCM sent:", response.successCount, "success,", response.failureCount, "failed");
  } catch (err) {
    console.error("❌ FCM Error:", err);
  }
}

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    // 🏨 Fixed hotel location from settings
    const settings = await Settings.findOne();
    const HOTEL_LAT = settings?.hotelLat ?? 10.841156;
    const HOTEL_LON = settings?.hotelLon ?? 76.109505;

    const { tableId, userId, items, notes, latitude, longitude } = req.body;

    if (!tableId || !userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide table ID, user ID, and at least one menu item",
      });
    }

    // ✅ Step 1: Check location
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location is required to place an order",
      });
    }

    const distance = getDistanceFromLatLonInMeters(latitude, longitude, HOTEL_LAT, HOTEL_LON);
    if (distance > 150) {
      return res.status(403).json({
        success: false,
        message: "You are outside the hotel. Orders can only be placed inside (within 150m).",
      });
    }

    // ✅ Step 2: Validate menu items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItemId}`,
        });
      }

      const price =
        item.size && menuItem.sizes?.[item.size]
          ? menuItem.sizes[item.size]
          : menuItem.price;

      totalAmount += price * item.quantity;

      orderItems.push({
        menuItem: item.menuItemId,
        name: menuItem.name,
        quantity: item.quantity,
        price,
        size: item.size,
        specialInstructions: item.specialInstructions,
      });
    }

    // ✅ Step 3: Save order
    const order = await Order.create({
      tableId,
      userId,
      items: orderItems,
      totalAmount,
      notes,
      status: "pending",
      location: { latitude, longitude },
    });

    // 🔔 Real-time notify (socket.io)
    const io = req.app.get("io");
    if (io) {
      const plainOrder = order.toObject();
      io.to(`table:${tableId}`).emit("order:new", plainOrder);
      io.to("admins").emit("order:new", plainOrder);
    }

    // 🔔 Push notification to Admins
    const adminTokens = await FcmToken.find({ role: "admin" }).distinct("token");
    await sendNotification(adminTokens, "🆕 New Order", `Table ${tableId} placed an order`, {
      orderId: order._id.toString(),
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { status, tableId, date } = req.query;
    const query = {};

    if (status) query.status = status;
    if (tableId) query.tableId = tableId;

    // ✅ Date filter (YYYY-MM-DD format)
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("items.menuItem", "name price");

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.menuItem", "name price");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Please provide status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("items.menuItem", "name price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 🔔 Real-time notify
    const io = req.app.get("io");
    if (io) {
      const plainOrder = order.toObject();
      io.to(`table:${order.tableId}`).emit("order:updated", plainOrder);
      io.to("admins").emit("order:updated", plainOrder);
    }

    // 🔔 Push notification to User (specific table)
    const userTokens = await FcmToken.find({ role: "user", tableId: order.tableId }).distinct("token");
    await sendNotification(userTokens, "📢 Order Update", `Your order is now ${status}`, {
      orderId: order._id.toString(),
    });

    res.json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };

