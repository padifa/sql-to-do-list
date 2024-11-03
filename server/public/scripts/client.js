console.log("JS is sourced!");
let edit = false;
let editToDo = 0;
let toDos = 0;

function getToDos() {
  console.log("GETting todos from the server");
  // axios GET todos from the server and render them to the DOM
  axios({
    method: "GET",
    url: "/todos",
  }).then(function (response) {
    console.log(response);
    toDos = response.data;
    renderToDos(toDos);
  });
} // End getToDos

function changeStatus(toDoId) {
  // axios PUT, to update the status of the todos in the server
  axios({
    method: "PUT",
    url: `/todos/${toDoId}`,
  })
    .then(function (response) {
      getToDos();
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

function saveToDo(event) {
  // axios to save and update todos in the server
  event.preventDefault();
  console.log("The todos are being saved");

  const textVal = document.querySelector("[data-testid='toDoTextInput']").value;
  let isCompleteVal = document.getElementById("isComplete").checked;

  const newToDo = {
    text: textVal,
    isComplete: Boolean(isCompleteVal),
  };
  console.log(newToDo);

  if (edit) {
    axios({
      method: "PUT",
      url: `/todos/edit/${editToDo}`,
      data: newToDo,
    })
      .then(function (response) {
        getToDos();
      })
      .catch(function (error) {
        console.log("Error using PUT", error);
        alert("Cannot edit todo at this time.");
      });
  } else {
    axios({
      method: "POST",
      url: "/todos",
      data: newToDo,
    })
      .then((response) => {
        console.log(response);
        getToDos();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  document.querySelector("[data-testid='toDoTextInput']").value = "";
  document.getElementById("isComplete").checked = false;
}

function deleteToDo(toDoId) {
  // axios DELETE todos from the server
  let confirmDelete = confirm(
    "Do you really want to delete this from your list?"
  );
  if (confirmDelete) {
    axios({
      method: "DELETE",
      url: `/todos/${toDoId}`,
    })
      .then(function (response) {
        getToDos();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    alert("Deletion cancelled");
  }
}

function renderToDos(toDos) {
  let toDoTable = document.getElementById("viewToDos");
  toDoTable.innerHTML = "";

  for (let todo of toDos) {
    toDoTable.innerHTML += `
          <tr>
            <td>${todo.text}</td>
            <td>
              <input type="checkbox" id="isComplete" ${
                todo.isComplete ? "checked" : ""
              }>
            </td>
            <td><button class="btn btn-danger" onClick="deleteToDo(${
              todo.id
            })">Delete</button></td>
            <td><button class="btn btn-info" onClick="changeStatus(${
              todo.id
            })">Change Status</button></td>
            
      `;
  }
}

function search(event) {
  event.preventDefault();
  let searchElement = document.getElementById("search-term");
  let searchTerm = searchElement.value;

  axios({
    method: "GET",
    url: `/todos`,
  })
    .then(function (response) {
      let toDos = response.data;
      let toDos2 = [];
      for (let todo of toDos) {
        for (let key of Object.values(todo)) {
          if (String(key).includes(searchTerm)) {
            toDos2.push(todo);
          }
        }
      }
      if (toDos2.length > 0) {
        renderToDos(toDos2);
      } else {
        getToDos();
      }
    })
    .catch((err) => console.error(err));
}

getToDos();
