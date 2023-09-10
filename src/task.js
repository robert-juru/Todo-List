import { format } from 'date-fns'
import uiModule from './ui.js';

const taskModule = (function () {
    const taskForm = document.getElementById('task-form');
    const taskList = [];
    const todayTasksContainer = document.getElementById('todayTasksContainer');
    const today = format(new Date(), 'dd-MM-yyyy');

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

    //Create visual task card 
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.classList.add('task-card');
        const formattedDueDate = format(new Date(task.dueDate), 'dd-MM-yyyy');

        card.innerHTML = `
          <h3>${task.title}</h3>
          <p>Description: ${task.description}</p>
          <p>Due Date: ${formattedDueDate}</p>
          <p>Priority: ${task.priority}</p>
          <p>Project: ${task.project}</p>
        `;
        allTasksContainer.appendChild(card);
        return card;
    }

    function displayTasksForToday() {
        //Filters tasks with due dates for today
        const todayTasks = taskList.filter(task => {
            const taskDate = format(new Date(task.dueDate), 'dd-MM-yyyy');
            return today === taskDate;
        });
        updateTodayTasksUI(todayTasks);
    }

    function updateTodayTasksUI(todayTasks) {
        todayTasksContainer.innerHTML = ''; // Clear previous tasks
        // Re-create the header
        uiModule.createMainHeader(todayTasksButton.textContent, todayTasksContainer);
        // Append the tasks
        todayTasks.forEach(task => {
            const taskCard = createTaskCard(task);
            todayTasksContainer.appendChild(taskCard);
        });
    }
    //Handle form submissions for creating new tasks
    function handleFormSubmit(event) {
        event.preventDefault();
        const task = extractTaskFromForm(); // Extract task data from the form    
        addTaskToList(task); // Add the task to the list
        updateTaskUI(task)
        taskForm.reset();
    }

    function addTaskToList(task) {
        // Add the task to the list
        taskList.push(task);
    }
    function extractTaskFromForm() {
        // Extract task data from the form elements
        const title = taskForm.querySelector('#title').value;
        const description = taskForm.querySelector('#description').value;
        const dueDate = taskForm.querySelector('#due-date').value;
        const priority = taskForm.querySelector('#priority').value;
        const project = taskForm.querySelector('#project').value;

        return createTask(title, description, dueDate, priority, project);
    }

    function updateTaskUI(task) {
        createTaskCard(task); // Create the visual task card
        // Check if the new task's due date is today
        const formattedDueDate = format(new Date(task.dueDate), 'dd-MM-yyyy');
        if (formattedDueDate === today) {
            displayTasksForToday(); // Update today's tasks in the UI
        }
    }
    return { createTask, createTaskCard, handleFormSubmit, displayTasksForToday }
})()
export default taskModule;