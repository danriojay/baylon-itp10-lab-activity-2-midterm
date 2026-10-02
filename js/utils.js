export function normalizeTaskText(taskText) {
  return String(taskText ?? "").trim();
}

export function calculateTaskCounts(taskList) {
  const tasks = Array.from(
    taskList.querySelectorAll(".task-item")
  );

  return {
    total: tasks.length,
    pending: tasks.filter(
      (task) => task.dataset.state === "pending"
    ).length,
    completed: tasks.filter(
      (task) => task.dataset.state === "completed"
    ).length
  };
}