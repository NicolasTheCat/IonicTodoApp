import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  tasks: any[] = [
    {
      id: 1,
      date: "2025-01-15",
      description: "Test",
      title: "Tâche test",
      score: 5,
      done: false
    }
  ];

  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedTasks = this.tasks.filter(e => e.date == this.selectedDate);

  constructor() { }

  ngOnInit(): void {
    //Subscribe to task observable from service
  }

  getHighlightedDates(): any[] {
    return this.tasks.map(e =>
    ({
      date: e.date.split('T')[0],
      textColor: e._textColor || "#09721b",
      backgroundColor: e._bgColor || "#c8e5d0"
    }));
  }

  onDateChange(event: any): void {
    this.selectedDate = event.detail.value;
    this.selectedTasks = this.tasks.filter(e => e.date == this.selectedDate);
  }

  toggleChecked(id: number) {
    console.log(`checking task id ${id}`)
    //Call task service and toggle it
  }
}
