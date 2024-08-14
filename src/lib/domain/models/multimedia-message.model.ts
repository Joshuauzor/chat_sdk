import { MediaType } from './media-type';
export interface MultimediaMessageModel {
  id: string;
  type: MediaType;
  fileExtension: string;
  fileName: string;
  url: string;
}
