let taskBar = document.getElementById("task");
let descriptionBar = document.getElementById("description");
let dateBar = document.getElementById("due_date");
let priorityBar = document.getElementById("priority");

let tasks = JSON.parse(localStorage.getItem("todolist")) || [];
displayCards();

document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();

    if(taskBar.value === "" || descriptionBar.value === "" || dateBar.value === "" || priorityBar.value === "") {
        let warning = document.createTextNode("Complete All Fields");
        document.getElementById("text").appendChild(warning);
    }
    else {
        getTask();
    }
});

function getTask() {
    let task = taskBar.value;
    taskBar.value = "";

    let description = descriptionBar.value;
    descriptionBar.value = "";

    let due_date = dateBar.value;
    dateBar.value = "";

    let priority = priorityBar.value;
    priorityBar.value = "1";

    let seconds = new Date().getTime();

    let thisTask = {task, description, due_date, priority, seconds};
    tasks.push(thisTask);

    localStorage.setItem("todolist", JSON.stringify(tasks));
    displayCards();
}

function generateCard(data) {
    let cardClass;
    if(data.priority == 1) {
        cardClass = "bg-success text-white";
    }
    else if(data.priority == 2) {
        cardClass = "bg-warning";
    }
    else {
        cardClass = "bg-danger text-white";
    }

    let card = `<div class="col-md-3 mb-4 ${cardClass}" style="border-radius: 15px;">
                    <div class="card shadow-lg rounded-lg p-3">
                        <div class="card-body">
                            <h4 class="card-title">${data.task}</h4>
                            <p class="card-text text-muted">${data.description}</p>
                            <p class="card-text"><small class="text-info">Due: ${data.due_date}</small></p>
                        </div>
                    </div>
                    <button class="cross-button" value="${data.seconds}"><i class="bi bi-x-lg"></i></button>
                    <button class="edit-button" value="${data.seconds}"><i class="bi bi-pencil"></i></button>
                </div>`;

    return card;
}

function displayCards() {
    let cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    let sortedTasks = [...tasks];
    sortedTasks.sort((a, b) => {
        const dateComparison = new Date(a.due_date) - new Date(b.due_date);
        if (dateComparison === 0) {
            return parseInt(b.priority) - parseInt(a.priority);
        }
        return dateComparison;
    });

    for(let task of sortedTasks) {
        cardContainer.innerHTML += (generateCard(task));
    }

    enableCross();
    enableEdit();
}

function enableCross() {
    let cross_buttons = document.querySelectorAll(".cross-button");
    cross_buttons.forEach(button => button.addEventListener("click", function(){
        let deleteValue = this.value;
        const index = tasks.findIndex((item) => item.seconds == deleteValue);
        
        tasks.splice(index, 1);

        localStorage.setItem("todolist", JSON.stringify(tasks));
        displayCards();
    }));
}

taskBar.addEventListener("click", () => {
    document.getElementById("text").innerHTML = "";
});
descriptionBar.addEventListener("click", () => {
    document.getElementById("text").innerHTML = "";
});
dateBar.addEventListener("click", () => {
    document.getElementById("text").innerHTML = "";
});
priorityBar.addEventListener("click", () => {
    document.getElementById("text").innerHTML = "";
});

let changeForm = document.getElementById("changeForm");
changeForm.style.display = "none";
function enableEdit() {
    let edit_buttons = document.querySelectorAll(".edit-button");
    edit_buttons.forEach(button => button.addEventListener("click", function(){
        changeForm.style.display = "block";
        document.getElementById("overlay").classList.remove("hidden");

        let taskValue = this.value;
        const taskIndex = tasks.findIndex((item) => item.seconds == taskValue);

        let taskChangeBar = document.getElementById("taskChange");
        let descriptionChangeBar = document.getElementById("descriptionChange");
        let due_dateChangeBar = document.getElementById("due_dateChange");
        let priorityChangeBar = document.getElementById("priorityChange");

        taskChangeBar.value = tasks[taskIndex].task;
        descriptionChangeBar.value = tasks[taskIndex].description;
        due_dateChangeBar.value = tasks[taskIndex].due_date;
        priorityChangeBar.value = tasks[taskIndex].priority;

        document.getElementById("submitChange").addEventListener("click", submitChange);
        function submitChange(e) {
            e.preventDefault();
            
            if (taskChangeBar.value === "" || descriptionChangeBar.value === "" || due_dateChangeBar.value === "" || priorityChangeBar.value === "") {
                document.getElementById("textChange").innerHTML = "Complete All Fields";
                setTimeout(() => {
                    document.getElementById("textChange").innerHTML = "";
                }, 1000);
            } else {
                tasks[taskIndex].task = taskChangeBar.value;
                tasks[taskIndex].description = descriptionChangeBar.value;
                tasks[taskIndex].due_date = due_dateChangeBar.value;
                tasks[taskIndex].priority = priorityChangeBar.value;

                taskChangeBar.value = "";
                descriptionChangeBar.value = "";
                due_dateChangeBar.value = "";
                priorityChangeBar.value = "1";

                changeForm.style.display = "none";
                document.getElementById("overlay").classList.add("hidden");

                localStorage.setItem("todolist", JSON.stringify(tasks));

                displayCards();
            }
        }
    }));
}

document.getElementById("change-cross-button").addEventListener("click", function(){
    changeForm.style.display = "none";
    document.getElementById("overlay").classList.add("hidden");
});