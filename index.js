import {
  storeTask,
  fetchAllTasks,
  deleteAllTasks,
  selectAllTasks,
  deleteTaskById,
  checkTaskById,
  editTask,
} from "./taskRepository.js";
import { taskModel } from "./taskModel.js";

let addTaskButton = document.querySelector("#add-task");
let taskContainer = document.querySelector(".task-container");
let select = document.querySelector(".select");
let previousTasks = new Map();
let tasks = [];
let i = -1;
let editMode = false;

async function displayTasks() {
  tasks = await fetchAllTasks();

  tasks.forEach((task) => {
    i = i + 1;

    if (!previousTasks.has(task.id)) {
      let taskElement = document.createElement("div");
      taskElement.className = "task";
      taskElement.setAttribute("taskId", task.id);

      task.completed
        ? (taskElement.innerHTML = ` <button type="button" class="checkbox"> <i class="fa-regular fa-circle-check " ></i> </button>
<span class="comletedTaskStily"> ${task.taskText} </span> 
 <div class="mainpulate">

 <button type="button" class="edit"><i class="fa-regular fa-pen-to-square"></i></button> <button type="button" class="delete"><i class="fa-solid fa-xmark"></i></button>
 </div>`)
        : (taskElement.innerHTML = ` <button type="button" class="checkbox"> <i class="fa-regular fa-circle" ></i> </button>
<span > ${task.taskText} </span> 
 <div class="mainpulate">

 <button type="button" class="edit"><i class="fa-regular fa-pen-to-square"></i></button> <button type="button" class="delete"><i class="fa-solid fa-xmark"></i></button>
 </div>`);

      taskContainer.appendChild(taskElement);

      previousTasks.set(task.id, task);
    } else if (task.completed !== previousTasks.get(task.id).completed) {
      let t = document.querySelector(`[taskId="${task.id}"]`);

      t.firstElementChild.firstElementChild.classList.toggle("fa-circle-check");
      t.firstElementChild.firstElementChild.classList.toggle("fa-circle");
      t.firstElementChild.nextElementSibling.classList.toggle(
        "comletedTaskStily"
      );
      previousTasks.get(task.id).completed = task.completed;
    } else if (task.taskText !== previousTasks.get(task.id).taskText) {
      let t = document.querySelector(`[taskId="${task.id}"]`);
      t.firstElementChild.nextElementSibling.innerHTML = `<span > ${task.taskText} </span> 
`;

      previousTasks.get(task.id).taskText = task.taskText;
    }
  });


  previousTasks.forEach((preTask, key) => {
    if (!tasks.some((task) => task.id === preTask.id)) {
      document.querySelector(`[taskId="${preTask.id}"]`).remove();
      previousTasks.delete(key);
    }
  });

  deleteTask();
  CheckFunctionality();
  editFunctionality();
}
displayTasks();

async function addTask() {
  let taskName = document.getElementById("task-name").value;
  if (taskName !== "") {
    let newTask = new taskModel(taskName);
    document.getElementById("task-name").value = "";
    await storeTask(newTask);
    displayTasks();
  }
}

function deleteTask() {
  let deleteTask = document.querySelectorAll(".delete");
  deleteTask.forEach((button) => {
    button.onclick = async () => {
      await deleteTaskById(
        button.parentElement.parentElement.getAttribute("taskId")
      );
      displayTasks();
    };
  });
}

function CheckFunctionality() {
  let checkTask = document.querySelectorAll(".checkbox");
  checkTask.forEach((button) => {
    button.onclick = async () => {
      console.log("vvv")
      await checkTaskById(button.parentElement.getAttribute("taskId"));
      displayTasks();
    };
  });
}

function editFunctionality() {
  let editbutton = document.querySelectorAll(".edit");

  editbutton.forEach((button) => {
    button.addEventListener("click", async () => {
      editMode = true;
      document.getElementById("task-name").focus();
      addTaskButton.textContent = "Edit";

      let preText = button.parentElement.previousElementSibling.textContent;
      document.getElementById("task-name").value = preText;
      addTaskButton.onclick = async () => {
        if (editMode) {
          let newTitle = document.getElementById("task-name").value;
          let taskId =
            button.parentElement.parentElement.getAttribute("taskId");
          await editTask(taskId, newTitle);
          document.getElementById("task-name").value = "";
          addTaskButton.textContent = "Add";
          editMode = false;
          displayTasks();
        }
      };
    });
  });
}

addTaskButton.addEventListener("click", () => {
  if (!editMode) addTask();
  else console.log("go to update");
});

let deleteAll = document.querySelector(".deleteAll");
deleteAll.onclick = async () => {
  await deleteAllTasks();
  displayTasks();
};

let selectAll = document.querySelector(".selectAll");
selectAll.onclick = async () => {
  await selectAllTasks();
  displayTasks();
};

function multiselectFunction() {
  select.classList.add("hidden");
  selectAll.classList.add("hidden");
  deleteAll.classList.add("hidden");
  let deselect = document.createElement("button");
  deselect.className = "deselect";
  let textNode = document.createTextNode("Deselect");
  deselect.append(textNode);

  taskContainer.prepend(deselect);
  let tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.innerHTML = '<input type="checkbox" id="select">' + task.innerHTML;
  });
  let options = document.createElement("div");
  options.className = "options";
  options.innerHTML =
    ' <button class="deletemult"> <i class="fa-solid fa-trash-can"></i></button> <button class="selectmult"><i class="fa-solid fa-check"></i></button>';

  taskContainer.append(options);
  let c = document.querySelectorAll("#select");
  let deletemult = document.querySelector(".deletemult");

  deletemult.onclick = async () => {
    c.forEach(async (box) => {
      if (box.checked) {
        await deleteTaskById(box.parentElement.getAttribute("taskId"));
      }
      await displayTasks();

    });

    select.classList.remove("hidden");
    selectAll.classList.remove("hidden");
    deleteAll.classList.remove("hidden");
    deselect.remove();
    options.remove();
    

    c.forEach((b) => {
      b.remove();
    });
  };

  let selectmult = document.querySelector(".selectmult");

  selectmult.onclick = async () => {
    c.forEach(async (box) => {
      if (box.checked) {
        await checkTaskById(box.parentElement.getAttribute("taskId"));
      }
      await displayTasks();

    });
    // await displayTasks();

    c.forEach((b) => {
      b.remove();
    });
    options.remove();
    deselect.remove();
    select.classList.remove("hidden");
    selectAll.classList.remove("hidden");
    deleteAll.classList.remove("hidden");
  };

  deselect.onclick = () => {
    c.forEach((b) => {
      b.remove();
    });
    options.remove();
    select.classList.remove("hidden");
    selectAll.classList.remove("hidden");
    deleteAll.classList.remove("hidden");
  
    deselect.remove();
  };
}
select.addEventListener("click", multiselectFunction);
