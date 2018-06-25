class User {
  constructor(obj) {
    this.id = obj.id;
    this.username = obj.username;
    this.projects = obj.projects;
    User.all.push(this);
  }

  initializeProjects() {
    projectContainer().innerHTML = "";
    this.projects.forEach(function(project) {
      getProject(project.id).then(json => {
        let project = new Project(json);
        project.renderProjectDiv();
      });
    });
  }
}

User.all = [];

User.login = function() {
  loginForm().reset();
  hideLoginFormDiv();
  currentUser.initializeProjects();
  revealProjectButton();
};
