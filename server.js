/**
 * Task Manager Backend
 * --------------------
 * Express + MongoDB REST API for creating, reading,
 * updating, and deleting tasks.
 */

require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

// Enable Cross-Origin Resource Sharing for the frontend
app.use(cors());

// Connect to MongoDB using environment variable from .env
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Parse JSON request bodies
app.use(express.json());

// ── Mongoose Model 
const TaskSchema = new mongoose.Schema({
  text: String,
  done: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', TaskSchema);

const path = require("path");

// Serve the root folder as static files
app.use(express.static(__dirname));

// Optional: send index.html for any unknown route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ── CRUD Routes ────────────────────────────────────────────────

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = await Task.create({ text: req.body.text });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve all tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update a specific task (text or completion status)
app.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text, done: req.body.done },
    { new: true }
  );
  task ? res.json(task) : res.status(404).json({ error: "task not found" });
});

// Delete a task by ID
app.delete("/api/tasks/:id", async (req, res) => {
  const result = await Task.findByIdAndDelete(req.params.id);
  result ? res.json({ success: true }) : res.status(404).json({ error: "task not found" });
});

// Start the Express server
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

