"use strict";

// Store the required DOM elements.
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let nextTaskId = 1;

function generateTaskId() {
  return `task-${nextTaskId++}`;
}

// Create a task without attaching it to the live list.
function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");
  taskTextSpan.textContent = taskText;

  taskItem.appendChild(taskTextSpan);

  const buttonDefinitions = [
    { className: "complete-btn", label: "Complete" },
    { className: "edit-btn", label: "Edit" },
    { className: "remove-btn", label: "Remove" }
  ];

  buttonDefinitions.forEach(({ className, label }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(className);
    button.textContent = label;

    if (className === "complete-btn") {
      button.setAttribute("aria-pressed", "false");
    }

    taskItem.appendChild(button);
  });

  return taskItem;
}

function addTask(taskText) {
  const trimmedText = taskText.trim();

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    taskInput.focus();
    return;
  }

  const taskItem = createTaskElement(trimmedText, generateTaskId());
  taskList.appendChild(taskItem);

  taskInput.value = "";
  taskMessage.textContent = "";

  updateTaskCounts();
  taskInput.focus();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");

  taskItem.dataset.state = isCompleted ? "completed" : "pending";

  const completeButton = taskItem.querySelector(".complete-btn");
  completeButton.setAttribute("aria-pressed", String(isCompleted));

  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const taskTextSpan = taskItem.querySelector(".task-text");

  if (!taskTextSpan) {
    return;
  }

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");

  // An input uses value to display editable text safely.
  editInput.value = taskTextSpan.textContent;
  editInput.setAttribute("aria-label", "Edit task");
  editInput.setAttribute("aria-describedby", "taskMessage");

  taskTextSpan.replaceWith(editInput);

  taskItem.querySelector(".edit-btn").textContent = "Save";
  taskMessage.textContent = "";

  editInput.focus();
  editInput.select();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");

  if (!editInput) {
    return;
  }

  const trimmedText = editInput.value.trim();

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    editInput.focus();
    return;
  }

  const taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");
  taskTextSpan.textContent = trimmedText;

  editInput.replaceWith(taskTextSpan);

  taskItem.querySelector(".edit-btn").textContent = "Edit";
  taskMessage.textContent = "";

  updateTaskCounts();
}

function removeTask(taskItem) {
  taskItem.remove();
  taskMessage.textContent = "";
  updateTaskCounts();
}

function updateTaskCounts() {
  const taskItems = Array.from(
    taskList.querySelectorAll(".task-item")
  );

  const pending = taskItems.filter(
    (taskItem) => taskItem.dataset.state === "pending"
  ).length;

  const completed = taskItems.filter(
    (taskItem) => taskItem.dataset.state === "completed"
  ).length;

  totalCount.textContent = String(taskItems.length);
  pendingCount.textContent = String(pending);
  completedCount.textContent = String(completed);
}

// One delegated handler manages all dynamic task buttons.
function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (!event.target.matches(
    ".complete-btn, .edit-btn, .remove-btn"
  )) {
    return;
  }

  const taskItem = event.target.closest(".task-item");

  if (!taskItem || !taskList.contains(taskItem)) {
    return;
  }

  if (event.target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (event.target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (event.target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const sampleTasks = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();

  sampleTasks.forEach((taskText) => {
    const taskItem = createTaskElement(taskText, generateTaskId());
    fragment.appendChild(taskItem);
  });

  // Insert all three tasks into the live list in one operation.
  taskList.appendChild(fragment);

  taskMessage.textContent = "";
  updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => {
  addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

// Exactly one click listener on the task list.
taskList.addEventListener("click", handleTaskListClick);

// Allow Enter to add a task.
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask(taskInput.value);
  }
});

// Start with an empty list and counts calculated from the DOM.
updateTaskCounts();