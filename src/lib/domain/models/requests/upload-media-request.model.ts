import { MediaType } from '../media-type';

export interface UploadMediaRequestModel {
  mediaId: string,
  fileExtension: string,
  chatId: string,
  file: File,
  type: MediaType,
}
