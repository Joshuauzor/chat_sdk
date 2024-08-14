import { MediaType } from './media-type';
export interface MultimediaFileModel {
  file: File,
  type: MediaType,
  extension: string,
}
