import { ChatMemberModel } from './chat-member.model';
export interface ChatInvitationModel<T> {
  userId: string,
  chatName: string,
  chatDescription: string,
  chatImageUrl: string,
  message: string,
  invitedBy: ChatMemberModel<T>,
  createdAt: Date
}
