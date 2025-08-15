const addInput = document.querySelector(".input-new-task");
const submitButton = document.querySelector(".submit-btn");

const taskContainer = document.querySelector(".task-container");

// Update if there's a changes in checkbox
document.addEventListener("change", (event) => {
    if (event.target.matches("input[type='checkbox']")) {
        updateTaskStatus();
    }
});

// Update the Task Progress
function updateTaskStatus() {
    const taskDisplay = document.querySelector(".task");
    const completedDisplay = document.querySelector(".completed");
    const pendingDisplay = document.querySelector(".pending");

    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const taskCount = document.querySelectorAll("li").length;

    const tasks = JSON.parse(localStorage.getItem("todoList")) || [];

    checkboxes.forEach(cb => {
        const taskItem = cb.closest("li");
        const taskId = taskItem.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = cb.checked;
        }
    });

    localStorage.setItem("todoList", JSON.stringify(tasks));

    const checkedCount = tasks.filter(t => t.completed).length;
    const pendingCount = taskCount - checkedCount;

    taskDisplay.textContent = `Task: ${ taskCount }`;
    completedDisplay.textContent = `Completed: ${ checkedCount }`;
    pendingDisplay.textContent = `Pending: ${ pendingCount }`;
}

// Create a Task
function createNewTask() {
    let inputValue = addInput.value.trim();
    if (inputValue) {
        const taskId = Date.now().toString();
        const taskObj = {
            id: taskId,
            text: inputValue,
            completed: false
        };

        const tasks = JSON.parse(localStorage.getItem("todoList")) || [];
        tasks.push(taskObj);
        localStorage.setItem("todoList", JSON.stringify(tasks));

        renderTask(taskObj);
        updateTaskStatus();
    }
}

function renderTask(task) {
    const taskList = document.createElement("li");
    taskList.className = "task-list";
    taskList.dataset.id = task.id;

    taskList.innerHTML = `
        <!-- Current Task -->
        <div class="current-task">
            <div class="current-value">
                <!-- Checkbox -->
                <input type="checkbox" class="checkbox" ${ task.completed ? "checked" : "" } />
                <!-- Input Value -->
                <p class="input-value">${ task.text }</p>
            </div>
            <!-- Edit & Delete Buttons -->
            <div class="current-buttons">
                <!-- Edit Button -->
                <button type="button" onclick="handleEditButton(event)" class="btn edit-btn">Edit</button>
                <!-- Delete Button -->
                <button type="button" onclick="handleDeleteButton(event)" class="btn delete-btn">Delete</button>
            </div>
        </div>
        <!-- Edit Task -->
        <form action="" class="edit-task">
            <div class="form-group">
                <!-- Input New Value -->
                <input type="text" placeholder="Edit Task" class="form-control edit-input" />
                <!-- Cancel & Save Buttons -->
                <div class="edit-buttons">
                    <!-- Cancel Button -->
                    <button type="button" onclick="handleCancelButton(event)" class="btn cancel-btn">Cancel</button>
                    <!-- Save Button -->
                    <button onclick="handleSaveButton(event)" class="save-btn btn">Save</button>
                </div>
            </div>
        </form>
    `;
    taskContainer.appendChild(taskList);
}

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    createNewTask();
    addInput.value = "";
});

// Show the new input form
function handleEditButton(event) {
    const taskItem = event.target.closest("li");
    if (!taskItem) return;

    document.querySelectorAll("li").forEach(li => {
        const edit = li.querySelector(".edit-task");
        if (edit) {
            edit.classList.remove("is-editing");
        }
    });

    const editForm = taskItem.querySelector(".edit-task");
    if (editForm) {
        editForm.classList.add("is-editing");
    }
}

// Delete the parent element of the event target
function handleDeleteButton(event) {
    const taskItem = event.target.closest("li");
    if (taskItem) {
        const taskId = taskItem.dataset.id;
        const tasks = JSON.parse(localStorage.getItem("todoList")) || [];
        const updateTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem("todoList", JSON.stringify(updateTasks));

        taskItem.remove();
        updateTaskStatus();
    }
}

// Hide the new input form
function handleCancelButton(event) {
    const taskItem = event.target.closest("li");
    if (!taskItem) return;

    const cancelForm = taskItem.querySelector(".edit-task");
    if (cancelForm) {
        cancelForm.classList.remove("is-editing");
    }
}

// Change the current input value to new input value
function handleSaveButton(event) {
    // event.preventDefault();
    const taskItem = event.target.closest("li");
    if (!taskItem) return

    const editedInput = taskItem.querySelector(".edit-input");
    const newValue = editedInput.value.trim();
    if (!newValue) return;

    const taskId = taskItem.dataset.id;
    const tasks = JSON.parse(localStorage.getItem("todoList")) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.text = newValue;
        localStorage.setItem("todoList", JSON.stringify(tasks));
    }

    taskItem.querySelector("input-value").textContent = newValue;
    editedInput.value = "";

    const editForm = taskItem.querySelector(".edit-task");
    if (editForm) {
        editForm.classList.remove("is-editing");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTasks = JSON.parse(localStorage.getItem("todoList")) || [];
    savedTasks.forEach(task => renderTask(task));
    updateTaskStatus();
});