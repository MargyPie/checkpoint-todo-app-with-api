const addTodoBtn = document.querySelector("#add-todo");
const deleteBtn = document.querySelector("#delete-btn");
const newTodoInput = document.querySelector("#new-todo");

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
  //   todos.forEach((todo) => {
  //     const newLi = document.createElement("li");
  //     const todoText = document.createTextNode(todo.description);
  //     newLi.appendChild(todoText);
  //     todoList.appendChild(newLi);
  //   });
}

function checkFilterForTodo(todo) {
  const filter = getCurrentFilter();

  return (
    filter === "all" ||
    (filter === "open" && todo.done === false) ||
    (filter === "done" && todo.done === true)
  );
}

function renderSingleTodo(todo) {
  const todoList = document.querySelector("#todo-list");
  const filters = document.querySelector("#filter");
  filters = addEventListener("change", function (e) {
    console.log("renderSingleTodo");
    renderTodo();
  });
}

function getCurrentFilter() {
  return document.querySelector('input[name="filter"]:checked').value;
}

addTodoBtn.addEventListener("click", () => {
  const newTodoText = newTodoInput.value;
  const newTodo = {
    description: newTodoText,
    done: false,
  };

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

loadTodos();
