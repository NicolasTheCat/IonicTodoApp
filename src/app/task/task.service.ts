import { Injectable } from '@angular/core';
import { TaskCreateDTO, TaskUpdateDTO } from './task.dto';
import { Task } from './task.type';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  //TODO : Replace with data from a server
  private DUMMY_TASK: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description 1', date: '2025-01-01', score: 10, done: false },
    { id: 2, title: 'Task 2', description: 'Description 2', date: '2025-01-02', score: 20, done: true },
    { id: 3, title: 'Task 3', score: 15, done: false },
  ];

  constructor() { }

  createTask(taskCreateDTO: TaskCreateDTO): Task {
    const newTask: Task = {
      id: this.DUMMY_TASK.length > 0 ? Math.max(...this.DUMMY_TASK.map(t => t.id)) + 1 : 1,
      ...taskCreateDTO,
    };
    this.DUMMY_TASK.push(newTask);
    return newTask;
  }

  getTasks(): Task[] {
    return [...this.DUMMY_TASK];
  }

  getTaskById(id: number): Task | undefined {
    return this.DUMMY_TASK.find(task => task.id === id);
  }

  updateTask(taskUpdateDTO: TaskUpdateDTO): Task {
    const index = this.DUMMY_TASK.findIndex(task => task.id === taskUpdateDTO.id);
    if (index !== -1) {
      this.DUMMY_TASK[index] = { ...this.DUMMY_TASK[index], ...taskUpdateDTO };
      return this.DUMMY_TASK[index];
    } else {
      throw new Error("Cannot find task to update");
    }
  }


  deleteTask(id: number): boolean {
    const initialLength = this.DUMMY_TASK.length;
    this.DUMMY_TASK = this.DUMMY_TASK.filter(task => task.id !== id);
    return this.DUMMY_TASK.length < initialLength;
  }
}
