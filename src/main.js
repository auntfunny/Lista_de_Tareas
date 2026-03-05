const dailyTodoList = document.querySelector("#dailyTodoList");
const todoList = document.querySelector("#todoList");
const newTask = document.querySelector("#newTask");
const addNew = document.querySelector("#addNew");
const daily = document.querySelector("#daily");
const mainEventListener = document.querySelector("#mainEventListener");
const inputModal = document.querySelector("#inputModal");
const newForm = document.querySelector("#newForm");
const dateBox = document.querySelector("#dateBox");
const timeBox = document.querySelector("#timeBox");
const priceBox = document.querySelector("#priceBox");
const dateOfTask = document.querySelector("#dateOfTask");

let dynamicData = [];

// localStorage.clear()

let activeEdit;
let activeToggle = 0;
const time = new Date();
const date = time.getDate();
const month = time.getMonth() + 1;
mainEventListener.addEventListener("click", manageMainClick);
mainEventListener.addEventListener("keydown", manageKey);
inputModal.addEventListener("change", manageModalChange);
inputModal.addEventListener("click", manageModalClick);
newForm.addEventListener("submit", createNewTask);

/******************************************************************************
 
            MANAGE EVENTS
  
  Funtions:
    manageClick
    manageKey

  Purpose:
      When an event occurs, it is managed through these functions, depending 
    on where and when the event happened, and the state of the page. 

******************************************************************************/

function manageMainClick(event) {
  const currentItem = event.target;
  const currentButton = currentItem.closest("button");

  if (
    activeToggle === 1 &&
    currentItem !== activeEdit.children[0].children[1] &&
    currentItem.closest("div") !== activeEdit.children[1]
  ) {
    endEdit(activeEdit);
  } else if (currentButton && currentButton.dataset.action === "edit") {
    editTask(event.target);
  }
  if (currentButton && currentButton.id === "addNew") {
    showModal();
  } else if (currentButton && currentButton.dataset.action === "delete") {
    deleteTask(event.target);
  } else if (currentItem.type === "checkbox") {
    finishTask(event.target);
  }
}
function manageKey(event) {
  if (activeToggle === 1 && event.key === "Enter") {
    endEdit(activeEdit);
  }
}

function manageModalClick(event) {
  const currentItem = event.target;
  if (currentItem === inputModal || currentItem.closest("#closeModal")) {
    hideModal();
  }
}

