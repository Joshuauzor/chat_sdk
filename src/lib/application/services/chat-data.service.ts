import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ChatMemberModel } from '../../domain/models/chat-member.model';
import { ChatRoomModel } from '../../domain/models/chat-room.model';

@Injectable({
  providedIn: 'root'
})
export class ChatDataService<T> {
  private curentUser: ReplaySubject<ChatMemberModel<T>> = new ReplaySubject<ChatMemberModel<T>>(1);
  private interlocutor: Subject<ChatMemberModel<T>> = new Subject<ChatMemberModel<T>>();
  private currentChat: Subject<ChatRoomModel<T>> = new Subject<ChatRoomModel<T>>();
  curentUser$ = this.curentUser.asObservable();
  interlocutor$ = this.interlocutor.asObservable();
  currentChat$ = this.currentChat.asObservable();

  updateCurrentChat(chat: ChatRoomModel<T>): void {
    this.currentChat.next(chat);
  }

  updateCurrentUser(user: ChatMemberModel<T>): void {
    this.curentUser.next(user);
  }

  updateInterlocutor(user: ChatMemberModel<T>): void {
    this.interlocutor.next(user);
  }

}
