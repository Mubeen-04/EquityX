require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

// Initialize Stripe only if the secret key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  console.log("Stripe initialized successfully");
} else {
  console.log("⚠️ WARNING: STRIPE_SECRET_KEY not set. Payment endpoints will not work until configured.");
}

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { FavoritesModel } = require("./model/FavoritesModel");
const { TicketModel } = require("./model/TicketModel");
const UserModel = require("./model/UserModel");

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URL;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not set in environment variables");
  process.exit(1);
}
console.log("JWT_SECRET configured");

if (!uri) {
  console.error("❌ FATAL ERROR: MONGO_URL is not set in environment variables");
  process.exit(1);
}
console.log("MongoDB URL configured");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://equityx.onrender.com"],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

// ============ AUTH MIDDLEWARE ============
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// ============ DATABASE SEEDING ============

// Auto-seed database with sample data if empty
const seedDatabase = async () => {
  try {
    // Clean up: DELETE all holdings and positions without userId (old corrupted data)
    const deletedHoldings = await HoldingsModel.deleteMany({ userId: { $exists: false } });
    if (deletedHoldings.deletedCount > 0) {
      console.log(`🗑️ Deleted ${deletedHoldings.deletedCount} holdings without userId`);
    }
    
    const deletedPositions = await PositionsModel.deleteMany({ userId: { $exists: false } });
    if (deletedPositions.deletedCount > 0) {
      console.log(`🗑️ Deleted ${deletedPositions.deletedCount} positions without userId`);
    }

    const holdingCount = await HoldingsModel.countDocuments();
    const positionCount = await PositionsModel.countDocuments();

    // NOTE: Holdings are NOT seeded by default - users start with empty portfolio
    // Holdings are only created when users buy stocks
    if (holdingCount === 0) {
      console.log("📝 Holdings will be created when users buy stocks");
    }

    if (positionCount === 0) {
      console.log("📝 Seeding positions data...");
      
      // Get the first user to associate positions with
      const user = await UserModel.findOne();
      
      if (user) {
        const tempPositions = [
          { userId: user._id, product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
          { userId: user._id, product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
        ];

        await PositionsModel.insertMany(tempPositions);
        console.log("Positions data seeded successfully");
      } else {
        console.log("⏭️ Skipping positions seeding - create a user first to seed positions");
      }
    }
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  }
};

// Seed database when server starts
setTimeout(() => {
  mongoose.connect(uri)
    .then(() => {
      console.log("DB Connected!");
      seedDatabase();
    })
    .catch(err => console.log("DB Connection Error:", err));
}, 500);
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

app.get("/allHoldings", verifyToken, async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({ userId: req.userId });
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching holdings", error: err.message });
  }
});

app.get("/allPositions", verifyToken, async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({ userId: req.userId });
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching positions", error: err.message });
  }
});

app.get("/allOrders", verifyToken, async (req, res) => {
  try {
    let allOrders = await OrdersModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
});

// ============ FAVORITES API ============
app.get("/favorites", verifyToken, async (req, res) => {
  try {
    const favorites = await FavoritesModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    const stockNames = favorites.map(fav => fav.stockName);
    res.json(stockNames);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching favorites", error: err.message });
  }
});

app.post("/favorites", verifyToken, async (req, res) => {
  try {
    const { stockName } = req.body;
    
    if (!stockName) {
      return res.status(400).json({ msg: "Stock name required" });
    }

    // Check if already favorited
    const existing = await FavoritesModel.findOne({ userId: req.userId, stockName });
    if (existing) {
      return res.status(400).json({ msg: "Already in favorites" });
    }

    const favorite = new FavoritesModel({
      userId: req.userId,
      stockName: stockName
    });

    await favorite.save();
    res.status(201).json({ msg: "Added to favorites", favorite });
  } catch (err) {
    res.status(500).json({ msg: "Error adding favorite", error: err.message });
  }
});

app.delete("/favorites/:stockName", verifyToken, async (req, res) => {
  try {
    const { stockName } = req.params;
    
    const result = await FavoritesModel.findOneAndDelete({
      userId: req.userId,
      stockName: stockName
    });

    if (!result) {
      return res.status(404).json({ msg: "Favorite not found" });
    }

    res.json({ msg: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ msg: "Error removing favorite", error: err.message });
  }
});

app.get("/indices", (req, res) => {
  // Transform indices data to match frontend expectations
  const transformedIndices = {};
  for (let key in indexData) {
    transformedIndices[key] = {
      ...indexData[key],
      price: indexData[key].current,
      openPrice: indexData[key].open,
      isDown: parseFloat(indexData[key].percent) < 0
    };
  }
  res.json(transformedIndices);
});

app.get("/marketPrices", (req, res) => {
  res.json(marketPrices);
});

app.get("/balance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error("Balance fetch error:", error);
    res.status(500).json({ msg: "Error fetching balance", error: error.message });
  }
});

