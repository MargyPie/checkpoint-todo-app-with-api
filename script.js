/**** Remaining bug:
 * Anklicken der checkboxen ändert nicht ihren Status im State.
 * Daher werden immer die gleichen Todos als erledigt oder offen angezeigt.
 */

const addTodoBtn = document.querySelector("#add-todo");
const deleteBtn = document.querySelector("#delete-btn");

// State
let todos = [];

const url = "http://localhost:4730/todos";

function loadTodos() {
  fetch(url)
    .then((res) => res.json())
    .then((todosFromApi) => {
      todos = todosFromApi;
      renderTodos();
    });
}

function renderTodos() {
  const todoList = document.querySelector("#todo-list");
  todoList.innerHTML = "";

  const filteredTodos = todos.filter(checkFilterForTodo);
  filteredTodos.forEach((todo) => renderSingleTodo(todo));
}

function checkFilterForTodo(todo) {
  const filter = getCurrentFilter();

  // return true für offene Todos und false für erledigte Todos
  return (
    filter === "all" ||
    (filter === "open" && todo.done === false) ||
    (filter === "done" && todo.done === true)
  );
}

function renderSingleTodo(todo) {
  const todoList = document.querySelector("#todo-list");

  const li = document.createElement("li");

  const todoCheckbox = document.createElement("input");
  todoCheckbox.type = "checkbox";
  todoCheckbox.checked = todo.done;
  li.appendChild(todoCheckbox);

  const todoTextNode = document.createTextNode(todo.description);
  li.appendChild(todoTextNode);

  todoList.appendChild(li);
}

function getCurrentFilter() {
  // return open für offene Todos und done für erledigte Todos
  return document.querySelector('input[name="filter"]:checked').value;
}

addTodoBtn.addEventListener("click", function () {
  const newTodoInput = document.querySelector("#new-todo");
  const newTodo = {
    description: newTodoInput.value,
    done: false,
  };
  todos.push(newTodo);
  newTodoInput.value = "";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      todos.push(newTodoFromApi);
      renderTodos();
    });

  newTodoInput.value = "";
});

deleteBtn.addEventListener("click", () => {
  const todoList = document.querySelector("#todo-list");
  todos.forEach((todo) => {
    fetch("http://localhost:4730/todos/" + todo.id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {});
  });
  todoList.innerHTML = "";
});

const filters = document.querySelector("#filter");
filters.addEventListener("change", function (e) {
  // console.log("renderSingleTodo");
  renderTodos();
});

//const checkbox = document.querySelector("checkbox");
// console.log("checkbox: " + checkbox);
// checkbox.addEventListener("click", function () {
//   const checkboxValue = {
//     done: true,
//   };

//   fetch(url + "/" + todoCheckbox.id, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(checkboxValue),
//   })
//     .then((res) => res.json())
//     .then((newTodoFromApi) => {
//       todos.push(newTodoFromApi);
//       renderTodos();
//     });
// });

loadTodos();
