export const sampleTasks = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

export const buttonDefinitions = [
  { className: "complete-btn", label: "Complete" },
  { className: "edit-btn", label: "Edit" },
  { className: "remove-btn", label: "Remove" }
];

let nextTaskId = 1;

export function generateTaskId() {
  return `task-${nextTaskId++}`;
}