app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const userId = req.userId; // Get from JWT token, not from client

    // Validation
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    if (qty <= 0 || price <= 0) {
      return res.status(400).json({ msg: "Quantity and price must be greater than 0" });
    }

    // Get user balance
    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const totalCost = qty * price;

    // Validate based on order mode
    if (mode === "BUY") {
      if (user.balance < totalCost) {
        return res.status(400).json({ 
          msg: "Insufficient funds", 
          required: totalCost, 
          available: user.balance 
        });
      }
    } else if (mode === "SELL") {
      const holding = await HoldingsModel.findOne({ name, userId });
      if (!holding || holding.qty < qty) {
        const availableQty = holding ? holding.qty : 0;
        return res.status(400).json({ 
          msg: "Insufficient holdings", 
          required: qty, 
          available: availableQty 
        });
      }
    }

    // Create order
    let newOrder = new OrdersModel({
      name: name,
      qty: qty,
      price: price,
      mode: mode,
      status: "pending",
      userId: userId,
    });

    await newOrder.save();

    io.to(`user_${userId}`).emit("newOrder", newOrder);
    console.log(`📦 New ${mode} order placed for ${name}: ${qty} @ ₹${price}`);

    // Auto-execute order after 3-5 seconds
    const executionDelay = Math.random() * 2000 + 3000;
    setTimeout(async () => {
      try {
        const updatedOrder = await OrdersModel.findByIdAndUpdate(
          newOrder._id,
          { $set: { status: "executed", updatedAt: new Date() } },
          { new: true }
        );
        io.to(`user_${updatedOrder.userId}`).emit("orderStatusUpdate", updatedOrder);
        console.log(`Order executed: ${updatedOrder.name}`);

        // Update holdings for BUY order
        // NOTE: Balance was checked at the beginning (line 318), will be updated here
        if (updatedOrder.mode === "BUY") {
          // Update balance
          await UserModel.findByIdAndUpdate(userId, {
            $inc: { balance: -totalCost }
          });
          console.log(`Balance deducted (BUY): -₹${totalCost}`);
          
          // Update holdings
          const holding = await HoldingsModel.findOne({ name: updatedOrder.name, userId: userId });
          if (holding) {
            // Recalculate average cost using weighted average formula
            const newQty = holding.qty + updatedOrder.qty;
            const newAvg = (holding.qty * holding.avg + updatedOrder.qty * updatedOrder.price) / newQty;
            await HoldingsModel.findByIdAndUpdate(
              holding._id,
              { $set: { qty: newQty, avg: newAvg } }
            );
            console.log(`📈 Holding updated: ${updatedOrder.name} qty ${holding.qty} -> ${newQty}, avg cost ${holding.avg} -> ${newAvg.toFixed(2)}`)
          } else {
            // Calculate net change (price vs avg) and day change
            const netPercent = 0; // Since price = avg initially, net change is 0
            const dayPercent = (Math.random() - 0.5) * 2; // Random -1 to +1
            const netStr = (netPercent >= 0 ? "+" : "") + netPercent.toFixed(2) + "%";
            const dayStr = (dayPercent >= 0 ? "+" : "") + dayPercent.toFixed(2) + "%";
            
            const newHolding = new HoldingsModel({
              name: updatedOrder.name,
              qty: updatedOrder.qty,
              avg: updatedOrder.price,
              price: updatedOrder.price,
              net: netStr,
              day: dayStr,
              isLoss: dayPercent < 0,
              userId: userId,
            });
            await newHolding.save();
            console.log(`New holding added: ${updatedOrder.name} qty ${updatedOrder.qty}`);
          }
        } else if (updatedOrder.mode === "SELL") {
          // Update balance (add cash from sale)
          await UserModel.findByIdAndUpdate(userId, {
            $inc: { balance: totalCost }
          });
          console.log(`Balance credited (SELL): +₹${totalCost}`);
          
          // Update holdings
          const holding = await HoldingsModel.findOne({ name: updatedOrder.name, userId: userId });
          if (holding) {
            const newQty = holding.qty - updatedOrder.qty;
            if (newQty <= 0) {
              await HoldingsModel.deleteOne({ name: updatedOrder.name, userId: userId });
              console.log(`🗑️ Holding removed: ${updatedOrder.name}`);
            } else {
              await HoldingsModel.findByIdAndUpdate(
                holding._id,
                { $set: { qty: newQty } }
              );
              console.log(`📉 Holding updated: ${updatedOrder.name} qty ${holding.qty} -> ${newQty}`);
            }
          }
        }

        // Broadcast updated data to specific user
        const userHoldings = await HoldingsModel.find({ userId });
        io.to(`user_${userId}`).emit("holdingsData", userHoldings);

        const updatedUser = await UserModel.findById(userId);
        io.to(`user_${userId}`).emit("balanceUpdate", { balance: updatedUser.balance });
      } catch (err) {
        console.error("Error executing order:", err);
      }
    }, executionDelay);

    res.json({ msg: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ msg: "Error placing order", error: error.message });
  }
});

