import { ChatMemberFirebaseEntity } from "../../infrastructure/firebase/chat-member-firebase.entity";
import { ChatMessageFirebaseEntity } from "../../infrastructure/firebase/chat-message-firebase.entity";
import { ChatType } from "./chat-type";

export interface ChatRoomFirebaseCreate<T> {
  id: string,
  admins: string [],
  invitations: any [],
  createdAt: Object,
  description: string,
  blocked: string [],
  imageUrl?: string,
  lastMessage?: ChatMessageFirebaseEntity
  members: {
    [index: string]: ChatMemberFirebaseEntity<T>
  },
  name: string,
  totalMessages: number,
  type: ChatType
}
