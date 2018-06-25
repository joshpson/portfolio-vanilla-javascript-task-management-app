class Project {
  //Initialization
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.status = "Active";
    this.tasks = this.createTasks(obj);
    Project.all.push(this);
  }

  createTasks(obj) {
    let taskArray = [];
    obj.tasks.forEach(taskData => {
      let task = new Task(taskData);
      task.project = this;
      taskArray.push(task);
    });
    return taskArray;
  }

  //Task
  removeTask(task) {
    let index = this.tasks.indexOf(task);
    this.tasks.splice(index, index + 1);
  }

  //Project Card Creation

  renderProjectDiv() {
    let projectDiv = this.returnProjectDiv();
    projectContainer().appendChild(projectDiv);
    this.appendActiveTasks();
    componentHandler.upgradeElements(projectDiv);
  }

  returnProjectDiv() {
    let projectDiv = document.createElement("div");
    projectDiv.className = "mdl-cell mdl-cell--4-col";
    let card = document.createElement("div");
    card.setAttribute("id", `project-${this.id}-div`);
    card.className = " mdl-card mdl-shadow--2dp dropzone";
    card.appendChild(this.returnProjectTitleDiv());
    card.appendChild(this.returnTasksUl());
    card.appendChild(this.returnNewTaskForm());
    card.appendChild(this.returnProjectDeleteBtn(card));
    this.addProjectDragListeners(card);
    projectDiv.appendChild(card);
    return projectDiv;
  }

  returnProjectTitleDiv() {
    let projectTitleDiv = document.createElement("div");
    projectTitleDiv.className = "mdl-card__title";
    projectTitleDiv.appendChild(this.returnProjectTitleH2());
    projectTitleDiv.appendChild(this.returnProjectOptionsButton());
    projectTitleDiv.appendChild(this.returnOptionsDropdown());
    return projectTitleDiv;
  }

  returnProjectTitleH2() {
    let h2 = document.createElement("h2");
    h2.className = "mdl-card__title-text mdl-card--border";
    h2.innerText = this.title;
    this.addProjectTitleListeners(h2);
    return h2;
  }

  returnProjectOptionsButton() {
    let optionsButton = document.createElement("button");
    optionsButton.id = `demo-menu-lower-right-project-${this.id}`;
    optionsButton.className = "mdl-button mdl-js-button mdl-button--icon";
    let cardI = document.createElement("i");
    cardI.className = "material-icons";
    cardI.innerText = "more_vert";
    optionsButton.appendChild(cardI);
    return optionsButton;
  }

  returnOptionsDropdown() {
    let projOptionsUl = document.createElement("ul");
    projOptionsUl.className =
      "mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect";
    projOptionsUl.setAttribute(
      "for",
      `demo-menu-lower-right-project-${this.id}`
    );
    projOptionsUl.appendChild(this.returnAlphaSortOption());
    projOptionsUl.appendChild(this.returnActiveSortOption());
    projOptionsUl.appendChild(this.returnCompletedSortOption());
    return projOptionsUl;
  }

  returnTasksUl() {
    let ul = document.createElement("ul");
    ul.setAttribute("id", `project-${this.id}-ul`);
    ul.setAttribute("data-projectid", this.id);
    ul.className = "mdl-list task-ul";
    return ul;
  }

  returnNewTaskForm() {
    let formDiv = document.createElement("div");
    let form = document.createElement("form");
    let input = document.createElement("input");
    formDiv.className = "mdl-card__supporting-text";
    input.className = "mdl-textfield__input";
    input.type = "text";
    input.placeholder = "Create New Task...";
    formDiv.appendChild(form);
    form.appendChild(input);
    this.addNewTaskFormListener(form, input);
    return formDiv;
  }

  returnProjectDeleteBtn(div) {
    let buttonDiv = document.createElement("div");
    buttonDiv.className = "mdl-card__actions mdl-card--border";
    let deleteBtn = document.createElement("BUTTON");
    deleteBtn.className =
      "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", e => {
      deleteProject(this);
      div.parentElement.remove();
    });
    buttonDiv.appendChild(deleteBtn);
    return buttonDiv;
  }

  //Project Options

  returnAlphaSortOption() {
    let alphaSort = document.createElement("li");
    alphaSort.className = "mdl-menu__item";
    alphaSort.innerText = "sort a-z";
    alphaSort.addEventListener("click", e => {
      this.sortTasksAlphabetically();
      if (this.status === "Active") {
        this.appendActiveTasks();
      } else {
        this.appendCompletedTasks();
      }
    });
    return alphaSort;
  }

  returnCompletedSortOption() {
    let completedSort = document.createElement("li");
    completedSort.className = "mdl-menu__item";
    completedSort.innerText = "completed";
    completedSort.addEventListener("click", e => {
      this.status = "Completed";
      this.appendCompletedTasks();
    });
    return completedSort;
  }

  returnActiveSortOption() {
    let activeSort = document.createElement("li");
    activeSort.className = "mdl-menu__item";
    activeSort.innerText = "active";
    activeSort.addEventListener("click", e => {
      this.status = "Active";
      this.appendActiveTasks();
    });
    return activeSort;
  }

  //Project Listeners

  addProjectTitleListeners(title) {
    title.addEventListener("dblclick", () => {
      title.setAttribute("contenteditable", "true");
    });
    title.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        console.log(e);
        this.saveTitle(title);
      }
    });
    title.addEventListener("blur", () => {
      this.saveTitle(title);
    });
  }

  addProjectDragListeners(card) {
    card.addEventListener("dragenter", e => projectDragEnter(e), false);
    card.addEventListener("dragleave", e => projectDragLeave(e), false);
    card.addEventListener("dragover", e => projectDragOver(e), false);
    card.addEventListener("drop", e => taskDrop(e, this), false);
  }

  addNewTaskFormListener(form, input) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      let data = {
        description: input.value,
        project_id: this.id,
        user_id: currentUser.id
      };
      postTask(data).then(json => {
        let task = new Task(json);
        this.tasks.push(task);
        task.project = this;
        this.appendActiveTasks();
      });
      form.reset();
    });
  }

  saveTitle(title) {
    title.setAttribute("contenteditable", "false");
    this.title = title.innerText;
    patchProject(this);
  }

  //Project Task Manipulation

  appendActiveTasks() {
    let ul = document.getElementById(`project-${this.id}-ul`);
    ul.innerHTML = "";
    this.tasks.forEach(function(task) {
      if (task.status != "Completed") {
        task.append(ul);
      }
    });
  }

  appendCompletedTasks() {
    let ul = document.getElementById(`project-${this.id}-ul`);
    ul.innerHTML = "";
    this.tasks.forEach(function(task) {
      if (task.status === "Completed") {
        task.append(ul);
      }
    });
  }

  sortTasksAlphabetically() {
    this.tasks.sort(function(a, b) {
      if (a.description.toUpperCase() < b.description.toUpperCase()) return -1;
      if (a.description.toUpperCase() > b.description.toUpperCase()) return 1;
      return 0;
    });
  }
}

Project.all = [];
