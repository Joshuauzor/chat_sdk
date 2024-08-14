import { ChatMemberModel } from './chat-member.model';
import { MultimediaMessageModel } from './multimedia-message.model';

export interface ChatMessageModel {
  id: string;
  senderId: string,
  createdAt: Date,
  content: string,
  media?: MultimediaMessageModel
}
