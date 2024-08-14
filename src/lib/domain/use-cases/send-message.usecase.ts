import { Injectable } from '@angular/core';
import { UseCase } from '../base/use-case';
import { ChatRepository } from '../repository/chat.repository';
import { Observable } from 'rxjs';
import { SendMessageRequestModel } from '../models/requests/send-message-request.model';

@Injectable({
  providedIn: 'root'
})
export class SendMessage<T> implements UseCase<SendMessageRequestModel, any> {
  constructor(private repository: ChatRepository<T>) { }
  execute(data: SendMessageRequestModel): Observable<any> {
    return this.repository.sendMessage(data);
  }
}
