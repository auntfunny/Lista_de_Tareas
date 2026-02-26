const dailyTodoList = document.querySelector("#dailyTodoList");
const todoList = document.querySelector("#todoList");
const newTask = document.querySelector("#newTask");
const addNew = document.querySelector("#addNew");
const daily = document.querySelector("#daily");
const mainEventListener = document.querySelector("#mainEventListener");

let dynamicData = [];

// localStorage.clear()

let activeEdit;
let activeToggle = 0;
const time = new Date();
const date = time.getDate();
const month = time.getMonth() + 1;
mainEventListener.addEventListener("click", manageClick);
mainEventListener.addEventListener("keydown", manageKey);


/******************************************************************************
 
            MANAGE EVENTS
  
  Funtions:
    manageClick
    manageKey

  Purpose:
      When an event occurs, it is managed through these functions, depending 
    on where and when the event happened, and the state of the page. 

******************************************************************************/

function manageClick(event) {
  const currentItem = event.target;
  if (
    activeToggle === 1 &&
    currentItem !== activeEdit.children[0].children[1] &&
    currentItem.closest("div") !== activeEdit.children[1]
  ) {
    endEdit(activeEdit);
  }
  if (currentItem.id === "addNew") {
    addNewTask();
  } else if (currentItem.dataset.action === "delete") {
    deleteTask(event.target);
  } else if (currentItem.dataset.action === "edit") {
    editTask(event.target);
  } else if (currentItem.type === "checkbox") {
    finishTask(event.target);
  }
}

function manageKey(event) {
  if (activeToggle === 1 && event.key === "Enter") {
    endEdit(activeEdit);
  }
}

/******************************************************************************
 
            ADD NEW TASK
  
  Funtions:
    addNewTask
    createListItem
    createSpan
    createInput
    createInnerSpan
    createButtonDiv

  Purpose:
      When a new task is entered, it is checked to have content, then a new 
    item is created, formated, and appended to the correct task list. It is
    then added to dynamicData and saved to Local Storage.

******************************************************************************/

