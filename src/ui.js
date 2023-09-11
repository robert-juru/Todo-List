const uiModule = (function () {
    //Get references to buttons and containers
    const allTasksContainer = document.getElementById('allTasksContainer');
    const importantTasksContainer = document.getElementById('importantTasksContainer');
    const todayTasksContainer = document.getElementById('todayTasksContainer');
    const allTasksButton = document.getElementById('allTasksButton');
    const importantTasksButton = document.getElementById('importantTasksButton');
    const todayTasksButton = document.getElementById('todayTasksButton');
    const projectsList = document.querySelector('.projects-list');
    const menuButton = document.getElementById('menu-svg-button');
    const asideNav = document.querySelector('aside');
    const navButtons = document.querySelectorAll('.nav-btn');
    const createTaskBtn = document.getElementById('create-task-button');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal');
    let lastSelectedButton = null;

    function initBtnListeners() {
        // Event listener for menu button
        menuButton.addEventListener('click', () => {
            asideNav.classList.toggle('show-aside');
        });
        // Initialize highlighting for navigation buttons
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                highlightSelectedButton(button);
            });
        });
        // Initialize highlighting for dynamically added projects
        projectsList.addEventListener('click', (event) => {
            const clickedProject = event.target;
            highlightSelectedButton(clickedProject);
        });

        // Display the specific task section 
        allTasksButton.addEventListener('click', () => {
            toggleTaskSection('allTasks')
        }
        );
        todayTasksButton.addEventListener('click', () => {
            toggleTaskSection('todayTasks')
        }
        );
        importantTasksButton.addEventListener('click', () => {
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
    return { initBtnListeners, createMainHeader, toggleTaskModal };
})()
export default uiModule;


