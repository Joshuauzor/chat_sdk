import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMemberModel } from '../../domain/models/chat-member.model';
import { CreateIndividualChat } from '../../domain/use-cases/create-individual-chat.usecase';

@Injectable({
  providedIn: 'root'
})

export class ChatService<T> {
  constructor(private CreateIndividualChat: CreateIndividualChat<T>) { }

  createChat(data: { creator: ChatMemberModel<T>, interlocutor: ChatMemberModel<T> }): Observable<void> {
    return this.CreateIndividualChat.execute(data);
  }
}