// ============ CANCEL ORDER ============
app.put("/cancelOrder/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      orderId,
      { $set: { status: "cancelled", updatedAt: new Date() } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Broadcast order cancellation to the order owner only
    io.to(`user_${updatedOrder.userId}`).emit("orderStatusUpdate", updatedOrder);
    console.log(`🚫 Order cancelled: ${updatedOrder.name}`);

    res.json({ msg: "Order cancelled successfully!", order: updatedOrder });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ msg: "Error cancelling order" });
  }
});

// ============ AUTHENTICATION ROUTES ============

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { email, password, name, phone, pan } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new UserModel({
      email,
      password: hashedPassword,
      name: name || "User",
      phone: phone || "",
      pan: pan || "",
    });

    await user.save();

    res.status(201).json({ msg: "User created successfully", userId: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user._id, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ============ WEBSOCKET REAL-TIME UPDATES ============

// Store connected clients
const connectedUsers = new Map();

// Index data storage
let indexData = {
  NIFTY50: { name: "NIFTY 50", current: 24100.5, open: 24080.0, high: 24150.0, low: 24050.0, percent: 0.085 },
  SENSEX: { name: "SENSEX", current: 78500.2, open: 78420.0, high: 78550.0, low: 78350.0, percent: 0.102 }
};

// Market prices for all 50 stocks (real-time simulation)
let marketPrices = {
  ADANIGREEN: { price: 1850.5, openPrice: 1850.5, percent: "2.34%", isDown: false },
  ADANIPORTS: { price: 920.3, openPrice: 920.3, percent: "-1.20%", isDown: true },
  ASIANPAINT: { price: 3125.0, openPrice: 3125.0, percent: "0.85%", isDown: false },
  AXISBANK: { price: 1075.5, openPrice: 1075.5, percent: "1.45%", isDown: false },
  BAJAJFINSV: { price: 1680.2, openPrice: 1680.2, percent: "-0.50%", isDown: true },
  BAJAJMOTORS: { price: 6350.0, openPrice: 6350.0, percent: "3.20%", isDown: false },
  BHARATIARTL: { price: 541.15, openPrice: 541.15, percent: "2.99%", isDown: false },
  BPCL: { price: 395.8, openPrice: 395.8, percent: "1.10%", isDown: false },
  BRITANNIA: { price: 4580.0, openPrice: 4580.0, percent: "-2.15%", isDown: true },
  CIPLA: { price: 1225.5, openPrice: 1225.5, percent: "0.35%", isDown: false },
  "COAL INDIA": { price: 650.0, openPrice: 650.0, percent: "1.85%", isDown: false },
  COLPAL: { price: 2580.75, openPrice: 2580.75, percent: "-0.75%", isDown: true },
  DRREDDY: { price: 7820.0, openPrice: 7820.0, percent: "2.50%", isDown: false },
  EICHERMOT: { price: 3980.0, openPrice: 3980.0, percent: "-1.45%", isDown: true },
  GAIL: { price: 185.5, openPrice: 185.5, percent: "0.90%", isDown: false },
  GRASIM: { price: 2420.5, openPrice: 2420.5, percent: "1.65%", isDown: false },
  HCLTECH: { price: 1980.0, openPrice: 1980.0, percent: "-0.85%", isDown: true },
  HDFCBANK: { price: 1522.35, openPrice: 1522.35, percent: "0.11%", isDown: false },
  HDFCLIFE: { price: 585.0, openPrice: 585.0, percent: "-1.20%", isDown: true },
  HEROMOTOCO: { price: 3980.0, openPrice: 3980.0, percent: "2.10%", isDown: false },
  HINDUNILVR: { price: 2417.4, openPrice: 2417.4, percent: "0.21%", isDown: false },
  ICICIBANK: { price: 955.0, openPrice: 955.0, percent: "1.35%", isDown: false },
  INDIGO: { price: 3520.5, openPrice: 3520.5, percent: "-2.45%", isDown: true },
  INFY: { price: 1555.45, openPrice: 1555.45, percent: "-1.60%", isDown: true },
  IOC: { price: 98.5, openPrice: 98.5, percent: "0.65%", isDown: false },
  ITC: { price: 207.9, openPrice: 207.9, percent: "0.80%", isDown: false },
  JSWSTEEL: { price: 820.0, openPrice: 820.0, percent: "1.75%", isDown: false },
  KOTAKBANK: { price: 1850.0, openPrice: 1850.0, percent: "-0.90%", isDown: true },
  KPITTECH: { price: 266.45, openPrice: 266.45, percent: "3.54%", isDown: false },
  LARSENTOUBRO: { price: 2890.5, openPrice: 2890.5, percent: "0.45%", isDown: false },
  LICI: { price: 820.0, openPrice: 820.0, percent: "-1.10%", isDown: true },
  "M&M": { price: 779.8, openPrice: 779.8, percent: "-0.01%", isDown: true },
  MARUTI: { price: 9850.0, openPrice: 9850.0, percent: "2.85%", isDown: false },
  NESTLEIND: { price: 22580.0, openPrice: 22580.0, percent: "1.20%", isDown: false },
  NTPC: { price: 260.5, openPrice: 260.5, percent: "0.75%", isDown: false },
  ONGC: { price: 116.8, openPrice: 116.8, percent: "-0.09%", isDown: true },
  POWERGRID: { price: 285.0, openPrice: 285.0, percent: "1.45%", isDown: false },
  RELIANCE: { price: 2112.4, openPrice: 2112.4, percent: "1.44%", isDown: false },
  SBIN: { price: 430.2, openPrice: 430.2, percent: "-0.34%", isDown: true },
  SUNPHARMA: { price: 1825.0, openPrice: 1825.0, percent: "-0.65%", isDown: true },
  TCS: { price: 3194.8, openPrice: 3194.8, percent: "-0.25%", isDown: true },
  TATACONSUM: { price: 950.5, openPrice: 950.5, percent: "0.85%", isDown: false },
  TATAMOTORS: { price: 630.0, openPrice: 630.0, percent: "2.15%", isDown: false },
  TATASTEEL: { price: 125.5, openPrice: 125.5, percent: "-1.85%", isDown: true },
  TECHM: { price: 1480.0, openPrice: 1480.0, percent: "1.05%", isDown: false },
  TITAN: { price: 2850.0, openPrice: 2850.0, percent: "-0.50%", isDown: true },
  TONNE: { price: 1680.0, openPrice: 1680.0, percent: "1.95%", isDown: false },
  UPL: { price: 550.0, openPrice: 550.0, percent: "-1.35%", isDown: true },
  WIPRO: { price: 577.75, openPrice: 577.75, percent: "0.32%", isDown: false },
  YESBANK: { price: 18.5, openPrice: 18.5, percent: "3.45%", isDown: false },
};

// Simulate price updates
function simulatePriceUpdates() {
  console.log("Price simulation started - updating every 2 seconds");
  let updateCount = 0;
  
  setInterval(async () => {
    try {
      // ===== UPDATE HOLDINGS PRICES =====
      const holdings = await HoldingsModel.find({});
      
      // Group updated holdings by userId to emit per-user (prevents data leaking between users)
      const holdingsByUser = {};
      if (holdings.length > 0) {
        for (let holding of holdings) {
          const percentChange = (Math.random() - 0.5) * 0.0016; // ±0.08% change
          const newPrice = Math.max(holding.price * (1 + percentChange), 1); // Ensure price > 0
          
          // Update in database
          holding.price = newPrice;
          holding.day = ((newPrice - holding.avg) / holding.avg * 100).toFixed(2) + "%";
          await holding.save();
          
          const uid = holding.userId ? holding.userId.toString() : null;
          if (uid) {
            if (!holdingsByUser[uid]) holdingsByUser[uid] = [];
            holdingsByUser[uid].push(holding.toObject());
          }
          
          // Also update market prices for stocks in holdings
          if (marketPrices[holding.name]) {
            marketPrices[holding.name].price = newPrice;
          }
        }
      }

      // ===== UPDATE ALL MARKET PRICES =====
      for (let stockName in marketPrices) {
        const percentChange = (Math.random() - 0.5) * 0.0016; // ±0.08% change
        const currentPrice = marketPrices[stockName].price;
        const newPrice = Math.max(currentPrice * (1 + percentChange), 1);
        
        // Update price
        marketPrices[stockName].price = newPrice;
        
        // Calculate percent change from opening price
        const openPrice = marketPrices[stockName].openPrice;
        const dailyPercentChange = ((newPrice - openPrice) / openPrice * 100).toFixed(2);
        marketPrices[stockName].percent = (dailyPercentChange >= 0 ? "+" : "") + dailyPercentChange + "%";
        marketPrices[stockName].isDown = dailyPercentChange < 0;
      }

      // ===== UPDATE INDEX VALUES =====
      const niftyChange = (Math.random() - 0.5) * 20; // -10 to +10 points
      const sensexChange = (Math.random() - 0.5) * 50; // -25 to +25 points
      
      indexData.NIFTY50.current = Math.max(indexData.NIFTY50.current + niftyChange, 1000);
      indexData.NIFTY50.percent = ((indexData.NIFTY50.current - indexData.NIFTY50.open) / indexData.NIFTY50.open * 100).toFixed(2);
      
      indexData.SENSEX.current = Math.max(indexData.SENSEX.current + sensexChange, 5000);
      indexData.SENSEX.percent = ((indexData.SENSEX.current - indexData.SENSEX.open) / indexData.SENSEX.open * 100).toFixed(2);

      // ===== EMIT UPDATES TO ALL CLIENTS =====
      updateCount++;
      if (updateCount % 2 === 0) { // Log every 2nd update
        console.log(`Market update #${updateCount} - Broadcasting to ${Object.keys(io.sockets.sockets).length} connected clients`);
      }
      
      // Emit holdings update per user (prevents data leaking between users)
      for (const [uid, userHoldings] of Object.entries(holdingsByUser)) {
        io.to(`user_${uid}`).emit("priceUpdate", userHoldings);
      }
      
      // Emit market prices update (all 50 stocks)
      io.emit("marketPricesUpdate", marketPrices);
      
      // Emit index update
      io.emit("indexUpdate", indexData);
    } catch (err) {
      console.error("❌ Price update error:", err.message);
    }
  }, 2000); // Every 2 seconds
}

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  let userId = null; // Track userId for filtering broadcasts

  // Send initial market prices to new client
  socket.emit("marketPricesUpdate", marketPrices);

  // User joins with token
  socket.on("join", (data) => {
    // Accept either string token or object with userId
    const token = typeof data === 'string' ? data : data.token;
    userId = typeof data === 'object' ? data.userId : null;
    
    connectedUsers.set(socket.id, { token, userId, joinedAt: new Date() });
    
    // Join a room with userId so we can send user-specific data
    if (userId) {
      socket.join(`user_${userId}`);
    }
    
    console.log("Total connected users:", connectedUsers.size);
    
    // Emit connection confirmation
    socket.emit("connected", { connected: true, userId: socket.id });
  });

  // Request current holdings
  socket.on("requestHoldings", async () => {
    try {
      // Filter by userId if available, otherwise return all (for compatibility)
      const query = userId ? { userId } : {};
      const holdings = await HoldingsModel.find(query);
      socket.emit("holdingsData", holdings);
    } catch (err) {
      socket.emit("error", "Failed to fetch holdings");
    }
  });

  // Request market prices (all 50 stocks)
  socket.on("requestMarketPrices", () => {
    try {
      socket.emit("marketPricesUpdate", marketPrices);
    } catch (err) {
      socket.emit("error", "Failed to fetch market prices");
    }
  });

  // Request current positions
  socket.on("requestPositions", async () => {
    try {
      // Filter by userId if available, otherwise return all (for compatibility)
      const query = userId ? { userId } : {};
      const positions = await PositionsModel.find(query);
      socket.emit("positionsData", positions);
    } catch (err) {
      socket.emit("error", "Failed to fetch positions");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    console.log("User disconnected:", socket.id);
    console.log("Total connected users:", connectedUsers.size);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// ============ STRIPE PAYMENT ENDPOINTS ============

// Create payment intent for buy order
app.post("/create-payment-intent", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ msg: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables." });
    }

    const { amount, name, qty, price, mode } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "inr",
      description: `Buy order: ${qty} shares of ${name} at ₹${price}`,
      metadata: {
        userName: name,
        qty: qty,
        price: price,
        mode: mode,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({ msg: "Error creating payment intent", error: error.message });
  }
});

// Confirm payment and create order
app.post("/confirm-payment", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ msg: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables." });
    }

    const { paymentIntentId, name, qty, price, mode } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ msg: "Payment intent ID required" });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if payment succeeded
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ msg: "Payment not successful", status: paymentIntent.status });
    }

    // Create order in database after successful payment
    const totalCost = qty * price;

    // Get user
    let user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // For BUY orders: validate balance is sufficient
    if (mode === "BUY") {
      if (user.balance < totalCost) {
        return res.status(400).json({ 
          msg: "Insufficient funds", 
          required: totalCost, 
          available: user.balance 
        });
      }
    }
    
    // For SELL orders: validate user has enough holdings
    if (mode === "SELL") {
      const holding = await HoldingsModel.findOne({ name: name, userId: req.body.userId });
      if (!holding || holding.qty < qty) {
        const availableQty = holding ? holding.qty : 0;
        return res.status(400).json({ 
          msg: "Insufficient holdings", 
          required: qty, 
          available: availableQty 
        });
      }
    }

    let newOrder = new OrdersModel({
      name: name,
      qty: qty,
      price: price,
      mode: mode,
      status: "pending",
      paymentIntentId: paymentIntentId,
      userId: req.body.userId,
    });

    await newOrder.save();

    // Broadcast new order to the order owner only
    io.to(`user_${newOrder.userId}`).emit("newOrder", newOrder);
    console.log(`💳 Paid order placed: ${qty} ${name} @ ₹${price} (Payment ID: ${paymentIntentId})`);

    // Auto-execute order after 3-5 seconds (realistic simulation)
    const executionDelay = Math.random() * 2000 + 3000;
    setTimeout(async () => {
      try {
        const updatedOrder = await OrdersModel.findByIdAndUpdate(
          newOrder._id,
          { $set: { status: "executed", updatedAt: new Date() } },
          { new: true }
        );
        io.to(`user_${updatedOrder.userId}`).emit("orderStatusUpdate", updatedOrder);
        console.log(`Order executed: ${updatedOrder.name}`);

        // Update balance (deduct for BUY, add for SELL)
        if (updatedOrder.mode === "BUY") {
          await UserModel.findByIdAndUpdate(req.body.userId, {
            $inc: { balance: -totalCost }
          });
          console.log(`Balance deducted (BUY): -₹${totalCost}`);
        } else if (updatedOrder.mode === "SELL") {
          await UserModel.findByIdAndUpdate(req.body.userId, {
            $inc: { balance: totalCost }
          });
          console.log(`Balance credited (SELL): +₹${totalCost}`);
        }

        // Update holdings based on order mode (BUY/SELL)
        let holding = await HoldingsModel.findOne({ name: updatedOrder.name, userId: req.body.userId });
        if (updatedOrder.mode === "BUY") {
          if (holding) {
            // Increment existing holding and recalculate average cost
            const newQty = holding.qty + updatedOrder.qty;
            const newAvg = (holding.qty * holding.avg + updatedOrder.qty * updatedOrder.price) / newQty;
            await HoldingsModel.findByIdAndUpdate(
              holding._id,
              { $set: { qty: newQty, avg: newAvg } }
            );
            console.log(`📈 Updated holding: ${updatedOrder.name} qty now ${newQty}, avg cost: ₹${newAvg.toFixed(2)}`)
          } else {
            // Create new holding
            const netPercent = 0; // Since price = avg initially, net change is 0
            const dayPercent = (Math.random() - 0.5) * 2; // Random -1 to +1
            const netStr = (netPercent >= 0 ? "+" : "") + netPercent.toFixed(2) + "%";
            const dayStr = (dayPercent >= 0 ? "+" : "") + dayPercent.toFixed(2) + "%";
            
            let newHolding = new HoldingsModel({
              name: updatedOrder.name,
              qty: updatedOrder.qty,
              avg: updatedOrder.price,
              price: updatedOrder.price,
              net: netStr,
              day: dayStr,
              isLoss: dayPercent < 0,
              userId: req.body.userId,
            });
            await newHolding.save();
            console.log(`🆕 New holding created: ${updatedOrder.name} (${updatedOrder.qty} shares)`);
          }
        } else if (updatedOrder.mode === "SELL") {
          if (holding) {
            const newQty = holding.qty - updatedOrder.qty;
            if (newQty <= 0) {
              // Delete holding with verification
              const result = await HoldingsModel.deleteOne({ name: updatedOrder.name, userId: req.body.userId });
              if (result.deletedCount === 1) {
                console.log(`🗑️ Holding removed: ${updatedOrder.name}`);
              } else {
                console.warn(`⚠️ Holdings delete verification failed: ${updatedOrder.name} may not have been deleted`);
              }
            } else {
              await HoldingsModel.findByIdAndUpdate(
                holding._id,
                { $set: { qty: newQty } }
              );
              console.log(`📉 Holdings reduced: ${updatedOrder.name} qty ${holding.qty} -> ${newQty}`);
            }
          } else {
            console.warn(`⚠️ Attempted to sell ${updatedOrder.qty} of ${updatedOrder.name}, but no holding found`);
          }
        }

        // Broadcast updated holdings and balance ONLY to the specific user
        const userHoldings = await HoldingsModel.find({ userId: req.body.userId });
        io.to(`user_${req.body.userId}`).emit("holdingsData", userHoldings);

        const updatedUser = await UserModel.findById(req.body.userId);
        io.to(`user_${req.body.userId}`).emit("balanceUpdate", { balance: updatedUser.balance });
      } catch (holdingErr) {
        console.error("Error updating holdings on BUY:", holdingErr);
      }
    }, executionDelay);

    res.json({
      msg: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ msg: "Error confirming payment", error: error.message });
  }
});

