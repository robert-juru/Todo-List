import './style.css';
import uiModule from './ui.js'
import projectModule from './project.js'

// Get references to elements
const menuButton = document.getElementById('menu-svg-button');
const asideNav = document.querySelector('aside');
const navButtons = document.querySelectorAll('.nav-btn');
const createTaskBtn = document.getElementById('create-task-button');
const taskModal = document.getElementById('task-modal');
const closeModalBtn = document.getElementById('close-modal');
const taskForm = document.getElementById('task-form');
const main = document.querySelector('main');
const allTasksContainer = document.getElementById('allTasksContainer');
const projectsList = document.querySelector('.projects-list');
const createProjectBtn = document.getElementById('create-project-btn');
const newProjectContainer = document.querySelector('.new-project-container');
const cancelNewProjectBtn = document.querySelector('.cancel-new-project-btn');
const addNewProjectBtn = document.querySelector('.add-new-project-btn');
const taskList = [];
let lastSelectedButton = null;

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

function createTaskCard(task) {
    const card = document.createElement('div');
    card.classList.add('task-card');

    card.innerHTML = `
      <h3>${task.title}</h3>
      <p>Description: ${task.description}</p>
      <p>Due Date: ${task.dueDate}</p>
      <p>Priority: ${task.priority}</p>
      <p>Project: ${task.project}</p>
    `;
    allTasksContainer.appendChild(card);
}

export function handleFormSubmit(event) {
    event.preventDefault();
    // Accessing form elements
    const title = taskForm.querySelector('#title').value;
    const description = taskForm.querySelector('#description').value;
    const dueDate = taskForm.querySelector('#due-date').value;
    const priority = taskForm.querySelector('#priority').value;
    const project = taskForm.querySelector('#project').value;

    const task = createTask(title, description, dueDate, priority, project);
    taskList.push(task);
    console.log(taskList)
    createTaskCard(task);
    taskForm.reset();
}

createProjectBtn.addEventListener('click', () => {
    projectModule.showNewProjectContainer();
});

cancelNewProjectBtn.addEventListener('click', () => {
    projectModule.hideNewProjectContainer();
});

addNewProjectBtn.addEventListener('click', () => {
    projectModule.addNewProject();
});

uiModule.initBtnListeners();


