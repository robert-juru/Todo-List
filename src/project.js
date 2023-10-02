import uiModule from "./ui.js";
import taskModule from "./task.js";

const projectModule = (function () {
    //References to buttons and containers
    const newProjectContainer = document.querySelector(".new-project-container");
    const projectsContainer = document.querySelector(".projects-container");
    const projectSectionContainer = document.querySelector(
        ".projects-section-container"
    );
    const projectSelector = document.getElementById("project-selector");
    const newProjectInput = document.getElementById("new-project");
    const mainSection = document.querySelector("main");
    const alertMessage = createAlertMessage(
        "Project name is not valid. Please choose a different name."
    );
    let projectList = [];
    const createdProjectNames = [];

    // Create and return an ion-icon element
    function createProjectIcon() {
        let projectIcon = document.createElement("ion-icon");
        projectIcon.setAttribute("name", "menu-outline");
        projectIcon.setAttribute("size", "small");
        projectIcon.setAttribute("id", "menu-project-icon");
        return projectIcon;
    }

    function createDeleteProjectIcon() {
        let deleteProjectIcon = document.createElement("ion-icon");
        deleteProjectIcon.setAttribute("name", "trash-outline");
        deleteProjectIcon.setAttribute("size", "small");
        deleteProjectIcon.setAttribute("id", "delete-project-btn");

        return deleteProjectIcon;
    }

    // Create a project element and return it
    function createProjectElement(projectName) {
        const projectElement = document.createElement("div");

        const project = document.createElement("div");
        project.setAttribute("id", "project-name");
        project.textContent = projectName;

        projectElement.appendChild(createProjectIcon());
        projectElement.appendChild(project);
        projectElement.appendChild(createDeleteProjectIcon());

        projectElement.classList.add("nav-btn", "project");
        projectElement.setAttribute("id", `${projectName}`);
        projectList.push(projectElement);
        return projectElement;
    }

    function deleteProject(event) {
        const deleteProjectIcon = event.target;
        const projectElementToDelete = deleteProjectIcon.closest(".project");
        if (projectElementToDelete) {
            const projectName = projectElementToDelete.getAttribute("id");
            // Remove the project element from the DOM
            projectElementToDelete.remove();
            // Remove the project from the projectList & the project name from the createdProjectNames
            const projectIndex = projectList.findIndex(
                (project) => project.getAttribute("id") === projectName
            );
            if (projectIndex !== -1) {
                projectList.splice(projectIndex, 1);
                createdProjectNames.splice(projectIndex, 1);
            }
            // Remove the project page container
            const projectPageContainer = document.getElementById(`${projectName}-page-container`);
            if (projectPageContainer) {
                mainSection.removeChild(projectPageContainer);
            }
            // mainSection.removeChild(projectPageContainer);
            // Toggle page container to All Tasks
            uiModule.toggleTaskSection("allTasks");
        }
    }

    // Attach the deleteProject function to your delete project icons
    document.addEventListener("click", function (event) {
        if (event.target && event.target.id === "delete-project-btn") {
            deleteProject(event);
        }
    });

    function createProjectPageContainer(projectName) {
        const projectPageContainer = document.createElement("div");
        projectPageContainer.classList.add("project-page-container");
        projectPageContainer.setAttribute("id", `${projectName}-page-container`); // Use the project name as the container's ID
        projectPageContainer.style.display = "none"; // Initially hide the container
        mainSection.appendChild(projectPageContainer);
        return projectPageContainer;
    }

    function appendProjectContainer(projectName) {
        const projectPageContainer = createProjectPageContainer(projectName);
        mainSection.appendChild(projectPageContainer);
    }

    function showProjectContainer(projectName) {
        const selectedContainer = document.getElementById(
            `${projectName}-page-container`
        );
        selectedContainer.style.display = "block";
    }

    // Add a new project to the projects list
    function addNewProject() {
        const projectName = newProjectInput.value.trim();

        if (projectName && !createdProjectNames.includes(projectName)) {
            const project = createProjectElement(projectName);
            projectsContainer.appendChild(project);
            newProjectInput.value = ""; // input reset
            newProjectContainer.style.display = "none";
            // Append a new project container when a project is created
            appendProjectContainer(projectName);
            // Select the appended project container
            const selectedContainer = document.getElementById(
                `${projectName}-page-container`
            );
            // Append the header for the container
            uiModule.createMainHeader(projectName, selectedContainer);
            // Store the project name for duplication check
            createdProjectNames.push(projectName);
            // If the project name is unique and valid, remove any previous duplication message
            removeDuplicateProjectAlert(alertMessage);
        } else {
            // Handle the case where the project name already exists
            alertDuplicateProject();
        }
    }

    function createAlertMessage(textContent) {
        const alertMessage = document.createElement("div");
        alertMessage.textContent = textContent;
        alertMessage.style.paddingTop = "10px";
        return alertMessage;
    }

    function alertDuplicateProject() {
        projectSectionContainer.insertBefore(alertMessage, newProjectContainer);
    }

    function removeDuplicateProjectAlert(alertMessage) {
        if (alertMessage && alertMessage.parentNode) {
            alertMessage.parentNode.removeChild(alertMessage);
        }
    }
    // Display the new project input container
    function showNewProjectContainer() {
        newProjectContainer.style.display = "block";
    }
    // Hide the new project input container and reset the input
    function hideNewProjectContainer() {
        const newProjectInput = document.getElementById("new-project");
        newProjectInput.value = ""; // input reset
        newProjectContainer.style.display = "none";
        removeDuplicateProjectAlert(alertMessage);
    }
    // Add projects to the task modal project selector
    function populateProjectSelector() {
        // Clear only dynamically added options
        while (
            projectSelector.lastChild &&
            projectSelector.lastChild.value !== "all-tasks"
        ) {
            projectSelector.removeChild(projectSelector.lastChild);
        }
        const projectItems = projectsContainer.querySelectorAll(".nav-btn.project");
        // Append the project items to the project selector
        projectItems.forEach((projectItem) => {
            const option = document.createElement("option");
            option.value = projectItem.textContent;
            option.textContent = option.value;
            projectSelector.appendChild(option);
        });
    }

    function addTaskToProjectContainer(task) {
        let card = taskModule.createTaskCard(task);
        const projectContainer = document.getElementById(
            `${task.project}-page-container`
        );
        //Append the task to the project container
        if (projectContainer) {
            const existingTaskCard = projectContainer.querySelector(
                `.task-card[data-task-id="${task.id}"]`
            );
            if (!existingTaskCard) {
                projectContainer.appendChild(card);
            } else {
                projectContainer.removeChild(existingTaskCard);
                projectContainer.appendChild(card);
            }
        }
    }

    return {
        addNewProject,
        showNewProjectContainer,
        hideNewProjectContainer,
        populateProjectSelector,
        showProjectContainer,
        addTaskToProjectContainer,
        deleteProject,
        projectList
    };
})();
export default projectModule;