// Get payment intent status
app.get("/payment-status/:paymentIntentId", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ msg: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables." });
    }

    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from paise to rupees
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("Payment status error:", error);
    res.status(500).json({ msg: "Error retrieving payment status" });
  }
});

// ============ FUNDS MANAGEMENT ============

// Create payment intent for adding balance
app.post("/create-balance-intent", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ msg: "Stripe is not configured" });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "inr",
      description: `Add ₹${amount} balance to Zerodha portfolio`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
    });
  } catch (error) {
    console.error("Balance intent creation error:", error);
    res.status(500).json({ msg: "Error creating payment intent" });
  }
});

// Confirm balance addition
app.post("/confirm-balance", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ msg: "Stripe is not configured" });
    }

    const { paymentIntentId, amount, userId } = req.body;

    if (!paymentIntentId || !amount || !userId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if payment succeeded
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ 
        msg: "Payment not successful", 
        status: paymentIntent.status 
      });
    }

    // SECURITY FIX: Verify amount matches to prevent tampering
    const amountInPaise = Math.round(amount * 100);
    if (Math.abs(paymentIntent.amount - amountInPaise) > 1) { // Allow 1 paise tolerance for rounding
      return res.status(400).json({ 
        msg: "Amount mismatch. Payment amount does not match requested amount",
        requested: amount,
        actual: paymentIntent.amount / 100
      });
    }

    // Update user balance
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ msg: "User not found" });
    }

    console.log(`Balance added: ₹${amount} for user ${updatedUser.email}. New balance: ₹${updatedUser.balance}`);

    // Broadcast updated balance ONLY to the specific user
    io.to(`user_${userId}`).emit("balanceUpdate", { balance: updatedUser.balance });

    res.json({
      msg: "Balance added successfully",
      newBalance: updatedUser.balance,
    });
  } catch (error) {
    console.error("Balance confirmation error:", error);
    res.status(500).json({ msg: "Error confirming balance addition" });
  }
});

