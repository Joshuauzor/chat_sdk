import { Injectable } from '@angular/core';
import { UseCase } from '../base/use-case';
import { ChatRepository } from '../repository/chat.repository';
import { Observable } from 'rxjs';
import { ChatRoomModel } from '../models/chat-room.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateReadMessages<T> implements UseCase<ChatRoomModel<T>, void> {
  constructor(private repository: ChatRepository<T>) { }
  execute(data: ChatRoomModel<T>): Observable<void> {
    return this.repository.updateReadMessage(data);
  }
}
