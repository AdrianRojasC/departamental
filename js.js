// Cuando la página se carga, esta función se ejecuta
window.onload = function() {
    // Obtiene las tareas almacenadas en el almacenamiento local
    var storedTasks = localStorage.getItem("tasks");
    // Si hay tareas almacenadas, las carga en la lista de tareas
    if (storedTasks) {
        var taskList = document.getElementById("taskList");
        taskList.innerHTML = storedTasks;
        // Añade oyentes de eventos a los botones y resalta las tareas
        addListeners();
    }
};

// Esta función añade una tarea a la lista
function addTask() {
    // Obtiene los valores de los campos de entrada
    var taskInput = document.getElementById("taskInput");
    var taskDescription = document.getElementById("taskDescription");
    var dueDateTime = document.getElementById("dueDateTime");
    var taskText = taskInput.value.trim();
    var taskDescriptionText = taskDescription.value.trim();
    var dueDate = new Date(dueDateTime.value);

    // Si el texto de la tarea está vacío o la fecha de vencimiento no es válida, la función se detiene
    if (taskText === "" || isNaN(dueDate.getTime())) return;

    var taskList = document.getElementById("taskList");

    // Crea los elementos necesarios para la tarea
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.classList.add("task-name");
    var descriptionSpan = document.createElement("span");
    descriptionSpan.classList.add("task-description");
    var dateSpan = document.createElement("span");
    dateSpan.classList.add("task-due-date");
    var deleteBtn = document.createElement("button");
    var completeBtn = document.createElement("button");
    var editBtn = document.createElement("button");

    // Configura los elementos con los valores apropiados
    var date = new Date();
    var dateString = date.toLocaleDateString();
    dateSpan.textContent = "Vencimiento: " + dueDate.toLocaleString();
    li.appendChild(dateSpan);

    span.textContent = taskText;
    li.appendChild(span);

    descriptionSpan.textContent = taskDescriptionText;
    li.appendChild(document.createElement("br"));
    li.appendChild(descriptionSpan);

    // Configura los botones con los oyentes de eventos apropiados
    completeBtn.textContent = "Completar";
    completeBtn.addEventListener("click", function() {
        li.classList.toggle("completed");
        saveTasks();
    });

    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", function() {
        var newName = prompt("Edita el nombre de la tarea:", span.textContent);
        if (newName !== null) {
            span.textContent = newName;
        }

        var newDescription = prompt("Edita la descripción de la tarea:", descriptionSpan.textContent);
        if (newDescription !== null) {
            descriptionSpan.textContent = newDescription;
        }

        var newDueDate = prompt("Edita la fecha de vencimiento (YYYY-MM-DD HH:MM):", dueDate.toLocaleString());
        var newDueDateObj = new Date(newDueDate);
        if (!isNaN(newDueDateObj.getTime())) {
            dateSpan.textContent = "Vencimiento: " + newDueDateObj.toLocaleString();
        }

        saveTasks();
    });

    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", function() {
        li.remove();
        saveTasks();
    });

    // Añade los botones a la tarea
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Configura un intervalo para comprobar si la tarea ha vencido
    var intervalId = setInterval(function() {
        if (dueDate <= Date.now()) {
            clearInterval(intervalId);
            li.remove();
            saveTasks();
        }
    }, 1000);

    // Limpia los campos de entrada
    taskInput.value = "";
    taskDescription.value = "";
    dueDateTime.value = "";

    // Guarda las tareas en el almacenamiento local
    saveTasks();
}

// Esta función guarda las tareas en el almacenamiento local
function saveTasks() {
    var taskList = document.getElementById("taskList").innerHTML;
    localStorage.setItem("tasks", taskList);
}

// Esta función añade oyentes de eventos a los botones
function addListeners() {
    addDeleteListeners(); // Añade oyentes de eventos a los botones de eliminar
    addCompleteListeners(); // Añade oyentes de eventos a los botones de completar
    addEditListeners(); // Añade oyentes de eventos a los botones de editar
    addFilterListeners(); // Añade oyentes de eventos a los botones de filtro
}
// Esta función añade oyentes de eventos a los botones
function addListeners() {
    addDeleteListeners(); // Añade oyentes de eventos a los botones de eliminar
    addCompleteListeners(); // Añade oyentes de eventos a los botones de completar
    addEditListeners(); // Añade oyentes de eventos a los botones de editar
    addFilterListeners(); // Añade oyentes de eventos a los botones de filtro
}

// Esta función añade oyentes de eventos a los botones de eliminar
function addDeleteListeners() {
    var deleteButtons = document.querySelectorAll("#taskList button");
    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            button.parentElement.remove();
            saveTasks();
        });
    });
}

// Esta función añade oyentes de eventos a los botones de completar
function addCompleteListeners() {
    var completeButtons = document.querySelectorAll("#taskList button.complete-btn");
    completeButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            button.parentElement.classList.toggle("completed");
            saveTasks();
        });
    });
}

// Esta función añade oyentes de eventos a los botones de editar
function addEditListeners() {
    var editButtons = document.querySelectorAll("#taskList button.edit-btn");
    editButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var taskItem = button.parentElement;
            var taskNameSpan = taskItem.querySelector("span.task-name");
            var taskDescriptionSpan = taskItem.querySelector("span.task-description");
            var taskDueDateSpan = taskItem.querySelector("span.task-due-date");

            var newName = prompt("Edita el nombre de la tarea:", taskNameSpan.textContent);
            if (newName !== null) {
                taskNameSpan.textContent = newName;
            }

            var newDescription = prompt("Edita la descripción de la tarea:", taskDescriptionSpan.textContent);
            if (newDescription !== null) {
                taskDescriptionSpan.textContent = newDescription;
            }

            var newDueDate = prompt("Edita la fecha de vencimiento (YYYY-MM-DD HH:MM):", taskDueDateSpan.textContent);
            var newDueDateObj = new Date(newDueDate);
            if (!isNaN(newDueDateObj.getTime())) {
                taskDueDateSpan.textContent = "Vencimiento: " + newDueDateObj.toLocaleString();
            }

            saveTasks();
        });
    });
}

// Esta función añade oyentes de eventos a los botones de filtro
function addFilterListeners() {
    var filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var filter = button.dataset.filter;
            filterTasks(filter);
        });
    });
}

// Esta función filtra las tareas basándose en el filtro seleccionado
function filterTasks(filter) {
    var taskItems = document.querySelectorAll("#taskList li");
    taskItems.forEach(function(item) {
        var completed = item.classList.contains("completed");
        var overdue = item.querySelector(".task-due-date").textContent.includes("Vencimiento");
        switch (filter) {
            case 'all':
                item.style.display = "flex";
                break;
            case 'completed':
                item.style.display = completed ? "flex" : "none";
                break;
            case 'active':
                item.style.display = (!completed && !overdue) ? "flex" : "none";
                break;
            default:
                break;
        }
    });
    var filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(function(button) {
        button.classList.remove("active");
    });
    var currentFilterButton = document.querySelector(`.filter-btn[data-filter='${filter}']`);
    currentFilterButton.classList.add("active");
}
