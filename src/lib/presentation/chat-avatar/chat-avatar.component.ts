import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'std-chat-avatar',
  template: `
    <div class="std-chat-avatar-container">
      <img class="std-chat-avatar" [src]="src" [ngStyle]="avatarStyle">
    </div>
  `,
  styles: [`
    .std-chat-avatar-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .std-chat-avatar {
      object-fit: cover;
      border-radius: 100%;
      width: 54px;
      height: 54px;
    }
  `]
})

export class ChatAvatarComponent implements OnInit {
  @Input() src !:string;
  @Input() avatarStyle!: {
    [index: string]: string
  };
  constructor() { }

  ngOnInit() { }
}
