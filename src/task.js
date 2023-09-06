const taskModule = (function () {
    const taskForm = document.getElementById('task-form');
    const taskList = [];

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

        card.innerHTML = `
          <h3>${task.title}</h3>
          <p>Description: ${task.description}</p>
          <p>Due Date: ${task.dueDate}</p>
          <p>Priority: ${task.priority}</p>
          <p>Project: ${task.project}</p>
        `;
        allTasksContainer.appendChild(card);
    }

    //Handle form submissions for creating new tasks
    function handleFormSubmit(event) {
        event.preventDefault();
        // Accessing form elements
        const title = taskForm.querySelector('#title').value;
        const description = taskForm.querySelector('#description').value;
        const dueDate = taskForm.querySelector('#due-date').value;
        const priority = taskForm.querySelector('#priority').value;
        const project = taskForm.querySelector('#project').value;

        const task = createTask(title, description, dueDate, priority, project);
        taskList.push(task);
        createTaskCard(task);
        taskForm.reset();
    }
    return { createTask, createTaskCard, handleFormSubmit }
})()

export default taskModule;