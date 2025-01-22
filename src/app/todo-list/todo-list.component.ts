import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {

  tasks: { name: string, status: boolean }[] = [];
  newTask: string = '';
  sort: TaskSort = TaskSort.NONE;
  _sortEnum = TaskSort;

  constructor() { }

  getTasks() {
    switch (this.sort) {
      case TaskSort.COMPLETED: return this.tasks.filter(e => e.status === true);
      case TaskSort.UNCOMPLETED: return this.tasks.filter(e => e.status === false);
      default: return this.tasks
    }
  }

  addTask() {
    if (this.newTask.length > 0) {
      this.tasks.push({
        name: this.newTask.trim(),
        status: false
      });
      this.newTask = '';
    }
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }

}

enum TaskSort {
  NONE,
  COMPLETED,
  UNCOMPLETED
}
