import { Component, OnInit } from '@angular/core';
import { Task } from '../task/task.type';
import { TaskService } from '../task/task.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  tasks: Task[] = [];

  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedTasks = this.tasks.filter(e => e.date == this.selectedDate);

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    })
  }

  getHighlightedDates(): any[] {
    return this.tasks.map(e =>
    ({
      date: e.date?.split('T')[0],
      //TODO : Rajouter la coloration des tâches via app locale + gérer les cas multiple tâches sur date
      textColor: e._textColor ?? "#09721b",
      backgroundColor: e._bgColor ?? "#c8e5d0"
    }));
  }

  onDateChange(event: any): void {
    this.selectedDate = event.detail.value;
    this.selectedTasks = this.tasks.filter(e => e.date == this.selectedDate);
  }

  toggleChecked(id: string) {
    console.log(`checking task id ${id}`)

    this.taskService.getTaskById(id).subscribe(task => {
      if (task) {
        this.taskService.updateTask({
          ...task,
          done: !(task.done)
        }).subscribe();
      }
    })
  }
}
