import { Injectable } from '@angular/core';
import { TaskCreateDTO, TaskUpdateDTO } from './task.dto';
import { Task } from './task.type';
import { StorageService } from '../storage.service';
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  _syncQueue: { action: 'NEW' | 'UPDATE' | 'DELETE', task: Task | string }[] = [];
  _syncTimerRef: number | null = null;

  constructor(
    private storageService: StorageService,
    private apiService: ApiService
  ) { }

  async createTask(taskCreateDTO: TaskCreateDTO): Promise<Task> {
    const newTask: Task = {
      uuid: uuidv4(),
      ...taskCreateDTO,
    };

    const tasks = await this.getTasks();

    this.storageService.set("TASKS", [...tasks, newTask]);

    this._syncQueue.push({ action: 'NEW', task: newTask });

    this.attemptToSync();

    return newTask;
  }

  async getTasks(): Promise<Task[]> {
    let tasks = await this.storageService.get<Task[]>("TASKS");
    if (tasks) return tasks;
    return [];
  }

  async getTaskById(uuid: string): Promise<Task | undefined> {
    const tasks = await this.getTasks();
    return tasks.find(e => e.uuid === uuid);
  }

  async updateTask(taskUpdateDTO: TaskUpdateDTO): Promise<Task> {
    let tasks = await this.getTasks();
    let taskIndex = tasks.findIndex(e => e.uuid == taskUpdateDTO.uuid);

    if (!taskIndex) {
      throw new Error('Provided task does not exist')
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...taskUpdateDTO };

    this.storageService.set("TASKS", tasks);

    this._syncQueue.push({ action: 'UPDATE', task: taskUpdateDTO });

    this.attemptToSync();

    return tasks[taskIndex];
  }

  async deleteTask(uuid: string): Promise<boolean> {
    let tasks = await this.getTasks();
    let taskIndex = tasks.findIndex(e => e.uuid == uuid);

    if (taskIndex < 0) {
      throw new Error('Provided task does not exist')
    }

    tasks = [...tasks.slice(0, taskIndex), ...tasks.slice(taskIndex + 1)]

    this.storageService.set("TASKS", tasks);

    this._syncQueue.push({ action: 'DELETE', task: uuid })

    this.attemptToSync();

    return true;
  }

  private attemptToSync() {
    if (navigator.onLine) {
      for (const [i, update] of this._syncQueue.entries()) {
        switch (update.action) {
          case 'NEW':
            console.log(update)
            this.apiService.post('task', update.task).subscribe(e => {
              this._syncQueue = this._syncQueue.slice(0, i).concat(this._syncQueue.slice(i + 1));
            });
            break;

          case 'UPDATE':
            console.log(update)
            this.apiService.put(`task`, update.task).subscribe(e => {
              this._syncQueue = this._syncQueue.slice(0, i).concat(this._syncQueue.slice(i + 1));
            });
            break;

          case 'DELETE':
            console.log(update)
            if (typeof update.task != 'string') {
              throw new Error('Tried to delete a task, but supplied something other than an uuid')
            }
            this.apiService.delete(`task/${update.task}`).subscribe(e => {
              this._syncQueue = this._syncQueue.slice(0, i).concat(this._syncQueue.slice(i + 1));
            });
            break;
        }
      }
    } else if (this._syncTimerRef != null) {
      this._syncTimerRef = (setInterval(this.attemptToSync, 10000) as unknown) as number;
    }
  }
}
