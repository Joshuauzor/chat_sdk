import { ChatMemberStatus } from '../../domain/models/chat-member-status';
export interface ChatMemberFirebaseEntity<T> {
  id: string,
  fullName: string,
  active: boolean,
  addedAt: number,
  blocks: string [],
  lastReadAt: number,
  photoUrl: string,
  readMessages: number,
  data: T,
  status: ChatMemberStatus,
}
