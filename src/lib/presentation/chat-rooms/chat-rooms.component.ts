import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatMemberModel } from '../../domain/models/chat-member.model';
import { ChatRoomModel } from '../../domain/models/chat-room.model';
import { ChatDataService } from '../../application/services/chat-data.service';
import { GetChats } from '../../domain/use-cases/get-chats.usecase';
import { take, takeUntil } from 'rxjs/operators';
import { UpdateReadMessages } from '../../domain/use-cases/update-read-messages.usecase';
import { GetAllChats } from '../../domain/use-cases/get-all-chats.usecase';

@Component({
  selector: 'std-chat-rooms',
  exportAs: 'stdChatRooms',
  template: `
    <div class="std-chat-search-container">
      <input [(ngModel)]="searchRooms" [placeholder]="'Buscar...'" (ngModelChange)="searchChange($event)">
    </div>
    <ul *ngIf="chatRoomFiltered" class="std-chat-rooms">
      <ng-container *ngFor="let item of chatRoomFiltered">
        <li class="std-chat-rooms-container" [ngClass]="{'selected': currentChat === item}" (click)="changeSelectedChat(item)">
          <div class="std-chat-rooms-avatar">
            <ng-container *ngIf="getAvatarUrl(item);else templateDefault">
              <std-chat-avatar [src]="getAvatarUrl(item)"></std-chat-avatar>
            </ng-container>
            <ng-template #templateDefault>
              <ng-template [ngTemplateOutlet]="avatarDefault"></ng-template>
            </ng-template>
          </div>
          <div>
            <div class="std-chat-rooms-header">
              <div class="std-chat-rooms-title">
                <h3>{{ getOtherUser(item).fullName }}</h3>
              </div>
            </div>
            <div class="std-chat-rooms-content">
              <div class="std-chat-rooms-text">
                {{ item.lastMessage?.content ? item.lastMessage?.content :  item.lastMessage?.media?.fileName ?  item.lastMessage?.media?.fileName : 'No hay mensajes...'   }}
              </div>
              <div class="std-chat-rooms-count-msg" *ngIf="(item.totalMessages && getOwnerMember(item).readMessages) && item.totalMessages - getOwnerMember(item).readMessages > 0">
                {{ item.totalMessages - getOwnerMember(item).readMessages }}
              </div>
            </div>
          </div>
          <div class="std-chat-rooms-time">
            <ng-container *ngIf="item.lastMessage?.createdAt">
              {{ getDateMessage(item?.lastMessage?.createdAt) | dateMessage }}
            </ng-container>
          </div>
        </li>
        <hr>
      </ng-container>
    </ul>

    <ng-container *ngIf="chatRoom.length < 1">
      <ng-container *ngTemplateOutlet="emptyData"></ng-container>
    </ng-container>
  `,
  styleUrls: ['./chat-rooms.component.scss']
})

export class ChatRoomsComponent<T> implements OnInit, OnDestroy {
  @Input() emptyData!: TemplateRef<void>;
  @Input() avatarDefault!: TemplateRef<void>;
  private destroy$: Subject<void> = new Subject<void>();

  chatRoom: ChatRoomModel<T> [] = [];
  chatRoomFiltered: ChatRoomModel<T> [] = [];
  currentUser!: ChatMemberModel<T>;
  otherUser!: ChatMemberModel<T>;
  currentChat!: ChatRoomModel<T>;
  searchRooms!: string;

  constructor(
    private ChatDataService: ChatDataService<T>,
    private getChats: GetChats<T>,
    private updateReadMessage: UpdateReadMessages<T>,
    private getAllChats: GetAllChats<T>
  ) {
    this.ChatDataService.curentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currentUser: ChatMemberModel<T>) => {
          this.currentUser = currentUser
          this.getChatForUser();
        }
      })
  }

  changeSelectedChat(chat: ChatRoomModel<T>): void {
    this.currentChat = chat;
    this.ChatDataService.updateCurrentChat(chat);
    this.updateReadMessages(chat);
  }

  searchChange(str: string): void {
    if (str) {
      this.chatRoomFiltered = this.chatRoom.filter(f => {
        return Object.values(f.members).filter(m => m.fullName.includes(str)).length
      })
    } else {
      this.chatRoomFiltered = [...this.chatRoom];
    }
  }

  ngOnInit() {

  }

  updateReadMessages(data: ChatRoomModel<T>): void {
    this.updateReadMessage.execute(data)
      .pipe(take(1))
      .subscribe({
        next: () => { }
      })
  }

  getOtherUser(chat: ChatRoomModel<T>): ChatMemberModel<T> {
    return Object.values(chat.members).find( f => f.id !== this.currentUser.id) as ChatMemberModel<T>;
  }

  getOwnerMember(chat: ChatRoomModel<T>): ChatMemberModel<T> {
    return Object.values(chat.members).find( f => f.id === this.currentUser.id) as ChatMemberModel<T>;
  }

  getDateMessage(date: any): number {
    if (date) return date.getTime();
    return 0;
  }

  getAvatarUrl(chat: ChatRoomModel<T>): string {
    const src = this.getOtherUser(chat).photoUrl;
    return  src ? src : '';
  }

  getChatForUser(): void {
    this.getChats.execute()
    .subscribe( {
      next: (data: ChatRoomModel<T> []) => {
        this.chatRoom = [...data];
        this.chatRoomFiltered = [...data];
        if (this.currentChat) {
          const chat = data.find(f => f.id === this.currentChat.id);
          const member = chat?.members[this.currentUser.id];
          if (chat && member && this.currentChat.totalMessages > member.readMessages) {
            this.updateReadMessages(chat);
          }
          this.currentChat = chat ?? this.currentChat;
        }
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
   }
}
