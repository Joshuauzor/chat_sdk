import { ChatMultimediaFirebaseEntity } from './chat-multimedia-firebase.entity';

export interface ChatMessageFirebaseEntity {
  id: string,
  content: string,
  createdAt: number | object,
  senderId: string,
  multimedia?: ChatMultimediaFirebaseEntity;
}
