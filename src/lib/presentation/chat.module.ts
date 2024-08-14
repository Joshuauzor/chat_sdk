import { NgModule } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { ChatRepository } from '../domain/repository/chat.repository';
import { ChatFirebaseRepository } from '../infrastructure/firebase/chat-firebase.repository';
import { GetChats } from '../domain/use-cases/get-chats.usecase';
import { SendMessage } from '../domain/use-cases/send-message.usecase';
import { ChatDataService } from '../application/services/chat-data.service';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { CommonModule } from '@angular/common';
import { GetMessages } from '../domain/use-cases/get-messages.usecase';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatAvatarComponent } from './chat-avatar/chat-avatar.component';
import { ChatUploadComponent } from './chat-upload/chat-upload.component';
import { ChatService } from '../application/services/chat.service';
import { CreateIndividualChat } from '../domain/use-cases/create-individual-chat.usecase';
import { UpdateReadMessages } from '../domain/use-cases/update-read-messages.usecase';
import { DateMessageModule } from '../application/pipes/date-message.module';
import { GetAllChats } from '../domain/use-cases/get-all-chats.usecase';

@NgModule({
  declarations: [
    ChatComponent,
    ChatRoomsComponent,
    ChatMessagesComponent,
    ChatAvatarComponent,
    ChatUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateMessageModule
  ],
  exports: [
    ChatComponent,
    ChatRoomsComponent,
    ChatMessagesComponent
  ],
  providers: [
    ChatDataService,
    ChatService,
    CreateIndividualChat,
    GetChats,
    SendMessage,
    UpdateReadMessages,
    GetMessages,
    GetAllChats,
    { provide: ChatRepository, useClass: ChatFirebaseRepository }
  ]
})
export class ChatModule { }
