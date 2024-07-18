import {Injectable} from "@angular/core";
import {WebsocketService} from "./websocket-service";
import { Frame } from "stompjs";

@Injectable({
  providedIn: 'root',
})
export class ChatService extends WebsocketService {
  public connected: boolean = false;
  public hasError: boolean = false;

  protected override onConnect(frame: Frame | undefined): void {
    console.log(frame);

    this.connected = true;

    this.stompClient!.subscribe('/user/specific', function(result) {
      console.log(result.body)
    });
    this.stompClient!.subscribe('/topic/join', message => {
      console.log('Received: ' + message.body);
    });

    console.log(this.onConnectionReady())
    this.onConnectionReady();
  }

  protected override onError(error: string | Frame): void {
    console.error(error);
    this.hasError = true;
  }

  public sendMessage(receiverName: string, content: string): void {
    if (!this.connected && this.stompClient == null) {
      throw new Error('User cannot send a message because he is not connected to websocket, please connect first!');
    }

    this.stompClient!.send(
      '/app/chat.sendMessage',
      {},
      JSON.stringify({ content, receiverName, messageType: 'CHAT' })
    );
  };


  public onConnectionReady: (...args: any[]) => any = () => {};

  public setOnConnectionReady = (callback: (...args: any[]) => any): void => {
    this.onConnectionReady = callback;
  };

  public join(): void {
    if (!this.connected && this.stompClient == null) {
      throw new Error('User cannot send a message because he is not connected to websocket, please connect first!');
    }

    this.stompClient!.send(
      '/app/join',
      JSON.stringify({ messageType: 'JOIN' })
    );
  };

}
