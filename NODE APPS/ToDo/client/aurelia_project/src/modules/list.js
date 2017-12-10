import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from 'aurelia-auth';
import { ToDos } from '../resources/data/todos';


@inject(Router, AuthService, ToDos)
export class List {
  constructor(router, auth, todos) {
    this.router = router;
    this.auth = auth;
    this.todos = todos;

    this.message = 'List';
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.showList = true;
    this.priorities = ['Low', 'Medium', 'High', 'Critical']
    this.showCompleted = false;
  }

  editTodo(todo) {
    this.todoObj = todo;
    this.showList = false;
  }

  async saveTodo() {
    if (this.todoObj) {
      let response = await this.todos.save(this.todoObj);
      if (response.error) {
        alert("There was an error creating the ToDo");
      } else {
        var todoId = response._id;
        if (this.filesToUpload && this.filesToUpload.length) {
          await this.todos.uploadFile(this.filesToUpload, this.user._id, todoId);
          this.filesToUpload = [];
        }
      }
      this.showList = true;
    }
  }



  async activate() {
    console.log(this.todos) 
    await this.todos.getUserTodo(this.user._id);
  }


  createTodo() {
    this.todoObj = {
      todo: "",
      description: "",
      dateDue: new Date(),
      user: this.user._id,
      priority: this.priorities[0]
    }
    this.showList = false;
  }

  toggleShowCompleted() {
    this.showCompleted = !this.showCompleted;
  }

  uploadFile(files, userId, todoId) {
    let formData = new FormData();
    files.forEach((item, index) => {
      formData.append("file" + index, item);
    });

    let response = this.data.uploadFiles(formData, this.TODO_SERVICE + "/upload/" + userId + "/" + todoId);
    return response;
  }

  deleteTodo(todo) {
    this.todos.deleteTodo(todo._id);
  }

  completeTodo(todo) {
    todo.completed = !todo.completed;
    this.todoObj = todo;
    this.saveTodo();
  }


  changeFiles() {
    this.filesToUpload = new Array();
    this.filesToUpload.push(this.files[0]);
  }

  removeFile(index) {
    this.filesToUpload.splice(index, 1);
  }


  logout() {
    sessionStorage.removeItem('user');
    this.auth.logout();


  }
  
  back(){
    this.showList = true;
  }

}