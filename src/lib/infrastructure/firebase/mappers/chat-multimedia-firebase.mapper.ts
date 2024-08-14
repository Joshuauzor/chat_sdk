import { Mapper } from '../../../domain/base/mapper';
import { MultimediaMessageModel } from '../../../domain/models/multimedia-message.model';
import { ChatMultimediaFirebaseEntity } from '../chat-multimedia-firebase.entity';
import { mediaTypeFromString } from '../../../application/helpers';

export class ChatMultimediaFirebaseMapper implements Mapper<ChatMultimediaFirebaseEntity, MultimediaMessageModel> {
  mapFrom(param: ChatMultimediaFirebaseEntity): MultimediaMessageModel {
    return {
      fileExtension: param.fileExtension,
      fileName: param.fileName,
      id: param.id,
      type: mediaTypeFromString(param.type),
      url: param.url
    }
  }

  mapTo(param: MultimediaMessageModel): ChatMultimediaFirebaseEntity {
    return {
      fileExtension: param.fileExtension,
      fileName: param.fileName,
      id: param.id,
      type: param.type,
      url: param.url
    }
  }
}