function manageModalChange(event) {
  const currentLabel = event.target.closest("label");

  if (currentLabel) {
    const next = currentLabel.nextElementSibling;
    if (
      currentLabel.classList.contains("slider") &&
      next.classList.contains("max-h-0")
    ) {
      showBox(next);
    } else if (currentLabel.classList.contains("slider")) {
      hideBox(next);
    }
    if (
      currentLabel.id === "dailySlider" &&
      next.classList.contains("hidden")
    ) {
      showInput(next);
    } else if (currentLabel.id === "dailySlider") {
      hideInput(next);
    }
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

function addNewTask({ title, daily, urgency }) {
  const newListItem = createListItem();
  const newSpan = createSpan();
  const newInput = createInput();
  const innerSpan = createInnerSpan(title, urgency);
  const newDiv = createButtonDiv();
  if (daily) {
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
}

function dynamicallySave(taskObject) {
  dynamicData.push(taskObject);
  try {
    localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
    console.log("Guardado Correctamente");
  } catch (error) {
    console.error("Error:", error);
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
  newInput.classList.add("accent-acc5", "w-8");
  return newInput;
}

function createInnerSpan(newText, urgency) {
  const innerSpan = document.createElement("span");
  innerSpan.classList.add("pl-2", "text-acc5");
  switch (Number(urgency)) {
    case 3:
      innerSpan.innerHTML = '<span class="text-red-500 font-bold">!!! </span>';
      break;
    case 2:
      innerSpan.innerHTML = '<span class="text-orange-500 font-bold">!! </span>';
      break;
    case 1:
      innerSpan.innerHTML = '<span class="text-yellow-500 font-bold">! </span>';
      break;
  }
  const newSpan = document.createElement("span");
  newSpan.classList.add("title");
  newSpan.textContent += newText;
  innerSpan.appendChild(newSpan);
  return innerSpan;
}

function createButtonDiv() {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
        <button data-action="edit"
              class="text-xs m-1 p-1 border border-acc5 bg-acc5 text-acc3 rounded-2xl hover:bg-acc3 hover:text-acc5 active:bg-acc4 transition duration-200 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
            <button data-action="delete"
              class="text-xs m-1 p-1 border border-acc5 bg-acc5 text-acc3 rounded-2xl hover:bg-acc3 hover:text-acc5 active:bg-acc4 transition duration-200 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
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
  const dynamicIndex = currentListItem.querySelector(".title").textContent;
  currentListItem.remove();
  dynamicData = dynamicData.filter((item) => item.title !== dynamicIndex);
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
  const taskText = currentListItem.querySelector(".title").textContent;
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
      (object) => object.title === textBeforeEdit,
    );
    currentObject.title = edittedTask;
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
  const taskAtHand = listItem.querySelector(".title");
  const currentCheckBox = event;
  if (currentCheckBox.checked) {
    taskAtHand.classList.add("line-through");
    const currentObject = dynamicData.find(
      (object) => object.title === taskAtHand.textContent,
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
      (object) => object.title === taskAtHand.textContent,
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
 
            MODAL

******************************************************************************/

function showModal() {
  inputModal.classList.remove("invisible");
  inputModal.classList.remove("opacity-0");
  inputModal.classList.add("opacity-100");
}

function hideModal() {
  inputModal.classList.remove("opacity-100");
  inputModal.classList.add("invisible");
  inputModal.classList.add("opacity-0");
}

function showBox(box) {
  box.classList.remove("max-h-0");
  box.classList.add("max-h-100");
}

function hideBox(box) {
  box.classList.remove("max-h-100");
  box.classList.add("max-h-0");
}

function hideInput(input) {
  input.classList.add("hidden");
  const parent = input.parentNode;
  parent.classList.add("min-h-29");
  setTimeout(() => {
    parent.classList.remove("min-h-29");
    parent.classList.add("min-h-0");
  }, 100);
}

function showInput(input) {
  const parent = input.parentNode;
  parent.classList.remove("min-h-0");
  parent.classList.add("min-h-29");
  setTimeout(() => {
    input.classList.remove("hidden");
    parent.classList.remove("min-h-29");
  }, 500);
}

function createNewTask(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  if (formData.get("newTask")) {
    const newTaskObject = {
      title: formData.get("newTask"),
      date: formData.get("withDate")
        ? !formData.get("daily")
          ? formData.get("dateOfTask")
          : null
        : null,
      daily: formData.get("withDate")
        ? formData.get("daily")
          ? true
          : false
        : false,
      time: formData.get("withTime") ? formData.get("timeOfTask") : null,
      price: formData.get("withPrice") ? formData.get("priceOfTask") : null,
      urgency: formData.get("urgent"),
      finished: 0,
    };

    addNewTask(newTaskObject);
    dynamicallySave(newTaskObject);
    newForm.reset();
    hideModal();
    if (formData.get("withDate")) {
      hideBox(dateBox);
    }
    if (formData.get("withTime")) {
      hideBox(timeBox);
    }
    if (formData.get("withPrice")) {
      hideBox(priceBox);
    }
    if (formData.get("daily")) {
      showInput(dateOfTask);
    }
  } else {
    alert("Ingresa una nueva tarea");
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
    renderItem(element);
  });
}

function renderItem(element) {
  const newListItem = createListItem();
  const newSpan = createSpan();
  const newInput = createInput();
  const innerSpan = createInnerSpan(element.title, element.urgency);
  const newDiv = createButtonDiv();

  if (element.finished === 1) {
    const title = innerSpan.querySelector(".title");
    title.classList.add("line-through");
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
