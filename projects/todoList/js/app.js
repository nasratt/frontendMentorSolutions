"use strict";
const UI = {
  themeBtn: document.getElementById("theme-btn"),
  todoInputForm: document.querySelector(".input__form"),
  todoInput: document.querySelector(".header__input"),
  todoItemsContainer: document.querySelector(".todo-list"),
  allBtn: document.querySelector(".btnAll"),
  activeBtn: document.querySelector(".btnActive"),
  completedBtn: document.querySelector(".btnCompleted"),
  filterBtns: document.querySelectorAll(".btnFilter"),
  activeTasksCount: document.querySelector(".todoItems__number"),
  clearCompletedBtn: document.querySelector(".clearCompleted-btn"),
  taskRemoveBtn: document.querySelector(".todo-item__remove-btn"),
};

// ======== App Data ==========
const fromLocalStorage = JSON.parse(localStorage.getItem("tasksData"));
let data = fromLocalStorage || [];
let dragSrcEl;
const themeStyleSheet = document.getElementById("themeStyleSheet");

function displayTasksCount() {
  const tasksCount = localStorage.getItem("activeTasksCount");
  if (tasksCount) {
    UI.activeTasksCount.textContent = tasksCount;
  }
}

function generateTaskMarkup(id, desc, isCompleted = "false") {
  return `
      <li class="todo-item ${
        isCompleted === "true" ? "done" : ""
      }" draggable="true" id="${id}" 
      data-complete="${isCompleted}">
         <input
         type="checkbox"
         name="complete"
         class="todo-item__checkbox"
         ${isCompleted === "true" ? "checked" : ""}
         />
         <p class="todo-item__text">${desc}</p>
         <button class="todo-item__remove-btn btn">
         <img src="./images/icon-cross.svg" alt="Delete task button" />
         </button>
      </li>
   `;
}
(function () {
  if (data.length === 0) return;

  UI.todoItemsContainer.innerHTML = "";
  data.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    UI.todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
  displayTasksCount();
})();

function storeTasks() {
  localStorage.setItem("tasksData", JSON.stringify(data));
  const activeTasksCount = data.filter((task) => task.isCompleted === "false")
    .length;
  localStorage.setItem("activeTasksCount", activeTasksCount);
}

function dragStartHandler(ev) {
  let sourceItem = ev.target.closest(".todo-item");
  const theme = localStorage.getItem("prevSetTheme");
  sourceItem.style.background = theme == "dark" ? "#212336" : "#e6e6e6";

  ev.dataTransfer.setData("itemId", sourceItem.id);
  ev.dataTransfer.effectAllowed = "move";
  ev.dataTransfer.setData("text/html", sourceItem.innerHTML);
  dragSrcEl = sourceItem;
}

function dragOverHandler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
  let targetItem = ev.target.closest(".todo-item");
  const theme = localStorage.getItem("prevSetTheme");
  targetItem.style.background = theme == "dark" ? "#212336" : "#e6e6e6";
  return false;
}

function dragLeaveHandler(ev) {
  let targetItem = ev.target.closest(".todo-item");
  if (targetItem === dragSrcEl) return;
  targetItem.style.background = "";
}

function dropHandler(ev) {
  let targetItem = ev.target.closest(".todo-item");
  let id = ev.dataTransfer.getData("itemId");
  let sourceItem = document.getElementById(id);
  // targetItem.parentElement.insertBefore(sourceItem, targetItem.nextSibling);

  if (dragSrcEl.innerHTML !== targetItem.innerHTML) {
    const srcAttributes = [...sourceItem.attributes].map((attr) => ({
      name: attr.name,
      value: attr.value,
    }));
    const targetAttributes = [...targetItem.attributes].map((attr) => ({
      name: attr.name,
      value: attr.value,
    }));

    const srcTargetIndices = [];
    data.filter((task, index) => {
      if (
        task.id === Number(targetItem.id) ||
        task.id === Number(dragSrcEl.id)
      ) {
        srcTargetIndices.push(index);
        return true;
      }
    });
    // Swapping tasks in data array
    [data[srcTargetIndices[0]], data[srcTargetIndices[1]]] = [
      data[srcTargetIndices[1]],
      data[srcTargetIndices[0]],
    ];

    dragSrcEl.innerHTML = targetItem.innerHTML;
    targetItem.innerHTML = ev.dataTransfer.getData("text/html");

    // Swap the attributes of tasks
    targetAttributes.forEach((attr) =>
      sourceItem.setAttribute(attr.name, attr.value)
    );
    srcAttributes.forEach((attr) =>
      targetItem.setAttribute(attr.name, attr.value)
    );
    console.log(srcAttributes, targetAttributes);
  }
  targetItem.style.background = "";
  sourceItem.style.background = "";
  storeTasks();
}

