import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["expense", "income", "transfer"],
    required: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Food & Dining",
      "Transport",
      "Shopping",
      "Housing",
      "Health",
      "Entertainment",
      "Utilities",
      "Salary",
      "Freelance",
      "Investment",
      "Gift",
      "Other"
    ]
  },

  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  note: {
    type: String,
    trim: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Transaction = mongoose.model('transaction', transactionSchema);
export default Transaction;
