import {Injectable} from "@angular/core";
import {WebsocketService} from "./websocket-service";
import {Frame, Message} from 'stompjs';
import {chatServiceFactory} from "../../factories/chat-auth-token-factory";

@Injectable({
  providedIn: 'root',
  useFactory: chatServiceFactory
})
export class ChatService extends WebsocketService {
  public connected: boolean = false;
  public hasError: boolean = false;

  constructor(authToken: string|null) {
    super(authToken);
  }

  protected override onConnect(frame: Frame | undefined): void {
    console.log(frame);

    this.connected = true;

    this.subscribeToEndpoints();

    this.onConnectionReady();
  }

  private subscribeToEndpoints() : void {
    console.log("subscribe to websocket endpoints...");
    this.stompClient!.subscribe('/user/topic', this.onNewMessage);
    this.stompClient!.subscribe('/topic/join', this.onNewUser);
  }

  protected override onError(error: string | Frame): void {
    console.error(error);
    this.hasError = true;
  }

  public sendMessage(content: string, senderName: string, receiverName: string): void {
    if (!this.connected && this.stompClient == null) {
      throw new Error('User cannot send a message because he is not connected to websocket, please connect first!');
    }
    console.log('Sending chat message...');
    this.stompClient!.send(
      '/app/chat',
      {},
      JSON.stringify(
        {
          'content':content,
          senderName: senderName,
          'receiverName': receiverName,
          messageType:'CHAT'
        })
    );
    console.log('Chat message sent');
  };

  public join(): void {
    if (!this.connected || this.stompClient == null) {
      throw new Error('User cannot send a message because he is not connected to websocket, please connect first!');
    }

    console.log('Sending join message...');
    this.stompClient.send('/app/join',
      {},
      JSON.stringify(
        {
          senderName: null, //senderName is figured out on the backend side
          messageType:'JOIN'
        }
      )
    );
    console.log('Join message sent');
  };


  public onConnectionReady: (...args: any[]) => any = () => {};
  public onNewMessage: (message: Message) => void = () => {};
  public onNewUser: (message: Message) => void = () => {};

  public setOnConnectionReady = (callback: (...args: any[]) => any): void => {
    this.onConnectionReady = callback;
  };
  public setOnNewMessage = (callback: (message: Message) => void): void => {
    this.onNewMessage = callback;
  };
  public setOnNewUser = (callback: (message: Message) => void): void => {
    this.onNewUser = callback;
  };

}
