import { MediaType } from '../domain/models/media-type';

export function mediaTypeFromString(extension: string): MediaType {
  switch (extension.toUpperCase()) {
    case 'IMAGE':
    case 'JPEG':
    case 'JPG':
    case 'GIF':
    case 'PNG':
      return MediaType.IMAGE;

    case 'DOCUMENT':
    case 'PDF':
      return MediaType.DOCUMENT;

    case 'AUDIO':
      return MediaType.AUDIO;
    case 'VIDEO':
      return MediaType.VIDEO;
    default:
      return MediaType.UNKNOWN;
  }
}

export function cleanPropertiesObject<T>(data: T): T {
  var t = data;
  for (var v in t) {
    if (typeof t[v] == "object")
    cleanPropertiesObject(t[v]);
    else if (t[v] == undefined)
      delete t[v];
    else if (t[v] == null)
      delete t[v];
  }
  return t;
}
