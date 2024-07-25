import {Injectable} from "@angular/core";
import {WebsocketService} from "./websocket-service";
import {Frame, Message} from 'stompjs';
import {chatServiceFactory} from "../../factories/chat-auth-token-factory";

@Injectable({
  providedIn: 'root',
  useFactory: chatServiceFactory
})
export class ChatService extends WebsocketService {
  private readonly topicEndpoint: string = '/user/topic';
  private readonly joinEndpoint: string = '/topic/join';
  public connected: boolean = false;
  public hasError: boolean = false;

  constructor(authToken: string|null) {
    super(authToken);
    this.setOnDisconnecting(this.handleOnDisconnecting.bind(this));
  }

  protected override onConnect(frame: Frame | undefined): void {
    console.log(frame);

    this.connected = true;

    this.subscribeToEndpoints();

    this.onConnectionStateChanged(true);
  }

  protected onDisconnect(): void {
    this.connected = false;
    console.log("Disconnected...");
    this.onConnectionStateChanged(false);
  }

  private handleOnDisconnecting(): void {
    console.log("Disconnecting...");
    this.unsubscribeFromEndpoints();
  }

  private subscribeToEndpoints() : void {
    console.log("subscribe to websocket endpoints...");
    this.stompClient!.subscribe(this.topicEndpoint, this.onMessageReceived);
    this.stompClient!.subscribe(this.joinEndpoint, this.onUserHasJoinedOrLeft);
  }

  private unsubscribeFromEndpoints() : void {
    console.log("unsubscribe from websocket endpoints...");
    this.stompClient!.unsubscribe(this.topicEndpoint);
    this.stompClient!.unsubscribe(this.joinEndpoint);
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

  public onConnectionStateChanged: (status: boolean) => any = () => {};
  public onMessageReceived: (message: Message) => void = () => {};
  public onUserHasJoinedOrLeft: (message: Message) => void = () => {};

  public setOnConnectionStateChanged = (callback: (status: boolean) => any): void => {
    this.onConnectionStateChanged = callback;
  };
  public setOnMessageReceived = (callback: (message: Message) => void): void => {
    this.onMessageReceived = callback;
  };
  public setOnUserHasJoinedOrLeft = (callback: (message: Message) => void): void => {
    this.onUserHasJoinedOrLeft = callback;
  };
}
