import { ChatInvitationModel } from './chat-invitation.model';
import { ChatMemberModel } from './chat-member.model';
import { ChatType } from './chat-type';
import { ChatMessageModel } from './chat-message.model';
export interface  ChatRoomModel<T> {
  id: string;
  name: string,
  invitations: ChatInvitationModel<T> [],
  blocked: string [],
  admins: string [],
  members: {
    [index: string]: ChatMemberModel<T>
  }
  lastMessage?: ChatMessageModel,
  createdAt: Date,
  type: ChatType,
  totalMessages: number,
  description?: string,
  imageUrl?: string,
}
