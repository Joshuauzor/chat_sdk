import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, Input, TemplateRef, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ChatDataService } from '../../application/services/chat-data.service';
import { ChatRoomModel } from '../../domain/models/chat-room.model';
import { min, switchMap, takeUntil } from 'rxjs/operators';
import { GetMessages } from '../../domain/use-cases/get-messages.usecase';
import { ChatMessageModel } from '../../domain/models/chat-message.model';
import { SendMessage } from '../../domain/use-cases/send-message.usecase';
import { ChatMemberModel } from '../../domain/models/chat-member.model';
import { SendMessageRequestModel } from '../../domain/models/requests/send-message-request.model';
import { mediaTypeFromString } from '../../application/helpers';
import { Subject } from 'rxjs';

@Component({
  selector: 'std-chat-messages',
  exportAs: 'stdChatMessages',
  template: `
    <div *ngIf="currentChat && currentUser; else noChatSelected" class="std-chat-msgs-container" >
      <div class="std-chat-msgs-header">
        <div class="std-chat-msgs-avatar">
          <ng-container *ngIf="getAvatarUrl(currentChat);else templateDefault">
            <std-chat-avatar [src]="getAvatarUrl(currentChat)" [avatarStyle]="{ 'width': '32px', 'height': '32px' }"></std-chat-avatar>
          </ng-container>
          <ng-template #templateDefault>
            <ng-template [ngTemplateOutlet]="avatarDefault"></ng-template>
          </ng-template>
        </div>
        <div>{{ getOtherUser(currentChat).fullName }}</div>
      </div>
      <div #msgsContainer class="std-chat-msgs">
        <div class="std-chat-msg-container" [ngClass]="{'owner': msg.senderId === currentUser.id}" *ngFor="let msg of messages; let i = index" >
          <ng-container *ngIf="i > 0; else firstDate">
            <h2 class="std-chat-date-title" *ngIf="msg.createdAt.getDay() !== messages[i -1].createdAt.getDay()">{{ msg.createdAt | date:"longDate" }}</h2>
          </ng-container>
          <ng-template #firstDate>
            <h2 class="std-chat-date-title">{{ msg.createdAt | date:"longDate" }}</h2>
          </ng-template>
          <div class="std-chat-msg-content">
            <div class="std-chat-msg-text">
              <ng-container *ngIf="msg.media && msg.media.url; else onlyText">
                <div [ngSwitch]="msg.media.type">
                  <div *ngSwitchCase="'IMAGE'">
                    <img [src]="msg.media.url" style="width: 100%;" (load)="imageIsLoad()">
                  </div>
                  <div *ngSwitchCase="'DOCUMENT'">
                    <a [href]="msg.media.url" target="_blank" >{{ msg.media.fileName }}</a>
                  </div>
                  <div *ngSwitchDefault>
                    <span class="std-chat-msg-text-default">No se puede mostrar el mensaje</span>
                  </div>
                </div>
              </ng-container>
              <ng-template #onlyText>
                <p>{{ msg.content }}</p>
              </ng-template>
            </div>
            <p class="std-chat-msg-time">{{ msg.createdAt | date:"HH:mm" }}</p>
          </div>
        </div>
      </div>
      <div class="std-chat-controls">
        <std-chat-upload [(ngModel)]="msgData" (enter)="send()"></std-chat-upload>
        <button class="std-chat-controls-send" (click)="send()" [disabled]="!msgData || msgData === ''">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 19V5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.5 12L12.5 5L19.5 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <ng-template #noChatSelected>
      <ng-container *ngTemplateOutlet="emptyTemplate"></ng-container>
    </ng-template>

  `,
  styleUrls: ['./chat-messages.component.scss']
})

export class ChatMessagesComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()

  @ViewChild('msgsContainer') private msgsContainer!: ElementRef;
  @Input() avatarDefault!: TemplateRef<void>;
  @Input() emptyTemplate !: TemplateRef<void>;
  currentChat!: ChatRoomModel<T>;

  currentUser!: ChatMemberModel<T>;
  messages!: ChatMessageModel [];

  msgData!: string | File;
  constructor(
    private ChatDataService: ChatDataService<T>,
    private getMessages: GetMessages<T>,
    private sendMessage: SendMessage<T>,
  ) {
    this.ChatDataService.curentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currentUser: ChatMemberModel<T>) => this.currentUser = currentUser
      })
    this.ChatDataService.currentChat$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((currentChat: ChatRoomModel<T>) => {
          this.currentChat = currentChat;
          return this.getMessages.execute(currentChat.id);
        })
      )
      .subscribe({
        next: (messages: ChatMessageModel []) => {
          this.messages = messages;
          this.scrollToBottom();
        }
      })
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.msgsContainer.nativeElement.scrollTop = this.msgsContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  imageIsLoad(): void {
    this.scrollToBottom();
  }

  getOtherUser(chat: ChatRoomModel<T>): ChatMemberModel<T> {
    return Object.values(chat.members).find( f => f.id !== this.currentUser.id) as ChatMemberModel<T>;
  }

  getAvatarUrl(chat: ChatRoomModel<T>): string {
    const src = this.getOtherUser(chat).photoUrl;
    return  src ? src : '';
  }

  send(): void {
    let prototype = Object.getPrototypeOf(this.msgData);
    const data: Partial<SendMessageRequestModel> = {
      chatId: this.currentChat.id,
      senderId: this.currentUser.id,
      content: ''
    }

    if (prototype === String.prototype) {
      data.content = this.msgData as string;
    } else if (prototype === File.prototype) {
      this.msgData = this.msgData as File;
      const ext = this.msgData.name.split('.').pop();
      data.multimedia = {
        file: this.msgData,
        type: mediaTypeFromString(ext ? ext : ''),
        extension: ext ? ext : ''
      }
    }

    this.msgData = '';
    if (data.content !== '' || data.multimedia?.file) {
      this.sendMessage.execute(data as SendMessageRequestModel)
        .subscribe({
          next: () => {
            this.scrollToBottom();
          },
          error: (error) => console.log({ error, data })
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
