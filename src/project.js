const projectModule = (function () {
    //References to buttons and containers
    const newProjectContainer = document.querySelector('.new-project-container');
    const projectsContainer = document.querySelector('.projects-container');
    const projectItems = projectsContainer.querySelectorAll('.nav-btn.project');
    const projectSelector = document.getElementById('project-selector');
    const newProjectInput = document.getElementById('new-project');

    // Create and return an ion-icon element
    function createProjectIcon() {
        let projectIcon = document.createElement('ion-icon')
        projectIcon.setAttribute('name', 'menu-outline')
        projectIcon.setAttribute('size', 'small')
        return projectIcon;
    }
    // Create a project element and return it
    function createProjectElement(projectName) {
        const project = document.createElement('div');
        project.appendChild(createProjectIcon());
        project.innerHTML += projectName;
        project.classList.add('nav-btn', 'project');
        return project;
    }
    // Add a new project to the projects list
    function addNewProject() {
        const projectName = newProjectInput.value;

        if (projectName) {
            const project = createProjectElement(projectName);
            projectsContainer.appendChild(project);
            newProjectInput.value = ''; // input reset
            newProjectContainer.style.display = 'none';
            console.log(projectItems)
        }
    }
    // Display the new project input container
    function showNewProjectContainer() {
        newProjectContainer.style.display = 'block';
    }
    // Hide the new project input container and reset the input
    function hideNewProjectContainer() {
        const newProjectInput = document.getElementById('new-project');
        newProjectInput.value = ''; // input reset
        newProjectContainer.style.display = 'none';
    }
    // Add projects to the task modal project selector
    function populateProjectSelector() {
        // Clear only dynamically added options
        while (projectSelector.lastChild && projectSelector.lastChild.value !== 'all-tasks') {
            projectSelector.removeChild(projectSelector.lastChild);
        }
        const projectItems = projectsContainer.querySelectorAll('.nav-btn.project');

       // Append the project items to the project selector
        projectItems.forEach(projectItem => {
            const option = document.createElement('option');
            option.value = projectItem.textContent;
            option.textContent = option.value;
            projectSelector.appendChild(option);
        })
    }
    return { addNewProject, showNewProjectContainer, hideNewProjectContainer, populateProjectSelector }
})()
export default projectModule;