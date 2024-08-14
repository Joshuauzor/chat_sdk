import { Mapper } from '../../../domain/base/mapper';
import { ChatMemberModel } from '../../../domain/models/chat-member.model';
import { ChatMemberFirebaseEntity } from '../chat-member-firebase.entity';

export class ChatMemberFirebaseMapper<T> implements Mapper<ChatMemberFirebaseEntity<T>, ChatMemberModel<T>> {
  mapFrom(param: ChatMemberFirebaseEntity<T>): ChatMemberModel<T> {
    return {
      active: param.active,
      addedAt: new Date(param.addedAt),
      blocks: param.blocks,
      data: param.data,
      fullName: param.fullName,
      id: param.id,
      lastReadAt: new Date(param.lastReadAt),
      readMessages: param.readMessages,
      status: param.status,
      photoUrl: param.photoUrl,
    }
  }

  mapTo(param: ChatMemberModel<T>): ChatMemberFirebaseEntity<T> {
    return {
      active: param.active,
      addedAt: param.addedAt.getTime(),
      blocks: param.blocks,
      data: param.data,
      fullName: param.fullName,
      id: param.id,
      lastReadAt: param.lastReadAt.getTime(),
      readMessages: param.readMessages,
      status: param.status,
      photoUrl: param.photoUrl ? param.photoUrl : '',
    }
  }
}
