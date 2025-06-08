const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('lists');
const completedCounter = document.getElementById("completed-count");
const uncompletedCounter = document.getElementById("uncompleted-count");
const folderGrid = document.getElementById("folder-grid");
const folderTitle = document.getElementById("folder-title");

let currentFolder = null;

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

  const noFoldersMsg = document.getElementById("no-folders-msg");

  if (folders.length === 0) {
    noFoldersMsg.style.display = "block";
  } else {
    noFoldersMsg.style.display = "none";
    folders.forEach(folder => {
      const div = document.createElement("div");
      div.className = "folder-card";

      const folderNameSpan = document.createElement("span");
      folderNameSpan.textContent = folder;
      folderNameSpan.style.cursor = "pointer";
      folderNameSpan.onclick = () => openFolder(folder);
      div.appendChild(folderNameSpan);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.backgroundColor = "#e84545";
      deleteBtn.style.color = "white";
      deleteBtn.style.border = "none";
      deleteBtn.style.borderRadius = "3px";
      deleteBtn.style.padding = "2px 6px";
      deleteBtn.style.fontSize = "12px";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.height = "22px";

      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Delete folder "${folder}"? This will delete all its tasks.`)) {
          deleteFolder(folder);
        }
      };
      div.appendChild(deleteBtn);

      folderGrid.appendChild(div);
    });
  }
}
function addTask() {
  const taskText = inputBox.value.trim();
  if (!taskText || !currentFolder) return;

  createTaskElement(taskText, false);
  inputBox.value = "";
  updateCounters();
  saveTasksToLocalStorage();
}

function deleteFolder(folderName) {
  let folders = JSON.parse(localStorage.getItem("folders") || "[]");
  folders = folders.filter(f => f !== folderName);
  localStorage.setItem("folders", JSON.stringify(folders));

  const allData = JSON.parse(localStorage.getItem("todo-data") || "{}");
  if (allData[folderName]) {
    delete allData[folderName];
    localStorage.setItem("todo-data", JSON.stringify(allData));
  }

  loadFolderCards();

  if (currentFolder === folderName) {
    goBackToFolders();
  }
}function createTaskElement(taskText, isCompleted = false) {
  const li = document.createElement("li");
  li.className = isCompleted ? "completed" : "";

  li.innerHTML = `
    <div class="task-content">
      <input type="checkbox" class="task-checkbox" ${isCompleted ? "checked" : ""}>
      <span class="task-text">${taskText}</span>
    </div>
    <div class="task-actions">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  listContainer.appendChild(li);

  const checkbox = li.querySelector(".task-checkbox");
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasksToLocalStorage();
  });

  li.querySelector(".edit-btn").onclick = () => {
    const updated = prompt("Edit your task", taskText);
    if (updated !== null) {
      li.querySelector(".task-text").textContent = updated;
      saveTasksToLocalStorage();
    }
  };

  li.querySelector(".delete-btn").onclick = () => {
    li.remove();
    updateCounters();
    saveTasksToLocalStorage();
  };
}


function saveTasksToLocalStorage() {
  const items = listContainer.querySelectorAll("li");
  const tasks = Array.from(items).map(li => {
    const checkbox = li.querySelector("input");
    const span = li.querySelector("label span");
    return {
      text: span.textContent,
      completed: checkbox.checked
    };
  });

  const allData = JSON.parse(localStorage.getItem("todo-data") || "{}");
  allData[currentFolder] = tasks;
  localStorage.setItem("todo-data", JSON.stringify(allData));
}

function loadTasks() {
  listContainer.innerHTML = "";
  const allData = JSON.parse(localStorage.getItem("todo-data") || "{}");
  const tasks = allData[currentFolder] || [];

  tasks.forEach(task => createTaskElement(task.text, task.completed));
  updateCounters();
}

function updateCounters() {
  const tasks = listContainer.querySelectorAll("li");
  let completed = 0;
  tasks.forEach(task => {
    if (task.querySelector("input").checked) completed++;
  });
  completedCounter.textContent = completed;
  uncompletedCounter.textContent = tasks.length - completed;
}

// Task functions: loadTasks, saveTasksToLocalStorage, updateCounters, createTaskElement, addTask
// (keep your existing code unchanged here)