function addNewTask() {
  const newText = newTask.value;
  const isDaily = daily.checked;

  if (!newText) {
    alert("Ingresa una tarea nueva");
  } else {
    const newListItem = createListItem();
    const newSpan = createSpan();
    const newInput = createInput();
    const innerSpan = createInnerSpan(newText);
    const newDiv = createButtonDiv();
    if (isDaily) {
      if (dailyTodoList.children.length > 0) {
        newListItem.classList.add("border-t");
      }
      dailyTodoList.appendChild(newListItem);
    } else {
      if (todoList.children.length > 0) {
        newListItem.classList.add("border-t");
      }
      todoList.appendChild(newListItem);
    }
    newListItem.appendChild(newSpan);
    newListItem.appendChild(newDiv);
    newSpan.appendChild(newInput);
    newSpan.appendChild(innerSpan);

    newTask.value = "";
    daily.checked = false;
    const dynamicObject = {
      task: newText,
      finished: 0,
      daily: isDaily,
    };
    dynamicData.push(dynamicObject);
    try {
      localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
      console.log("Guardado Correctamente");
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function createListItem() {
  const newListItem = document.createElement("li");
  const listClasses = "relative flex justify-between border-acc3 py-2".split(
    " ",
  );
  newListItem.classList.add(...listClasses);
  newListItem.id = dynamicData.length;
  return newListItem;
}
function createSpan() {
  const newSpan = document.createElement("span");
  newSpan.classList.add("flex", "items-center");
  return newSpan;
}

function createInput() {
  const newInput = document.createElement("input");
  newInput.type = "checkbox";
  newInput.classList.add("accent-acc5");
  return newInput;
}

function createInnerSpan(newText) {
  const innerSpan = document.createElement("span");
  innerSpan.classList.add("pl-2", "text-acc5");
  innerSpan.textContent = newText;
  return innerSpan;
}

function createButtonDiv() {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
        <button data-action="edit"
              class="text-xs m-1 p-1 border border-acc5 bg-acc5 text-acc3 rounded-2xl w-10 hover:bg-acc3 hover:text-acc5 active:bg-acc4 transition duration-200 ease-in-out"
            >
              Editar
            </button>
            <button data-action="delete"
              class="text-xs m-1 p-1 border border-acc5 bg-acc5 text-acc3 rounded-2xl w-15 hover:bg-acc3 hover:text-acc5 active:bg-acc4 transition duration-200 ease-in-out"
            >
              Remover
        </button>
    `;
  return newDiv;
}

/******************************************************************************
 
            DELETE TASK

  Funtion: 
    deleteTask

  Purpose:
      When the delete button is clicked, the closest list item is located in 
    the local storage, then deleted from the DOM and from the dynamicData 
    array and the changes are saved.

******************************************************************************/

function deleteTask(event) {
  const currentListItem = event.closest("li");
  const dynamicIndex = currentListItem.children[0].children[1].textContent;
  currentListItem.remove();
  dynamicData = dynamicData.filter((item) => item.task !== dynamicIndex);
  try {
    localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
    console.log("Guardado Correctamente");
  } catch (error) {
    console.error("Error", error);
  }
}

/******************************************************************************
 
            EDIT TASK
    
  Funtions:
    editTask
    endEdit

  Purpose:
      When the edit button is pressed, the closest list item is selected and
    the text is converted into an input for the user to change the task name.
    A radio is inserted with the label "Cambiar" to indicate a desired switch
    of list. The list item is saved as the active item. Then, when another 
    click comes outside of the edit area, or the enter key is pressed, the 
    input is replaced with the new text as entered, and, if the Cambiar input
    was pressed, the object within the dynamicData is changed accordingly.
    Then the list is saved to the local storage and re-rendered with the 
    changes.

******************************************************************************/

let textBeforeEdit;

function editTask(event) {
  const currentListItem = event.closest("li");
  const taskText = currentListItem.children[0].children[1].textContent;
  const inputClasses =
    "w-30 md:w-80 border border-acc3 placeholder:text-gray-400 bg-acc1 p-1 rounded-md text-acc5 caret-acc5 focus:outline-none focus:bg-white focus:inset-ring-1 focus:inset-ring-acc5".split(
      " ",
    );
  const changeListClasses = "flex flex-col items-center".split(" ");
  textBeforeEdit = taskText;
  const editBox = document.createElement("input");
  editBox.type = "text";
  editBox.value = taskText;
  editBox.classList.add(...inputClasses);
  const changeListRadio = document.createElement("div");
  changeListRadio.classList.add(...changeListClasses);
  changeListRadio.innerHTML = `
          <label for="change" class="text-sm text-acc5">Cambiar</label>
          <input type="radio" name="change" id="change" class="accent-acc5 scale-125">
  `;

  currentListItem.children[0].children[1].remove();
  currentListItem.children[0].appendChild(editBox);
  currentListItem.children[0].insertAdjacentElement(
    "afterend",
    changeListRadio,
  );
  activeEdit = currentListItem;
  activeToggle = 1;
}

function endEdit(active) {
  const edittedTask = active.children[0].children[1].value;
  const ifChange = active.children[1].children[1].checked;
  if (edittedTask) {
    active.children[0].children[1].remove();
    active.children[1].remove();
    const textEdit = createInnerSpan(edittedTask);
    active.children[0].appendChild(textEdit);
    if (active.children[0].children[0].checked) {
      textEdit.classList.add("line-through");
    }

    activeEdit = "";
    activeToggle = 0;
    const currentObject = dynamicData.find(
      (object) => object.task === textBeforeEdit,
    );
    currentObject.task = edittedTask;
    if (ifChange && currentObject.daily) {
      currentObject.daily = false;
    } else if (ifChange) {
      currentObject.daily = true;
    }

    try {
      localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
      console.log("Guaradado Correctamente");
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    alert("Ingresa un nuevo nombre");
  }
  renderTasks(dynamicData);
}

/******************************************************************************
 
            FINISH TASK

  Function:
    Finish Task

  Purpose:
      When the finished checkbox next to each task is checked, the text in that
    item is crossed out. If the task was already finished, then the line is 
    removed. Data is then saved in local storage.

******************************************************************************/

function finishTask(event) {
  const listItem = event.closest("li");
  const taskAtHand = listItem.children[0].children[1];
  const currentCheckBox = event;
  if (currentCheckBox.checked) {
    taskAtHand.classList.add("line-through");
    const currentObject = dynamicData.find(
      (object) => object.task === listItem.children[0].children[1].textContent,
    );
    currentObject.finished = 1;
    try {
      localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
      console.log("Guardado Correctamente");
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    taskAtHand.classList.remove("line-through");
    const currentObject = dynamicData.find(
      (object) => object.task === listItem.children[0].children[1].textContent,
    );
    currentObject.finished = 0;
    try {
      localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
      console.log("Guardado Correctamente");
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

/******************************************************************************
 
            LOCAL STORAGE
  
  Functions:
    loadSave
    renderTasks
    resetDailyItems

  Purpose:
      The local storage is retrived, with the list, the last day, and the last
    month at time of previous login. If data is found, it is converted to JS.
    If the day or month has changed, the daily items are searched in the array
    and the finished key is set to 0 and then saved. The tasks are then 
    rendered by creating a list item for each task. The dynamicData array is
    updated, along with day and month. This runs automatically when the page
    loads.

******************************************************************************/

function loadSave() {
  const storedDataString = localStorage.getItem("myDynamicObject");
  const storedDate = Number(localStorage.getItem("myDate"));
  const storedMonth = Number(localStorage.getItem("myMonth"));

  if (storedDataString) {
    try {
      const retrievedObject = JSON.parse(storedDataString);

      console.log("Retrieved object:", retrievedObject);
      if (storedDate) {
        console.log(`Retrieved Date: ${storedDate}`);
        console.log(`Retrieved Month: ${storedMonth}`);
        if (storedDate !== date || storedMonth !== month) {
          resetDailyItems(retrievedObject);
        }
      }
      renderTasks(retrievedObject);
      dynamicData = [...retrievedObject];
      localStorage.setItem("myDate", String(date));
      localStorage.setItem("myMonth", String(month));
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log('No hay data en "myDynamicObject".');
  }
}
loadSave();

function renderTasks(retrievedObject) {
  todoList.innerHTML = "";
  dailyTodoList.innerHTML = "";
  retrievedObject.forEach((element) => {
    const newListItem = createListItem();
    const newSpan = createSpan();
    const newInput = createInput();
    const innerSpan = createInnerSpan(element.task);
    const newDiv = createButtonDiv();

    if (element.finished === 1) {
      innerSpan.classList.add("line-through");
      newInput.checked = true;
    }
    if (element.daily) {
      if (dailyTodoList.children.length > 0) {
        newListItem.classList.add("border-t");
      }
      dailyTodoList.appendChild(newListItem);
    } else {
      if (todoList.children.length > 0) {
        newListItem.classList.add("border-t");
      }
      todoList.appendChild(newListItem);
    }
    newListItem.appendChild(newSpan);
    newListItem.appendChild(newDiv);
    newSpan.appendChild(newInput);
    newSpan.appendChild(innerSpan);
  });
}

function resetDailyItems(retrievedObject) {
  retrievedObject.forEach((item) => {
    if (item.daily) {
      item.finished = 0;
    }
  });
  try {
    localStorage.setItem("myDynamicObject", JSON.stringify(retrievedObject));
    console.log("Guardado Correctamente");
  } catch (error) {
    console.error("Error:", error);
  }
}
