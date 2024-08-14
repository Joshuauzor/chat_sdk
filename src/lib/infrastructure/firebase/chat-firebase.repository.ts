import { ChatRepository } from '../../domain/repository/chat.repository';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { ChatRoomModel } from '../../domain/models/chat-room.model';
import { SendMessageRequestModel } from '../../domain/models/requests/send-message-request.model';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/app';
import { ChatMessageFirebaseEntity } from './chat-message-firebase.entity';
import { ChatRoomFirebaseEntity } from './chat-room-firebase.entity';
import { ChatMemberFirebaseMapper } from './mappers/chat-member-firebase.mapper';
import { ChatType } from '../../domain/models/chat-type';
import { ChatMemberModel } from '../../domain/models/chat-member.model';
import { ChatMessageModel } from '../../domain/models/chat-message.model';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { ChatMessageFirebaseMapper } from './mappers/chat-message-firebase.mapper';
import { ChatDataService } from '../../application/services/chat-data.service';
import { UploadMediaRequestModel } from '../../domain/models/requests/upload-media-request.model';
import { ChatRoomFirebaseMapper } from './mappers/chat-room-firebase.mapper';
import { throwError } from 'rxjs';
import { cleanPropertiesObject } from '../../application/helpers';
import { ChatRoomFirebaseCreate } from '../../domain/models/chat-room-firebase-create.model';

@Injectable({
  providedIn: 'root',
})
export class ChatFirebaseRepository<T> implements ChatRepository<T> {
  mapperMember: ChatMemberFirebaseMapper<T> = new ChatMemberFirebaseMapper<T>();
  mapperMessages: ChatMessageFirebaseMapper = new ChatMessageFirebaseMapper();
  mapperChat: ChatRoomFirebaseMapper<T> = new ChatRoomFirebaseMapper<T>();

  currentUser: ChatMemberModel<T> | null = null;
  currentChat: ChatRoomModel<T> | null = null;
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private ChatDataService: ChatDataService<T>
  ) {
    this.ChatDataService.curentUser$
      .subscribe({
        next: (user) => this.currentUser = user
      })
    this.ChatDataService.currentChat$
      .subscribe({
        next: (chat) => this.currentChat = chat
      })
  }

  createIndividualChat(creator: ChatMemberModel<T>, interlocutor: ChatMemberModel<T>): Observable<any> {
    const chatroom: ChatRoomFirebaseCreate<T> = {
      id: uuidv4(),
      admins: [
        creator.id,
        interlocutor.id
      ],
      invitations: [],
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      description: '',
      blocked: [],
      members: { },
      name: '',
      totalMessages: 0,
      type: ChatType.INDIVIDUAL
    }

    chatroom.members[creator.id] = this.mapperMember.mapTo(creator)
    chatroom.members[interlocutor.id] = this.mapperMember.mapTo(interlocutor)

    return this.db.list<ChatRoomModel<T>>('chats')
      .snapshotChanges()
        .pipe(
          switchMap(snapshot => {
          const data = snapshot.filter( f => f.payload.val()?.members[interlocutor.id] &&  f.payload.val()?.members[creator.id]);
          if (data.length < 1 ) {
            return from(this.db.object(`/chats/${chatroom.id}`).set(chatroom));
          }
          return of(false);
        }));
  }

  getAllChats(): Observable<ChatRoomModel<T> []> {
    return this.db.list<ChatRoomFirebaseEntity<T>>('chats')
      .valueChanges()
      .pipe(
        map(c => c.map(this.mapperChat.mapFrom))
      )
  }

  getChats(): Observable<ChatRoomModel<T> []> {
    if (this.currentUser && this.currentUser.id !== null) {
      const currentUserId = this.currentUser.id ;
      return this.db.list<ChatRoomFirebaseEntity<T>>('chats')
      .snapshotChanges()
        .pipe(map(snapshot => {
          const data = snapshot.filter( f => f.payload.val()?.members[currentUserId]);
          return data.filter(f => !!f.payload.val()).map( d => this.mapperChat.mapFrom(d.payload.val() as ChatRoomFirebaseEntity<T>));
        }));
    }
    return of();
  }

  getMessages(chatId: string): Observable<ChatMessageModel []> {
    return this.db.list<ChatMessageFirebaseEntity>(`msgs/${chatId}`, ref => ref
      .orderByChild('createdAt')
    ).valueChanges()
    .pipe(
      map((messages: ChatMessageFirebaseEntity []) => {
        return messages.map(this.mapperMessages.mapFrom)
      }),
    );
  }

  private createMessage(data: SendMessageRequestModel): Observable<ChatMessageFirebaseEntity> {
    const message: ChatMessageFirebaseEntity = {
      id: uuidv4(),
      content: data.content,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      senderId: data.senderId
    };

    if (data.multimedia) {
      const mediaId = uuidv4();
      return this.uploadMedia({
        chatId: data.chatId,
        file: data.multimedia.file,
        fileExtension: '',
        mediaId,
        type: data.multimedia.type
      }).pipe(
        take(1),
        catchError((error) => {
          return of(error);
        }),
        switchMap((url: string) => {
          message.multimedia = {
            fileExtension: data.multimedia?.extension ? data.multimedia?.extension : '',
            fileName: data.multimedia?.file.name ? data.multimedia?.file.name : '',
            id: mediaId,
            type: data.multimedia?.type as string,
            url: url
          }
          return from(this.db.object(`/msgs/${data.chatId}/${message.id}`).set(message)).pipe(map(() => message))
        })
      )
    } else {
      return from(this.db.object(`/msgs/${data.chatId}/${message.id}`).set(message)).pipe(map(() => message));
    }
  }

  sendMessage(data: SendMessageRequestModel): Observable<void> {
    return this.createMessage(data).pipe(
      take(1),
      catchError(() => {
        return throwError('CANT CREATE NEW MESSAGE')
      }),
      switchMap((message: ChatMessageFirebaseEntity) => {
        if (this.currentChat) {
          const chat = cleanPropertiesObject<ChatRoomFirebaseEntity<T>>(this.mapperChat.mapTo(this.currentChat));
          chat.totalMessages = firebase.database.ServerValue.increment(1) as number;
          chat.lastMessage = cleanPropertiesObject<ChatMessageFirebaseEntity>(message);
          return from(this.db.object(`/chats/${this.currentChat.id}`).set(chat));
        } else {
          return throwError('CANT UPDATE LAST MESSAGE IN CHAT ROOM')
        }
      })
    )
  }

  uploadMedia(data: UploadMediaRequestModel): Observable<any> {
    const urlRef = `/chats/${data.chatId}/${data.mediaId}$fileExtension`;
    const imageProcess = this.storage.upload(urlRef, data.file);

    const downloadUrl$ = from(imageProcess).pipe(
      switchMap((_) => this.storage.ref(urlRef).getDownloadURL() as Observable<any>),
    );

    return downloadUrl$.pipe(
      catchError((error) => {
        return this.storage.ref(urlRef).delete();
      }),
    )
  }

  updateReadMessage(data: ChatRoomModel<T>): Observable<void> {
    if (this.currentUser) {
      data.members[this.currentUser.id].readMessages = data.totalMessages;
      const dataFirebase = cleanPropertiesObject<ChatRoomFirebaseEntity<T>>(this.mapperChat.mapTo(data));
      return from(this.db.object(`/chats/${data.id}`).set(dataFirebase));
    }
    return throwError('CURRENT USER DATA NOT EXISTS');
  }
}
