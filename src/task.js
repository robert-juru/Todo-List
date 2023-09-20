import { format } from 'date-fns'
import uiModule from './ui.js';
import projectModule from './project.js';

const taskModule = (function () {
    const taskForm = document.getElementById('task-form');
    const taskList = [];
    const allTasksContainer = document.getElementById('allTasksContainer');
    const todayTasksContainer = document.getElementById('todayTasksContainer');
    const importantTasksContainer = document.getElementById('importantTasksContainer');
    const today = format(new Date(), "MMM d, yyyy");

    //Create a task object 
    function createTask(title, description, dueDate, priority, project) {
        const task = {
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority,
            project: project,
        };
        return task;
    }


    function stylizeTaskCardByPriority(taskCard, priority) {
        if (priority === 'important')
            taskCard.style.borderLeft = '5px solid #FF0000';
        else
            taskCard.style.borderLeft = '5px solid #2ABD67';
    }

    //Create visual task card 
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.classList.add('task-card');
        const formattedDueDate = format(new Date(task.dueDate), "MMM d, yyyy");

        card.innerHTML = `
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
        <p>${formattedDueDate}</p>
        <ion-icon name="create-outline"></ion-icon>
        <ion-icon name="trash-outline"></ion-icon>
    </div>
        `;
        stylizeTaskCardByPriority(card, task.priority);
        return card;
    }

    function extractTaskFromForm() {
        // Extract task data from the form elements
        const title = taskForm.querySelector('#title').value;
        const description = taskForm.querySelector('#description').value;
        const dueDate = taskForm.querySelector('#due-date').value;
        const priority = taskForm.querySelector('#priority').value;
        const project = taskForm.querySelector('#project-selector').value;

        return createTask(title, description, dueDate, priority, project);
    }

    function displayTasksForToday() {
        //Filters tasks with due dates for today
        const todayTasks = taskList.filter(task => {
            const taskDate = format(new Date(task.dueDate), "MMM d, yyyy");
            return today === taskDate;
        });
        updateTodayTasksUI(todayTasks);
    }

    function updateTodayTasksUI(todayTasks) {
        todayTasksContainer.innerHTML = ''; // Clear previous tasks
        // Re-create the header
        uiModule.createMainHeader(todayTasksButton.textContent, todayTasksContainer);
        // Append the today's tasks
        todayTasks.forEach(task => {
            const taskCard = createTaskCard(task);
            todayTasksContainer.appendChild(taskCard);
        });
    }
    // Filter tasks based on priority
    function filterTasksByPriority(tasks, priority) {
        return tasks.filter(task => task.priority === priority);
    }

    // Display tasks in the "Important" section
    function displayImportantTasks() {
        importantTasksContainer.innerHTML = ''; // Clear previous tasks
        // Re-create the header
        uiModule.createMainHeader(importantTasksButton.textContent, importantTasksContainer);
        //Append the important tasks
        const importantTasks = filterTasksByPriority(taskList, 'important');
        importantTasks.forEach(task => {
            const taskCard = createTaskCard(task);
            importantTasksContainer.appendChild(taskCard);
        });
    }

    //Handle form submissions for creating new tasks
    function handleFormSubmit(event) {
        event.preventDefault();
        const task = extractTaskFromForm(); // Extract task data from the form 
        addTaskToList(task); // Add the task to the list
        updateTaskUI(task) // Create the visual task card
        taskForm.reset(); //Reset the form
        uiModule.toggleTaskModal(); // Close the modal
        projectModule.addTaskToProjectContainer(task);
    }
    function updateTaskUI(task) {
        let card = createTaskCard(task); // Create the visual task card
        allTasksContainer.appendChild(card); // Append the visual task card to All Tasks
        // Check if the new task's due date is today
        const formattedDueDate = format(new Date(task.dueDate), "MMM d, yyyy");
        if (formattedDueDate === today) {
            displayTasksForToday(); // Update today's tasks in the UI
        }
        //Check if the new task's priority is important
        if (task.priority === 'important') {
            displayImportantTasks(); // Update important tasks in the UI
        }
    }
    function addTaskToList(task) {
        // Add the task to the list
        taskList.push(task);
    }

    return { createTask, createTaskCard, handleFormSubmit, displayTasksForToday, displayImportantTasks }
})()
export default taskModule;