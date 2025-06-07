const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('lists');
const completedCounter = document.getElementById("completed-count");
const uncompletedCounter = document.getElementById("uncompleted-count");
const folderGrid = document.getElementById("folder-grid");
const folderTitle = document.getElementById("folder-title");

let currentFolder = null;

// Show views
function showFolderDashboard() {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("folder-dashboard").style.display = "block";
  loadFolderCards();
}

function openFolder(name) {
  currentFolder = name;
  document.getElementById("folder-dashboard").style.display = "none";
  document.getElementById("todo-view").style.display = "block";
  folderTitle.textContent = name;
  loadTasks();
}

function goBackToFolders() {
  currentFolder = null;
  document.getElementById("todo-view").style.display = "none";
  document.getElementById("folder-dashboard").style.display = "block";
  loadFolderCards();
}

// Folder logic
function addFolder() {
  const name = document.getElementById('folder-name').value.trim();
  if (!name) return alert("Folder name is empty.");
  const folders = JSON.parse(localStorage.getItem("folders") || "[]");
  if (folders.includes(name)) return alert("Folder already exists.");
  folders.push(name);
  localStorage.setItem("folders", JSON.stringify(folders));
  document.getElementById('folder-name').value = "";
  loadFolderCards();
}

function loadFolderCards() {
  folderGrid.innerHTML = "";
  const folders = JSON.parse(localStorage.getItem("folders") || "[]");
  folders.forEach(folder => {
    const div = document.createElement("div");
    div.className = "folder-card";
    div.textContent = folder;
    div.onclick = () => openFolder(folder);
    folderGrid.appendChild(div);
  });
}

// Task logic
function loadTasks() {
  listContainer.innerHTML = "";
  const allData = JSON.parse(localStorage.getItem("todo-data") || "{}");
  const tasks = allData[currentFolder] || [];
  tasks.forEach(task => createTaskElement(task.text, task.completed));
  updateCounters();
}

function saveTasksToLocalStorage() {
  const tasks = [];
  listContainer.querySelectorAll("li").forEach(li => {
    const taskText = li.querySelector("label span").textContent;
    const isCompleted = li.classList.contains("completed");
    tasks.push({ text: taskText, completed: isCompleted });
  });
  const allData = JSON.parse(localStorage.getItem("todo-data") || "{}");
  allData[currentFolder] = tasks;
  localStorage.setItem("todo-data", JSON.stringify(allData));
}

function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function createTaskElement(task, isCompleted = false) {
  const li = document.createElement('li');
  li.innerHTML = `
    <label>
      <input type="checkbox" ${isCompleted ? "checked" : ""}>
      <span>${task}</span>
    </label>
    <span class="edit-btn">Edit</span> 
    <span class="delete-btn">Delete</span>
  `;
  if (isCompleted) li.classList.add("completed");
  listContainer.appendChild(li);

  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");
  const taskSpan = li.querySelector("label span");

  checkbox.addEventListener("click", () => {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasksToLocalStorage();
  });

  editBtn.addEventListener("click", () => {
    const updated = prompt("Edit your task", taskSpan.textContent);
    if (updated !== null) {
      taskSpan.textContent = updated;
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
      saveTasksToLocalStorage();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Delete this task?")) {
      li.remove();
      updateCounters();
      saveTasksToLocalStorage();
    }
  });
}

function addTask() {
  const task = inputBox.value.trim();
  if (!task) return alert("Task is empty.");
  createTaskElement(task);
  inputBox.value = "";
  updateCounters();
  saveTasksToLocalStorage();
}
