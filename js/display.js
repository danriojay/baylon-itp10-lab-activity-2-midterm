import { buttonDefinitions } from "./data.js";

export function createTaskText(taskText) {
  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = taskText;
  return span;
}

export function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  taskItem.appendChild(createTaskText(taskText));

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

export function createEditInput(taskText) {
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-input");
  input.value = taskText;
  input.setAttribute("aria-label", "Edit task");
  input.setAttribute("aria-describedby", "taskMessage");
  return input;
}

export function displayTaskCounts(elements, counts) {
  const { totalCount, pendingCount, completedCount } = elements;
  const { total, pending, completed } = counts;

  totalCount.textContent = String(total);
  pendingCount.textContent = String(pending);
  completedCount.textContent = String(completed);
}