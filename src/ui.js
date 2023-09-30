import projectModule from "./project.js";
import taskModule from "./task.js";
import { format } from 'date-fns';

const uiModule = (function () {
    //Get references to buttons and containers
    const allTasksContainer = document.getElementById('allTasksContainer');
    const importantTasksContainer = document.getElementById('importantTasksContainer');
    const todayTasksContainer = document.getElementById('todayTasksContainer');
    const allTasksButton = document.getElementById('allTasksButton');
    const importantTasksButton = document.getElementById('importantTasksButton');
    const todayTasksButton = document.getElementById('todayTasksButton');
    const projectsContainer = document.querySelector('.projects-container');
    const menuButton = document.getElementById('menu-svg-button');
    const homeButton = document.getElementById('home-svg-button');
    const asideNav = document.querySelector('aside');
    const navButtons = document.querySelectorAll('.nav-btn');
    const createTaskBtn = document.getElementById('create-task-button');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const mainSection = document.querySelector('main');

    let lastSelectedButton = null;

    function initBtnListeners() {
        homeButton.addEventListener('click', () => {
            toggleTaskSection('allTasks')
            highlightSelectedButton(allTasksButton)
        })
        // Event listener for menu button
        menuButton.addEventListener('click', () => {
            asideNav.classList.toggle('show-aside');
        });
        // Initialize highlighting for navigation buttons
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                highlightSelectedButton(button);
                taskModule.renderAllSections();
            });
        });

        function createEditableDateElement(target, initialText, task) {
            const inputElement = document.createElement('input');
            inputElement.type = 'date';
            inputElement.value = format(new Date(initialText), "yyyy-MM-dd");

            inputElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    const editedDate = new Date(inputElement.value);
                    target.textContent = format(editedDate, "MMM d, yyyy");
                    task.dueDate = editedDate.toISOString(); // Update the task's dueDate property
                    inputElement.remove();
                    taskModule.displayTasksForToday();
                }
            });
            target.innerHTML = '';
            target.appendChild(inputElement);
            inputElement.focus();
        }

        function createEditableElement(container, initialValue, callback) {
            if (container.querySelector('.edit-task-input')) {
                return;
            }

            const textContentSpan = document.createElement('span');
            textContentSpan.textContent = initialValue;
            textContentSpan.classList.add('editable-text');
            container.innerHTML = ''; // Clear the container
            container.appendChild(textContentSpan);

            textContentSpan.addEventListener('mouseover', () => {
                textContentSpan.style.cursor = 'pointer';
            });

            textContentSpan.addEventListener('mouseout', () => {
                textContentSpan.style.cursor = 'auto';
            });

            textContentSpan.addEventListener('click', (e) => {
                // e.stopPropagation(); // Prevent the click event from bubbling up to the container
                let inputElement = document.createElement('input');
                inputElement.classList.add('edit-task-input');
                inputElement.value = textContentSpan.textContent;
                inputElement.addEventListener('blur', () => {
                    const editedValue = inputElement.value;
                    // Update the displayed content with the new value
                    if (editedValue !== "") {
                        textContentSpan.textContent = editedValue;
                    }
                    container.innerHTML = '';
                    container.appendChild(textContentSpan);
                    inputElement.remove();
                    if (typeof callback === 'function') {
                        callback(editedValue);
                    }
                });
                container.innerHTML = '';
                container.appendChild(inputElement);
                inputElement.focus();
            });
        }

        mainSection.addEventListener('click', function (event) {
            const target = event.target;
            const taskCard = target.closest('.task-card');
            if (taskCard) {
                const taskId = taskCard.getAttribute('data-task-id');
                const task = taskModule.taskList.find(task => task.id == taskId);
                if (task) {
                    if (target.classList.contains('task-name')) {
                        const taskName = target.closest('.task-card').querySelector('.task-name');
                        createEditableElement(taskName, taskName.textContent, (editedValue) => {
                            if (editedValue !== "") {
                                taskName.textContent = editedValue;
                                task.title = editedValue;
                            }
                            taskName.addEventListener('mouseover', () => {
                                taskName.style.cursor = 'pointer';
                            });
                        });
                    } else if (target.id === 'task-description') {
                        const taskDescription = target.closest('.task-card').querySelector('#task-description');
                        createEditableElement(taskDescription, taskDescription.textContent, (editedValue) => {
                            if (editedValue !== "") {
                                taskDescription.textContent = editedValue;
                                task.description = editedValue;
                            }
                        });
                    }
                    else if (target.id === 'task-due-date') {
                        const taskDueDate = target.closest('.task-card').querySelector('#task-due-date');
                        createEditableDateElement(taskDueDate, taskDueDate.textContent, task);
                    }
                }
            }
        });

        // When a checkbox is changed, toggle the text decoration & color for the taskCard.
        mainSection.addEventListener('change', function (event) {
            const target = event.target;
            if (target.classList.contains('task-status-checkbox')) {
                const taskName = target.closest('.task-card').querySelector('.task-name');
                const taskCard = target.closest('.task-card');
                if (target.checked) {
                    taskName.style.textDecoration = 'line-through';
                    taskCard.style.color = '#696969';
                } else {
                    taskName.style.textDecoration = 'none';
                    taskCard.style.color = 'black';
                }
            }
        });

        // Initialize highlighting for dynamically added projects & display project page
        projectsContainer.addEventListener('click', (event) => {
            const clickedProject = event.target.closest('.nav-btn.project');
            if (clickedProject) {
                const projectName = clickedProject.getAttribute('id');
                highlightSelectedButton(clickedProject);
                hidePages();
                projectModule.showProjectContainer(projectName);
                taskModule.renderAllSections();
            }
        });
        // Display the specific task section 
        allTasksButton.addEventListener('click', () => {
            hidePages();
            toggleTaskSection('allTasks')

        }
        );
        todayTasksButton.addEventListener('click', () => {
            hidePages();
            toggleTaskSection('todayTasks')
        }
        );
        importantTasksButton.addEventListener('click', () => {
            hidePages();
            toggleTaskSection('importantTasks')
        }
        );

        //Event listeners for the task modal
        createTaskBtn.addEventListener('click', () => {
            toggleTaskModal();
        });

        closeModalBtn.addEventListener('click', () => {
            toggleTaskModal();
        });
        document.addEventListener('click', (event) => {
            if (event.target === taskModal) {
                toggleTaskModal();
            }
        });
        document.addEventListener('click', function (event) {
            if (event.target && event.target.id === 'delete-project-btn') {
                projectModule.deleteProject(event);
            }
        });
        // Initialize the task pages with their respective header
        document.addEventListener('DOMContentLoaded', initializePage);
    }

    function createMainHeader(textContent, container) {
        const mainHeader = document.createElement('h2');
        mainHeader.textContent = textContent;
        if (container.textContent === '') {
            container.appendChild(mainHeader);
        }
    }

    function initializePage() {
        createMainHeader(allTasksButton.textContent, allTasksContainer);
        createMainHeader(todayTasksButton.textContent, todayTasksContainer);
        createMainHeader(importantTasksButton.textContent, importantTasksContainer);
        highlightSelectedButton(allTasksButton)
    }

    function highlightSelectedButton(button) {
        if (lastSelectedButton) {
            lastSelectedButton.classList.remove('button-selected');
        }
        button.classList.add('button-selected');
        lastSelectedButton = button;
    }

    function toggleTaskModal() {
        if (taskModal.style.display === 'none' || taskModal.style.display === '') {
            taskModal.style.display = 'block';
        } else {
            taskModal.style.display = 'none';
        }
    }

    function toggleTaskSection(section) {
        allTasksContainer.style.display = section === 'allTasks' ? 'block' : "none";
        importantTasksContainer.style.display = section === 'importantTasks' ? 'block' : "none";
        todayTasksContainer.style.display = section === 'todayTasks' ? 'block' : "none";
    }

    function hidePages() {
        const projectPageContainers = document.querySelectorAll('.project-page-container');
        const taskPageContainer = document.querySelectorAll('.task-container');
        taskPageContainer.forEach(container => {
            container.style.display = 'none';
        });
        projectPageContainers.forEach(container => {
            container.style.display = 'none';
        });
    }

    return { initBtnListeners, createMainHeader, toggleTaskModal, toggleTaskSection, hidePages };
})()
export default uiModule;


