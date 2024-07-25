import {AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../../core/services/websockets/chat-service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NgClass, NgIf} from "@angular/common";
import {Message} from "stompjs";
import {AppStorageService} from "../../core/services/app-storage";
import {ChatMessage} from "../../core/interfaces/ChatMessage";
import {SpinLoaderComponent} from "../../components/spin-loader/spin-loader.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatButton,
    NgIf,
    NgClass,
    SpinLoaderComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly chatService : ChatService = inject(ChatService);
  public readonly appStorage: AppStorageService = inject(AppStorageService);
  @ViewChild('chatBox') private chatBox: ElementRef | undefined;

  public onError = false;
  public form: FormGroup<{ message: FormControl<string | null>;}>
  public token: string | null = null;
  public me: string | null = null;
  public hasRecipientJoined: boolean = false;
  public readonly messages: ChatMessage[] = [];

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
    this.chatService.setOnUserHasJoinedOrLeft(this.handleNewUserJoiningLeaving.bind(this));
    this.chatService.setOnMessageReceived(this.handleNewMessageComingIn.bind(this));
    this.chatService.setOnConnectionReady(this.joinChat.bind(this));

    if(this.appStorage.getToken() == null)
      return;
    this.me = this.appStorage.getMe();

    this.chatService.connect();
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  joinChat(): void {
    this.chatService.join();
  }

  scrollToBottom(): void {
    if(!this.chatBox)
      return;
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed', err);
    }
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
          this.hasRecipientJoined = true;
          break;
        }
        case 'LEAVE': {
          //no need to notify myself that I have left
          if(senderName === this.me){
            this.resetChatOnAnyUserLeft();
            return;
          }
          //recipient has left, delete it
          this.appStorage.deleteRecipient();
          this.resetChatOnAnyUserLeft();
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
      const { content, senderName } = parsedMessage;

      if(this.appStorage.getRecipient() === null){
        this.appStorage.setRecipient(senderName);
      }

      const chatMessage: ChatMessage = {msg: content, isMe: senderName === this.me, senderName: senderName};
      this.messages.push(chatMessage);
    }
  }

  private resetChatOnAnyUserLeft(): void{
    this.hasRecipientJoined = false;
    this.messages.length = 0;
  }

  public submit(): void {
    const message = this.form.value.message;
    this.chatService.sendMessage(message!, this.appStorage.getMe()!, this.appStorage.getRecipient()!);

    const chatMessage: ChatMessage = {msg: message!, isMe: true, senderName: this.appStorage.getMe()!};
    this.messages.push(chatMessage);

    this.form.reset();
  }
}
