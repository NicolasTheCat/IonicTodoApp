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
    this.taskService.getTasks().then(e => this.tasks = e);
  }

  async getTasks() {
    this.tasks = await this.taskService.getTasks();
    switch (this.sort) {
      case TaskSort.COMPLETED: return this.tasks.filter(e => e.done === true);
      case TaskSort.UNCOMPLETED: return this.tasks.filter(e => e.done === false);
      default: return this.tasks;
    }
  }

  modalCancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async modalConfirm() {
    await this.taskService.createTask({
      title: this.taskInput,
      score: this.scoreInput,
      description: this.descInput,
      date: this.hasDateInput ? this.dateInput.split("T")[0] : undefined,
      done: false
    })

    this.getTasks();

    this.modal.dismiss(this.taskInput, 'confirm');
  }

  async removeTask(id: string) {
    await this.taskService.deleteTask(id);
    this.getTasks();
  }

}

enum TaskSort {
  NONE,
  COMPLETED,
  UNCOMPLETED
}
