import './style.css';
import uiModule from './ui.js'
import projectModule from './project.js'
import taskModule from './task.js'

// Get references to elements
const taskForm = document.getElementById('task-form');
const createProjectBtn = document.getElementById('create-project-btn');
const cancelNewProjectBtn = document.querySelector('.cancel-new-project-btn');
const addNewProjectBtn = document.querySelector('.add-new-project-btn');

// Event listeners for showing, hiding and adding a new project
createProjectBtn.addEventListener('click', () => {
    projectModule.showNewProjectContainer();
});

cancelNewProjectBtn.addEventListener('click', () => {
    projectModule.hideNewProjectContainer();
});

addNewProjectBtn.addEventListener('click', () => {
    projectModule.addNewProject();
    projectModule.populateProjectSelector();
});

//Event listener for task form submission
taskForm.addEventListener('submit', taskModule.handleFormSubmit);
// document.addEventListener('DOMContentLoaded', projectModule.populateProjectSelector)


uiModule.initBtnListeners();


