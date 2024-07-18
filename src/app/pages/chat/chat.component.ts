import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../../core/services/websockets/chat-service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

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
  public onError = false;
  public form: FormGroup<{ message: FormControl<string | null>;}>
  public token: string | null = null;

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
    this.chatService.setOnConnectionReady(this.joinChat.bind(this));
    this.token = sessionStorage.getItem("token");
    if(this.token == null)
      return;

    this.chatService.connect(this.token!);
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  joinChat(): void {
    this.chatService.join()
  }

  public submit(): void {
    const message = this.form.value;

  }
}
