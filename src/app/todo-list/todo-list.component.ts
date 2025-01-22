import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordion, IonModal } from '@ionic/angular';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task.type';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  tasks: Task[] = [];

  taskInput: string = '';
  descInput: string = '';
  scoreInput: number = 0;
  hasDateInput: boolean = false;
  dateInput: string = '';
  sort: TaskSort = TaskSort.NONE;

  _sortEnum = TaskSort;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }

  getTasks() {
    this.tasks = this.taskService.getTasks();
    switch (this.sort) {
      case TaskSort.COMPLETED: return this.tasks.filter(e => e.done === true);
      case TaskSort.UNCOMPLETED: return this.tasks.filter(e => e.done === false);
      default: return this.tasks;
    }
  }

  modalCancel() {
    this.modal.dismiss(null, 'cancel');
  }

  modalConfirm() {
    this.taskService.createTask({
      title: this.taskInput,
      score: this.scoreInput,
      description: this.descInput,
      date: this.hasDateInput ? this.dateInput.split("T")[0] : undefined,
      done: false
    })

    console.log(this.taskService.getTasks());

    this.modal.dismiss(this.taskInput, 'confirm');
  }

  removeTask(id: number) {
    this.taskService.deleteTask(id)
  }

}

enum TaskSort {
  NONE,
  COMPLETED,
  UNCOMPLETED
}
