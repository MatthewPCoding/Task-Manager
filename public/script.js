/**
 * Task Manager Frontend Logic
 * ---------------------------
 * Handles task CRUD operations by communicating with the
 * Express/MongoDB backend and updating the UI dynamically.
 */

const API_URL = "/api/tasks";

/**
 * Fetch and render all tasks from the backend.
 */
async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
}

/**
 * Add a new task to the database.
 */
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

/**
 * Toggle completion status of a task.
 * @param {string} id - MongoDB task ID
 * @param {boolean} done - Current completion status
 */
async function toggleTask(id, done) {
     await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !done })
  });
  fetchTasks();
}

/**
 * Delete a task by ID.
 */
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

/**
 * Render the list of tasks in the DOM.
 * @param {Array} tasks - Array of task objects from the backend
 */
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
        <button onclick="toggleTask('${task._id}', ${task.done})">
          ${task.done ? "Undo" : "Done"}
        </button>
        <button onclick="deleteTask('${task._id}')">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Set up event listeners
document.getElementById("addTaskBtn").addEventListener("click", addTask);

// Initial fetch on page load
fetchTasks();