import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { GetChats } from '../../domain/use-cases/get-chats.usecase';
import { SendMessage } from '../../domain/use-cases/send-message.usecase';
import { SendMessageRequestModel } from '../../domain/models/requests/send-message-request.model';
import { v4 as uuidv4 } from "uuid";
import { ChatDataService } from '../../application/services/chat-data.service';
import { switchMap, takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
import { ChatMemberModel } from '../../domain/models/chat-member.model';
import { ChatRoomModel } from '../../domain/models/chat-room.model';

@Component({
  selector: 'std-chat',
  exportAs: 'stdChat',
  template: `
    <div class="std-chat-container">
      <std-chat-rooms [avatarDefault]="avatarRoom" [emptyData]="emptyChatRooms" ></std-chat-rooms>
      <std-chat-messages [emptyTemplate]="emptyMessagesTemplate" [avatarDefault]="avatarMessage">
      </std-chat-messages>
    </div>
  `,
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() emptyChatRooms!: TemplateRef<void>;
  @Input() emptyMessagesTemplate!: TemplateRef<void>;
  @Input() avatarRoom!: TemplateRef<any>;
  @Input() avatarMessage!: TemplateRef<any>;
  @Input() footer!: TemplateRef<any>;

  private destroy$: Subject<void> = new Subject<void>();
  chatRoom: ChatRoomModel<any> [] = [];
  currentUser!: ChatMemberModel<any>;

  constructor(
    private ChatDataService: ChatDataService<any>,
    private getChats: GetChats<any>,
    private sendMessage: SendMessage<any>,
  ) {
    this.ChatDataService.curentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currentUser: ChatMemberModel<any>) => this.currentUser = currentUser
      })
  }

  ngOnInit(): void {
    this.getChats.execute()
      .pipe(takeUntil(this.destroy$))
      .subscribe( {
        next: (data: ChatRoomModel<any> []) => this.chatRoom = data
      })
  }

  ngAfterViewInit(): void { }

  send(): void {
    const data: SendMessageRequestModel = {
      chatId: uuidv4(),
      content: 'test message',
      senderId: uuidv4()
    }
    this.sendMessage.execute(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => console.log({ response }),
        error: (error) => console.log({ error })
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
