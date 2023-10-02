import { format } from "date-fns";
import uiModule from "./ui.js";
import projectModule from "./project.js";

const taskModule = (function () {
  const taskForm = document.getElementById("task-form");
  const allTasksContainer = document.getElementById("allTasksContainer");
  const todayTasksContainer = document.getElementById("todayTasksContainer");
  const importantTasksContainer = document.getElementById(
    "importantTasksContainer"
  );
  const today = format(new Date(), "MMM d, yyyy");
  const taskList = [];
  let taskIdCounter = 0;

  //Create a task object
  function createTask(title, description, dueDate, priority, project) {
    const task = {
      id: taskIdCounter++,
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      project: project,
    };
    return task;
  }

  //Create visual task card
  function createTaskCard(task) {
    const card = document.createElement("div");
    card.classList.add("task-card");
    card.setAttribute("data-task-id", task.id);
    const formattedDueDate = format(new Date(task.dueDate), "MMM d, yyyy");

    card.innerHTML = `
        <div id="task-priority-toggle"></div>
        <input
        type="checkbox"
        class="task-status-checkbox"
        id="taskCheckbox"
    />
    <div class="task-summary">
        <h3 class="task-name">${task.title}</h3>
        <p id="task-description">${task.description}</p>
    </div>
    <div class="task-actions">
        <p id="task-due-date" class="editable-date">${formattedDueDate}</p>
        <ion-icon id="delete-task-btn" name="trash-outline"></ion-icon>
    </div>
        `;
    const priorityToggle = card.querySelector("#task-priority-toggle");
    priorityToggle.addEventListener("click", () => {
      toggleTaskPriority(task);
      updatePriorityToggleVisual(priorityToggle, task.priority);
    });
    // Initialize the visual state of the priority toggle
    updatePriorityToggleVisual(priorityToggle, task.priority);
    return card;
  }

  function extractTaskFromForm() {
    // Extract task data from the form elements
    const title = taskForm.querySelector("#title").value;
    const description = taskForm.querySelector("#description").value;
    const dueDate = taskForm.querySelector("#due-date").value;
    const priority = taskForm.querySelector("#priority").value;
    const project = taskForm.querySelector("#project-selector").value;

    return createTask(title, description, dueDate, priority, project);
  }

  function clearTasksInSection(section) {
    const taskCards = section.querySelectorAll(".task-card");
    taskCards.forEach((taskCard) => {
      section.removeChild(taskCard);
    });
  }

  function renderAllSections() {
    // Clear the content of the sections
    clearTasksInSection(allTasksContainer);
    clearTasksInSection(todayTasksContainer);
    clearTasksInSection(importantTasksContainer);
    // Loop through the taskList and create task cards for each task
    taskList.forEach((task) => {
      updateTaskUI(task, allTasksContainer);
      updateTaskUI(task, todayTasksContainer);
      updateTaskUI(task, importantTasksContainer);
    });
  }

  function filterTasksForToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskList.filter((task) => {
      const taskDueDate = new Date(task.dueDate);
      taskDueDate.setHours(0, 0, 0, 0);
      return today.getTime() === taskDueDate.getTime();
    });
  }

  function displayTasksForToday() {
    const todayTasks = filterTasksForToday();
    updateTodayTasksUI(todayTasks);
  }

  function toggleTaskPriority(task) {
    if (task.priority === "important") {
      task.priority = "not-important";
    } else {
      task.priority = "important";
    }
    //Re-render all sections to reflect the change
    renderAllSections();
  }

  function updatePriorityToggleVisual(priorityToggle, priority) {
    priorityToggle.style.backgroundColor =
      priority === "important" ? "#FF0000" : "#2ABD67";
  }

  function updateTodayTasksUI(todayTasks) {
    todayTasksContainer.innerHTML = ""; // Clear previous tasks
    // Re-create the header
    uiModule.createMainHeader(
      todayTasksButton.textContent,
      todayTasksContainer
    );
    // Append the today's tasks
    todayTasks.forEach((task) => {
      const taskCard = createTaskCard(task);
      todayTasksContainer.appendChild(taskCard);
    });
  }
  // Filter tasks based on priority
  function filterTasksByPriority(tasks, priority) {
    return tasks.filter((task) => task.priority === priority);
  }

  // Display tasks in the "Important" section
  function displayImportantTasks() {
    importantTasksContainer.innerHTML = ""; // Clear previous tasks
    // Re-create the header
    uiModule.createMainHeader(
      importantTasksButton.textContent,
      importantTasksContainer
    );
    //Append the important tasks
    const importantTasks = filterTasksByPriority(taskList, "important");
    importantTasks.forEach((task) => {
      const taskCard = createTaskCard(task);
      importantTasksContainer.appendChild(taskCard);
    });
  }

  function updateTaskUI(task, container) {
    let card = createTaskCard(task); // Create the visual task card
    container.appendChild(card);
    // Check if the new task's due date is today
    const formattedDueDate = format(new Date(task.dueDate), "MMM d, yyyy");
    if (formattedDueDate === today) {
      displayTasksForToday(); // Update today's tasks in the UI
    }
    //Check if the new task's priority is important
    if (task.priority === "important") {
      displayImportantTasks(); // Update important tasks in the UI
      //If it's not important anymore, remove it from the "Important" section
    } else if (task.priority === "not-important") {
      const importantTasks =
        importantTasksContainer.querySelectorAll(".task-card");
      importantTasks.forEach((taskCard) => {
        if (taskCard.getAttribute("data-task-id") === task.id.toString()) {
          importantTasksContainer.removeChild(taskCard);
        }
      });
    }
    //Update the task UI for the project section
    if (task.project !== "all-tasks") {
      projectModule.addTaskToProjectContainer(task);
    }
  }

  function addTaskToList(task) {
    taskList.push(task);
  }

  function deleteTask(event) {
    const deleteTaskIcon = event.target;
    const taskToDelete = deleteTaskIcon.closest(".task-card");
    const taskCardId = taskToDelete.getAttribute("data-task-id");
    // Find the task in the taskList
    const taskIndex = taskList.findIndex(
      (task) => task.id.toString() === taskCardId
    );

    if (taskToDelete && taskIndex !== -1) {
      //Capture task information
      const task = taskList[taskIndex];
      // Remove the task from the DOM
      taskToDelete.remove();
      // Remove the task from the taskList
      taskList.splice(taskIndex, 1);
      // Remove the task from the project container
      if (task.project !== "all-tasks") {
        const projectContainer = document.getElementById(
          task.project + "-page-container"
        );
        if (projectContainer) {
          const taskInProject = projectContainer.querySelector(
            `[data-task-id="${taskCardId}"]`
          );
          if (taskInProject) {
            taskInProject.remove();
          }
        }
      }
    }
  }

  //Handle form submissions for creating new tasks
  function handleFormSubmit(event) {
    event.preventDefault();
    const task = extractTaskFromForm(); // Extract task data from the form
    addTaskToList(task); // Add the task to the list
    updateTaskUI(task, allTasksContainer); // Create the visual task card
    taskForm.reset(); //Reset the form
    uiModule.toggleTaskModal(); // Close the modal
  }

  return {
    createTask,
    createTaskCard,
    handleFormSubmit,
    displayTasksForToday,
    displayImportantTasks,
    taskList,
    renderAllSections,
    toggleTaskPriority,
    deleteTask,
  };
})();
export default taskModule;
