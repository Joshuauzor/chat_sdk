import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateMessagePipe } from './date-message.pipe';


@NgModule({
  declarations: [DateMessagePipe],
  imports: [
    CommonModule
  ],
  exports: [
    DateMessagePipe
  ]
})
export class DateMessageModule { }
