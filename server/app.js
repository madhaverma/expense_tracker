import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Transaction from "./models/transaction.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: join(__dirname, ".env") });

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

await mongoose.connect(process.env.Mongodb_Url)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/transactions", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ error: "User id is required." });
    }

    const transactions = await Transaction.find({ user }).sort({ date: -1, createdAt: -1 });
    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not load transactions." });
  }
});

app.get("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({
        error: "Transaction not found.",
      });
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not load transaction." });
  }
});
app.post("/api/transactions", async (req, res) => {
  try {
    if (!req.body.user) {
      return res.status(400).json({ error: "User id is required." });
    }

    const transaction = new Transaction(req.body);
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not save transaction." });
  }
});
app.put("/api/transactions/:id", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ error: "User id is required." });
    }

    const updated = await Transaction.findOneAndUpdate({ _id: req.params.id, user }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not update transaction." });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ error: "User id is required." });
    }

    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user });
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found." });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not delete transaction." });
  }
});

// user routes 

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: passwordHash });
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not create user." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not login user." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not load users." });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
