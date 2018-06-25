console.log("Index.js loaded");

//Global Variables and Functions

let currentUser;

function projectContainer() {
  return document.getElementById("projects");
}

function projectFormContainer() {
  return document.getElementById("new-project");
}

function loginForm() {
  return document.querySelector("#login-form");
}

function newUserForm() {
  return document.querySelector("#create-user-form");
}

function loginFormDiv() {
  return document.querySelector("#login-form-div");
}

function loginData() {
  return document.querySelector("#login-input").value;
}

function newUserData() {
  return document.querySelector("#create-user-input").value;
}

function projectData() {
  return document.querySelector('input[name="project"]').value;
}

function projectButton() {
  return document.querySelector(".project-button");
}

function hideProjectButton() {
  projectButton().style.display = "none";
}

function revealProjectButton() {
  projectButton().style.display = "";
}

function hideLoginFormDiv() {
  loginFormDiv().style.display = "none";
}

function loginFormListener() {
  loginForm().addEventListener("submit", function (e) {
    e.preventDefault();
    currentUser = User.all.find(function (user) {
      return user.username === loginData();
    });
    if (currentUser) {
      User.login();
    }
  });
}

function newUserFormListener() {
  newUserForm().addEventListener("submit", function (e) {
    e.preventDefault();
    postUser(newUserData()).then(json => {
      console.log(json);
      if (json.status === "error") {
        alert("username has already been taken")
      } else {
        currentUser = new User(json);
        User.login();
      }
    });
  });
}

function projectButtonListener() {
  projectButton().addEventListener("click", e => {
    e.preventDefault();
    let data = {
      title: "New Project Title"
    };
    postProject(data).then(json => {
      let project = new Project(json);
      let userProjectData = {
        project_id: json.id,
        user_id: currentUser.id
      };
      postUserProject(userProjectData);
      project.renderProjectDiv();
    });
  });
}

//Initialize
function initialize() {
  hideProjectButton();
  getUsers().then(json => {
    json.forEach(userData => {
      let user = new User(userData);
    });
  });
  loginFormListener();
  newUserFormListener();
  projectButtonListener();
}

document.addEventListener("DOMContentLoaded", initialize);