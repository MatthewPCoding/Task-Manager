
const API_URL = "http://localhost:3000/api/tasks";

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (!text) return;

    await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
});

input.value = "";
fetchTasks();
}

async function toggleTask(id, done) {
     await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !done })
  });
  fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

function renderTasks(tasks) {
  const list = document.getElementById("tasklist");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span style="text-decoration:${task.done ? 'line-through' : 'none'}">
        ${task.text}
      </span>
      <div>
        <button onclick="toggleTask(${task.id}, ${task.done})">
          ${task.done ? "Undo" : "Done"}
        </button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}

document.getElementById("addTaskBtn").addEventListener("click", addTask);
fetchTasks();