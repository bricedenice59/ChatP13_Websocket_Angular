import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../../core/services/websockets/chat-service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {Message} from "stompjs";
import {AppStorageService} from "../../core/services/app-storage";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatButton,
    NgIf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly chatService : ChatService = inject(ChatService);
  public readonly appStorage: AppStorageService = inject(AppStorageService);
  public onError = false;
  public form: FormGroup<{ message: FormControl<string | null>;}>
  public token: string | null = null;
  public me: string | null = null;
  public contact: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      message: [
        '',
        [
          Validators.required,
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.chatService.setOnNewUser(this.handleNewUserJoiningLeaving.bind(this));
    this.chatService.setOnNewMessage(this.handleNewMessageComingIn.bind(this));
    this.chatService.setOnConnectionReady(this.joinChat.bind(this));

    if(this.appStorage.getToken() == null)
      return;
    this.me = this.appStorage.getMe();

    this.chatService.connect();
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  joinChat(): void {
    this.chatService.join();
  }

  private handleNewUserJoiningLeaving = (message: Message): void => {
    console.log('Received from /topic/join: ' + message.body);
    if(message.body && message.body.length > 0){
      const parsedMessage = JSON.parse(message.body);
      const { senderName, messageType } = parsedMessage;

      switch (messageType) {
        case 'JOIN': {
          //because the join message is broadcast to everyone included myself, I need to ignore message, I just want to intercept any other user.
          if(senderName === this.me){
            return;
          }
          //a user joined, set him as our recipient in our one <-> one conversation
          this.appStorage.setRecipient(senderName);
          break;
        }
        case 'LEAVE': {
          //no need to notify myself that I have left
          if(senderName === this.me){
            return;
          }
          //recipient has left, delete it
          this.appStorage.deleteRecipient();
          break;
        }
        default:
          throw new Error(`Unknown type: ${messageType}`);
      }
    }
  }

  private handleNewMessageComingIn = (message: Message): void => {
    console.log('Received from /user/topic: ' + message.body);
    if(message.body && message.body.length > 0){
      const parsedMessage = JSON.parse(message.body);
      const { senderName } = parsedMessage;

      if(this.appStorage.getRecipient() === null){
        this.appStorage.setRecipient(senderName);
      }
    }
  }

  public submit(): void {
    const message = this.form.value.message;
    this.chatService.sendMessage(message!, this.appStorage.getMe()!, this.appStorage.getRecipient()!);
    this.form.reset();
  }
}
