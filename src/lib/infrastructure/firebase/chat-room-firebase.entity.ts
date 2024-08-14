import { ChatMessageFirebaseEntity } from './chat-message-firebase.entity';
import { ChatMemberFirebaseEntity } from './chat-member-firebase.entity';
import { ChatType } from '../../domain/models/chat-type';
export interface ChatRoomFirebaseEntity<T> {
  id: string,
  admins: string [],
  invitations: any [],
  createdAt: number,
  description: string,
  blocked: string [],
  imageUrl?: string,
  lastMessage?: ChatMessageFirebaseEntity,
  members: {
    [index: string]: ChatMemberFirebaseEntity<T>
  },
  name: string,
  totalMessages: number,
  type: ChatType
}
