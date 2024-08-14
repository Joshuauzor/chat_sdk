import { Mapper } from '../../../domain/base/mapper';
import { ChatRoomFirebaseEntity } from '../chat-room-firebase.entity';
import { ChatRoomModel } from '../../../domain/models/chat-room.model';
import { ChatMemberFirebaseMapper } from './chat-member-firebase.mapper';
import { ChatMessageFirebaseMapper } from './chat-message-firebase.mapper';

export class ChatRoomFirebaseMapper<T> implements Mapper<ChatRoomFirebaseEntity<T>, ChatRoomModel<T>> {
  mapFrom(param: ChatRoomFirebaseEntity<T>): ChatRoomModel<T> {
    const mapperMember: ChatMemberFirebaseMapper<T> =  new ChatMemberFirebaseMapper<T>();
    const mapperMessages: ChatMessageFirebaseMapper =  new ChatMessageFirebaseMapper();
    const members: any = {};
    for(const key in param.members) {
      members[key] = mapperMember.mapFrom(param.members[key]);
    }
    return {
      admins: param.admins,
      blocked: param.blocked,
      createdAt: new Date(param.createdAt),
      id: param.id,
      invitations: param.invitations,
      lastMessage: param.lastMessage ? mapperMessages.mapFrom(param.lastMessage) : undefined,
      members: members,
      name: param.name,
      type: param.type,
      description: param.description,
      imageUrl: param.imageUrl,
      totalMessages: param.totalMessages,
    }
  }

  mapTo(param: ChatRoomModel<T>): ChatRoomFirebaseEntity<T> {
    const mapperMember: ChatMemberFirebaseMapper<T> =  new ChatMemberFirebaseMapper<T>();
    const mapperMessages: ChatMessageFirebaseMapper =  new ChatMessageFirebaseMapper();
    const members: any = {};
    for(const key in param.members) {
      members[key] = mapperMember.mapTo(param.members[key]);
    }
    return {
      admins: param.admins,
      blocked: param.blocked,
      createdAt: param.createdAt.getTime(),
      id: param.id,
      invitations: param.invitations,
      lastMessage: param.lastMessage ? mapperMessages.mapTo(param.lastMessage) : undefined,
      members: members,
      name: param.name,
      type: param.type,
      description: param.description ?? '',
      imageUrl: param.imageUrl,
      totalMessages: param.totalMessages,
    }

  }
}
