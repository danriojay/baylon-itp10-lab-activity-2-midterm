import { sampleTasks, generateTaskId } from "./data.js";

import {
  normalizeTaskText,
  calculateTaskCounts
} from "./utils.js";

import {
  createTaskElement,
  createTaskText,
  createEditInput,
  displayTaskCounts
} from "./display.js";

export { createTaskElement };

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const countElements = {
  totalCount,
  pendingCount,
  completedCount
};

export function addTask(taskText) {
  const trimmedText = normalizeTaskText(taskText);

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    taskInput.focus();
    return;
  }

  const taskItem = createTaskElement(
    trimmedText,
    generateTaskId()
  );

  taskList.appendChild(taskItem);

  taskInput.value = "";
  taskMessage.textContent = "";

  updateTaskCounts();
  taskInput.focus();
}

export function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");

  taskItem.dataset.state = isCompleted
    ? "completed"
    : "pending";

  taskItem.querySelector(".complete-btn").setAttribute(
    "aria-pressed",
    String(isCompleted)
  );

  updateTaskCounts();
}

export function beginTaskEdit(taskItem) {
  const taskTextSpan = taskItem.querySelector(".task-text");

  if (!taskTextSpan) {
    return;
  }

  const editInput = createEditInput(taskTextSpan.textContent);

  taskTextSpan.replaceWith(editInput);

  taskItem.querySelector(".edit-btn").textContent = "Save";
  taskMessage.textContent = "";

  editInput.focus();
  editInput.select();
}

export function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");

  if (!editInput) {
    return;
  }

  const trimmedText = normalizeTaskText(editInput.value);

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    editInput.focus();
    return;
  }

  const taskTextSpan = createTaskText(trimmedText);

  editInput.replaceWith(taskTextSpan);

  taskItem.querySelector(".edit-btn").textContent = "Edit";
  taskMessage.textContent = "";

  updateTaskCounts();
}

export function removeTask(taskItem) {
  taskItem.remove();
  taskMessage.textContent = "";
  updateTaskCounts();
}

export function updateTaskCounts() {
  const counts = calculateTaskCounts(taskList);
  displayTaskCounts(countElements, counts);
}

export function handleTaskListClick(event) {
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

export function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  sampleTasks.forEach((taskText) => {
    const taskItem = createTaskElement(
      taskText,
      generateTaskId()
    );

    fragment.appendChild(taskItem);
  });

  taskList.appendChild(fragment);

  taskMessage.textContent = "";
  updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => {
  addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskList.addEventListener("click", handleTaskListClick);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask(taskInput.value);
  }
});

updateTaskCounts();