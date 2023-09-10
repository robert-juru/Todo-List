const projectModule = (function () {
    //References to buttons and containers
    const newProjectContainer = document.querySelector('.new-project-container');
    const projectsList = document.querySelector('.projects-list');
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
        const projectNameSpan = document.createElement('span');
        projectNameSpan.textContent = projectName;

        project.classList.add('nav-btn', 'project');
        project.appendChild(createProjectIcon());
        project.appendChild(projectNameSpan);

        return project;
    }
    // Add a new project to the projects list
    function addNewProject() {
        const newProjectInput = document.getElementById('new-project');
        const projectName = newProjectInput.value;

        if (projectName) {
            const project = createProjectElement(projectName);
            projectsList.appendChild(project);
            newProjectInput.value = ''; // input reset
            newProjectContainer.style.display = 'none';
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
    
    return { addNewProject, showNewProjectContainer, hideNewProjectContainer }
})()
export default projectModule;