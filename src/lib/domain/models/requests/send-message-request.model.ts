import { ChatMemberModel } from '../chat-member.model';
import { MultimediaFileModel } from '../multimedia-file.model';
export interface SendMessageRequestModel {
  content: string;
  multimedia?: MultimediaFileModel;
  chatId: string;
  senderId: string
}