function dragEndHandler(ev) {
  document
    .querySelectorAll(".todo-item")
    .forEach((todoItem) => (todoItem.style.background = ""));
}

const dragDropHandlers = [
  dragStartHandler,
  dragOverHandler,
  dragLeaveHandler,
  dropHandler,
  dragEndHandler,
];

["dragstart", "dragover", "dragleave", "drop"].forEach((event, ind) => {
  UI.todoItemsContainer.addEventListener(event, dragDropHandlers[ind]);
});

UI.themeBtn.addEventListener("click", (e) => {
  const themeName = e.target.dataset.theme;
  themeStyleSheet.href = `./css/${themeName}Theme.css`;
  UI.themeBtn.dataset.theme = themeName === "light" ? "dark" : "light";
  localStorage.setItem("prevSetTheme", themeName);
});

UI.todoInputForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const task = {
    id: new Date().getTime(),
    desc: UI.todoInput.value,
    isCompleted: "false",
  };

  if (task.desc === "") return;
  const markup = generateTaskMarkup(task.id, task.desc);
  data.push(task);

  if (UI.todoItemsContainer.firstElementChild?.className === "message")
    UI.todoItemsContainer.innerHTML = "";

  UI.todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  UI.todoInput.value = "";
  storeTasks();
  displayTasksCount();
});

UI.completedBtn.addEventListener("click", (ev) => {
  let completedTasks = data.filter((task) => {
    return task.isCompleted === "true";
  });

  UI.filterBtns.forEach((btn) => {
    btn.classList.remove("active");
  });

  ev.target.classList.add("active");
  UI.todoItemsContainer.innerHTML = "";
  if (completedTasks.length === 0) {
    UI.todoItemsContainer.innerHTML = `<li class="message">Tasks list is empty!</li>`;
  }
  completedTasks.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    UI.todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
});

UI.activeBtn.addEventListener("click", (ev) => {
  let incompletedTasks = data.filter((task) => {
    return task.isCompleted === "false";
  });

  UI.filterBtns.forEach((btn) => {
    btn.classList.remove("active");
  });

  ev.target.classList.add("active");

  UI.todoItemsContainer.innerHTML = "";
  if (incompletedTasks.length === 0) {
    UI.todoItemsContainer.innerHTML = `<li class="message">Tasks list is empty!</li>`;
  }
  incompletedTasks.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    UI.todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
});

UI.allBtn.addEventListener("click", (ev) => {
  UI.filterBtns.forEach((btn) => {
    btn.classList.remove("active");
  });

  ev.target.classList.add("active");
  UI.todoItemsContainer.innerHTML = "";

  if (data.length === 0) {
    UI.todoItemsContainer.innerHTML = `<li class="message">Tasks list is empty!</li>`;
  }
  data.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    UI.todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
});

UI.clearCompletedBtn.addEventListener("click", () => {
  const completedTasks = data.filter((task) => task.isCompleted === "true");

  completedTasks.forEach((completedTask) => {
    UI.todoItemsContainer.removeChild(
      document.getElementById(completedTask.id)
    );
  });

  if (!UI.todoItemsContainer.children.length)
    UI.todoItemsContainer.innerHTML = `<li class="message">Tasks list is empty!</li>`;

  data = data.filter((task) => task.isCompleted === "false");
  storeTasks();
});

UI.todoItemsContainer.addEventListener("click", (ev) => {
  const checkBox = "todo-item__checkbox";
  const taskDelBtn = "todo-item__remove-btn";
  let clickedEl =
    ev.target.closest(`.${checkBox}`) || ev.target.closest(`.${taskDelBtn}`);

  if (!clickedEl) return;
  const taskClicked = clickedEl.closest(".todo-item");
  if (clickedEl.classList.contains(checkBox)) {
    if (!clickedEl.hasAttribute("checked")) {
      taskClicked.classList.add("done");
      taskClicked.dataset.complete = "true";
      clickedEl.setAttribute("checked", "");

      data = data.map((task) => {
        if (task.id === Number(taskClicked.id)) {
          return {
            id: task.id,
            desc: task.desc,
            isCompleted: "true",
          };
        } else return task;
      });
    } else {
      taskClicked.classList.remove("done");
      taskClicked.dataset.complete = "false";
      clickedEl.removeAttribute("checked");

      data = data.map((task) => {
        if (task.id === Number(taskClicked.id)) {
          return {
            id: task.id,
            desc: task.desc,
            isCompleted: "false",
          };
        } else return task;
      });
    }
  } else {
    taskClicked.parentElement.removeChild(taskClicked);

    if (!UI.todoItemsContainer.children.length)
      UI.todoItemsContainer.innerHTML = `<li class="message">Tasks list is empty!</li>`;

    data = data.filter((task) => task.id !== Number(taskClicked.id));
  }

  storeTasks();
  displayTasksCount();
});