// Start price update simulation when server starts
setTimeout(() => {
  console.log("Starting price update simulation...");
  simulatePriceUpdates();
}, 2000);

// ============ SUPPORT TICKETS ============

// Submit a new support ticket (public endpoint - no auth required)
app.post("/submitTicket", verifyToken, async (req, res) => {
  try {
    const { name, email, category, message } = req.body;
    const userId = req.userId; // Extract from token

    // Validation
    if (!name || !email || !category || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!["Account & KYC", "Deposits & Withdrawals", "Order Execution", "Brokerage & Charges", "Technical Issue", "Other"].includes(category)) {
      return res.status(400).json({ msg: "Invalid category" });
    }

    // Create new ticket with userId
    const newTicket = new TicketModel({
      userId,
      name,
      email,
      category,
      message,
      status: "open",
      priority: "medium",
    });

    await newTicket.save();

    console.log(`📋 New support ticket created: ${newTicket._id} from ${email} (User: ${userId})`);

    res.status(201).json({
      msg: "Ticket submitted successfully",
      ticketId: newTicket._id,
    });
  } catch (error) {
    console.error("Ticket submission error:", error);
    res.status(500).json({ msg: "Error submitting ticket" });
  }
});

// Get all tickets for authenticated users (for dashboard/admin)
app.get("/tickets", verifyToken, async (req, res) => {
  try {
    const tickets = await TicketModel.find({ email: req.headers["x-user-email"] }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ msg: "Error fetching tickets" });
  }
});

// Get single ticket by ID
app.get("/ticket/:ticketId", async (req, res) => {
  try {
    const ticket = await TicketModel.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ msg: "Error fetching ticket" });
  }
});

// Serve static files from built apps
const buildPath = path.join(__dirname, "..");

// Serve dashboard static files at /dashboard path
app.use("/dashboard", express.static(path.join(buildPath, "dashboard/dist")));

// Dashboard SPA fallback - serve dashboard index.html for /dashboard/* routes
app.get("/dashboard/*", (req, res) => {
  res.sendFile(path.join(buildPath, "dashboard/dist/index.html"));
});

// Serve frontend static files at root
app.use(express.static(path.join(buildPath, "frontend/dist")));

// Frontend SPA fallback - serve frontend index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "frontend/dist/index.html"));
});

server.listen(PORT, () => {
  console.log("App started on port " + PORT);
});
