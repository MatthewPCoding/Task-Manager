const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
app.use(cors());

app.use(express.json());

let tasks = [];

app.post("/api/tasks", (req, res) => {
    const task = { id: Date.now(), text: req.body.text, done: false };
    tasks.push(task);
    res.json(task);
});

app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

app.put("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (task) {
        task.text = req.body.text ?? task.text;
        task.done = req.body.done ?? task.done;
        res.json(task);
    } else {
        res.status(404).json({ error: "task not found" });
    }
});

app.delete("/api/tasks/:id", (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);