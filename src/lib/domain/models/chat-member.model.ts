import { ChatMemberStatus } from './chat-member-status';
export interface ChatMemberModel<T> {
  id: string,
  fullName: string,
  photoUrl?: string,
  blocks: string [],
  readMessages: number,
  active: boolean,
  data: T,
  lastReadAt: Date,
  addedAt: Date
  status: ChatMemberStatus
}
