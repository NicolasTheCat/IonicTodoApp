import { Injectable } from '@angular/core';
import { TaskCreateDTO, TaskUpdateDTO } from './task.dto';
import { Task } from './task.type';
import { StorageService } from '../storage.service';
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from '../api.service';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _syncQueue: { action: 'NEW' | 'UPDATE' | 'DELETE', task: Task | string }[] = [];
  private _syncTimerRef: number | null = null;

  constructor(
    private storageService: StorageService,
    private apiService: ApiService
  ) { }

  /**
   * Crée une nouvelle tâche.
   * 
   * La tâche sera premièrement stockée dans le local storage puis envoyée à l'api une fois une connexion établie.
   * @param taskCreateDTO - Les données nécessaires à la création de la tâche.
   * @returns Un Observable contenant la tâche créée.
   */
  createTask(taskCreateDTO: TaskCreateDTO): Observable<Task> {
    const newTask: Task = {
      uuid: uuidv4(),
      ...taskCreateDTO,
    };

    return this.getTasks().pipe(
      map((tasks) => {
        this.storageService.set('TASKS', [...tasks, newTask]);
        this._syncQueue.push({ action: 'NEW', task: newTask });
        this.attemptToSync();
        return newTask;
      })
    );
  }

  /**
   * Récupère toutes les tâches, premièrement par le local storage, puis par l'API si le local storage est vide.
   * 
   * TODO : permettre la récupération de tâches créées dans d'autres contextes d'applications (synchro app/browser).
   * @returns Un Observable contenant la liste des tâches.
   */
  getTasks(): Observable<Task[]> {
    return from(this.storageService.get<Task[]>('TASKS')).pipe(
      switchMap((tasks) => {
        if (tasks) {
          return of(tasks);
        } else {
          return this.apiService.get<Task[]>('tasks').pipe(
            map((apiTasks) => {
              this.storageService.set('TASKS', apiTasks);
              return apiTasks;
            }),
            catchError(() => of([]))
          );
        }
      })
    );
  }

  /**
   * Récupère une tâche par son UUID.
   * @param uuid - L'identifiant unique de la tâche.
   * @returns Un Observable contenant la tâche ou `undefined` si elle n'existe pas.
   */
  getTaskById(uuid: string): Observable<Task | undefined> {
    return this.getTasks().pipe(
      map((tasks) => tasks.find((e) => e.uuid === uuid) || undefined),
      switchMap((task) => {
        if (task) {
          return of(task);
        } else {
          return this.apiService.get<Task>(`tasks/${uuid}`).pipe(
            switchMap((apiTask) =>
              this.getTasks().pipe(
                map((tasks) => {
                  this.storageService.set('TASKS', [...tasks, apiTask]);
                  return apiTask;
                })
              )
            ),
            catchError(() => of(undefined))
          );
        }
      })
    );
  }

  /**
   * Met à jour une tâche existante.
   * 
   * La tâche sera premièrement mise à jour dans le local storage puis envoyée à l'api une fois une connexion établie.
   * @param taskUpdateDTO - Les données à mettre à jour pour la tâche.
   * @returns Un Observable contenant la tâche mise à jour.
   */
  updateTask(taskUpdateDTO: TaskUpdateDTO): Observable<Task> {
    return this.getTasks().pipe(
      map((tasks) => {
        const taskIndex = tasks.findIndex((e) => e.uuid === taskUpdateDTO.uuid);

        if (taskIndex < 0) {
          throw new Error('Provided task does not exist');
        }

        tasks[taskIndex] = { ...tasks[taskIndex], ...taskUpdateDTO };
        this.storageService.set('TASKS', tasks);

        this._syncQueue.push({ action: 'UPDATE', task: taskUpdateDTO });
        this.attemptToSync();

        return tasks[taskIndex];
      })
    );
  }

  /**
   * Supprime une tâche selon son UUID.
   * 
   * La tâche sera premièrement supprimée dans le local storage puis envoyée à l'api une fois une connexion établie.
   * @param uuid - L'identifiant unique de la tâche.
   * @returns Un Observable contenant la tâche supprimée.
   */
  deleteTask(uuid: string): Observable<Task> {
    return this.getTasks().pipe(
      map((tasks) => {
        const taskIndex = tasks.findIndex((e) => e.uuid === uuid);
        const task = tasks[taskIndex]

        if (taskIndex < 0) {
          throw new Error('Provided task does not exist');
        }

        const updatedTasks = [...tasks.slice(0, taskIndex), ...tasks.slice(taskIndex + 1)];
        this.storageService.set('TASKS', updatedTasks);

        this._syncQueue.push({ action: 'DELETE', task: uuid });
        this.attemptToSync();

        return task;
      })
    );
  }

  /**
   * Tente de synchroniser les tâches selon la liste présente dans `_syncQueue`.
   * 
   * Tant qu'une connexion n'est pas disponible, après avoir appellé cette fonction, elle sera lancée toutes les 10 secondes jusqu'à la récupération d'une connexion.
   */
  private attemptToSync() {
    if (navigator.onLine) {
      if (this._syncTimerRef) {
        clearInterval(this._syncTimerRef)
      }

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
