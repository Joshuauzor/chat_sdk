import { Observable } from 'rxjs';
import { ChatMemberModel } from '../models/chat-member.model';
import { ChatRoomModel } from '../models/chat-room.model';
import { SendMessageRequestModel } from '../models/requests/send-message-request.model';
import { ChatMessageModel } from '../models/chat-message.model';
import { UploadMediaRequestModel } from '../models/requests/upload-media-request.model';

export abstract class ChatRepository<T> {
  abstract getChats(): Observable<ChatRoomModel<T> []>;
  abstract getAllChats(): Observable<ChatRoomModel<T> []> 
  abstract sendMessage(data: SendMessageRequestModel): Observable<void>;
  abstract getMessages(chatId: string): Observable<ChatMessageModel []>;
  abstract createIndividualChat(creator: ChatMemberModel<T>, interlocutor: ChatMemberModel<T>): Observable<any>;
  abstract uploadMedia(data: UploadMediaRequestModel): Observable<void>;
  abstract updateReadMessage(data: ChatRoomModel<T>): Observable<void>;
}
