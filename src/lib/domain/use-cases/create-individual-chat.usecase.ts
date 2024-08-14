import { Injectable } from '@angular/core';
import { UseCase } from '../base/use-case';
import { ChatRepository } from '../repository/chat.repository';
import { Observable } from 'rxjs';
import { SendMessageRequestModel } from '../models/requests/send-message-request.model';
import { ChatMemberModel } from '../models/chat-member.model';

@Injectable({
  providedIn: 'root'
})
export class CreateIndividualChat<T> implements UseCase<{ creator: ChatMemberModel<T>, interlocutor: ChatMemberModel<T> }, any> {
  constructor(private repository: ChatRepository<T>) { }
  execute(data: { creator: ChatMemberModel<T>, interlocutor: ChatMemberModel<T> }): Observable<any> {
    return this.repository.createIndividualChat(data.creator, data.interlocutor);
  }
}
