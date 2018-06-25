class Task {
  constructor(obj) {
    this.id = obj.id;
    this.user_id = obj.user_id;
    this.project_id = obj.project_id;
    this.due_date = obj.due_date;
    this.description = obj.description;
    this.status = obj.status;
    Task.all.push(this);
  }

  append(element) {
    element.appendChild(this.returnListElement());
    componentHandler.upgradeElements(element);
  }

  // Build List Element
  returnListElement() {
    let li = document.createElement("li");
    li.setAttribute("data-taskid", this.id);
    li.id = `list-item-${this.id}`;
    li.className = "mdl-list__item";
    li.draggable = "true";
    li.contenteditable = "false";
    this.addListElementListeners(li);
    li.appendChild(this.returnTitleSpan());
    li.appendChild(this.returnSwitchButtonSpan());
    return li;
  }

  returnTitleSpan() {
    let span = document.createElement("span");
    if (this.status === "Completed") {
      span.style["text-decoration"] = "line-through";
    }
    span.className = "mdl-list__item-primary-content";
    this.addTaskTitleListeners(span);
    span.innerText = this.description;
    return span;
  }

  returnSwitchButtonSpan() {
    let switchButtonSpan = document.createElement("span");
    switchButtonSpan.className = "mdl-list__item-secondary-action";
    switchButtonSpan.appendChild(this.returnSwitchButtonLabel());
    return switchButtonSpan;
  }

  returnSwitchButtonLabel() {
    let switchButtonLabel = document.createElement("label");
    switchButtonLabel.className =
      "mdl-switch mdl-js-switch mdl-js-ripple-effect";
    switchButtonLabel.setAttribute("for", `switch-1-task-${this.id}`);
    switchButtonLabel.appendChild(this.returnSwitchButton());
    return switchButtonLabel;
  }

  returnSwitchButton() {
    let switchButton = document.createElement("input");
    switchButton.id = `switch-1-task-${this.id}`;
    switchButton.className = "mdl-switch__input";
    switchButton.type = "checkbox";
    if (this.status === "Completed") {
      switchButton.checked = true;
    } else {
      switchButton.checked = false;
    }
    this.addSwitchButtonListeners(switchButton);
    return switchButton;
  }

  //Listeners
  addListElementListeners(li) {
    li.addEventListener("dragstart", e => taskDrag(e), false);
  }

  addTaskTitleListeners(taskTitle) {
    taskTitle.addEventListener("dblclick", () => {
      taskTitle.setAttribute("contenteditable", "true");
    });
    taskTitle.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        this.saveDescription(taskTitle);
      }
    });
    taskTitle.addEventListener("blur", () => {
      this.saveDescription(taskTitle);
    });
  }

  addSwitchButtonListeners(checkBox) {
    checkBox.addEventListener("change", e => {
      setTimeout(() => {
        if (e.target.checked === true) {
          this.status = "Completed";
          this.project.appendActiveTasks();
          patchTask(this);
        } else {
          this.status = "Active";
          this.project.appendCompletedTasks();
          patchTask(this);
        }
      }, 250);
    });
  }

  saveDescription(taskTitle) {
    taskTitle.setAttribute("contenteditable", "false");
    this.description = taskTitle.innerText;
    patchTask(this);
  }
}

Task.all = [];
