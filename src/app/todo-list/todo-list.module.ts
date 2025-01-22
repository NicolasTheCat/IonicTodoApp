import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TodoListComponent } from './todo-list.component';
import { TodoListRoutingModule } from './todo-list-routing.module';



@NgModule({
  declarations: [TodoListComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodoListRoutingModule
  ]
})
export class TodoListModule { }
