import { Mapper } from '../../../domain/base/mapper';
import { ChatMessageModel } from '../../../domain/models/chat-message.model';
import { ChatMessageFirebaseEntity } from '../chat-message-firebase.entity';
import { ChatMultimediaFirebaseMapper } from './chat-multimedia-firebase.mapper';

export class ChatMessageFirebaseMapper implements Mapper<ChatMessageFirebaseEntity, ChatMessageModel> {
  mapFrom(param: ChatMessageFirebaseEntity): ChatMessageModel {
    const mediaMapper: ChatMultimediaFirebaseMapper = new ChatMultimediaFirebaseMapper();
    return {
      content: param.content,
      createdAt: new Date(param.createdAt as number),
      id: param.id,
      senderId: param.senderId,
      media: param.multimedia ? mediaMapper.mapFrom(param.multimedia) : undefined
    }
  }

  mapTo(param: ChatMessageModel): ChatMessageFirebaseEntity {
    const mediaMapper: ChatMultimediaFirebaseMapper = new ChatMultimediaFirebaseMapper();
    return {
      content: param.content,
      createdAt: param.createdAt.getTime(),
      id: param.id,
      senderId: param.senderId,
      multimedia: param.media ? mediaMapper.mapTo(param.media) : undefined
    }
  }
}
