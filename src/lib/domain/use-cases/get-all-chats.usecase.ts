import { Injectable } from '@angular/core';
import { UseCase } from '../base/use-case';
import { ChatRepository } from '../repository/chat.repository';
import { Observable } from 'rxjs';
import { ChatRoomModel } from '../models/chat-room.model';

@Injectable({
  providedIn: 'root'
})
export class GetAllChats<T> implements UseCase<any, ChatRoomModel<T> []> {
  constructor(private repository: ChatRepository<T>) { }
  execute(): Observable<ChatRoomModel<T> []> {
    return this.repository.getAllChats();
  }
}
