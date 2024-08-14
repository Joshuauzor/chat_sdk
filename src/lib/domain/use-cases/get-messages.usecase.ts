import { Injectable } from '@angular/core';
import { UseCase } from '../base/use-case';
import { ChatRepository } from '../repository/chat.repository';
import { Observable } from 'rxjs';
import { ChatRoomModel } from '../models/chat-room.model';
import { ChatMessageModel } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class GetMessages<T> implements UseCase<string, ChatMessageModel []> {
  constructor(private repository: ChatRepository<T>) { }
  execute(chatId: string): Observable<ChatMessageModel []> {
    return this.repository.getMessages(chatId);
  }
}
