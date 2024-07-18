import {Injectable} from "@angular/core";
import Stomp, {Frame} from "stompjs";
import SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export abstract class WebsocketService {
  protected stompClient!: Stomp.Client | null;

  private initialize() : boolean {
    try {
      const socket: WebSocket = new SockJS("/ws");
      this.stompClient = Stomp.over(socket);
      return true;
    } catch (error) {
      this.onError('An error occurred when trying to initialize websocket: ' + error);
      return false;
    }
  }

  public connect(jwtToken: string): void {
    if(!this.initialize())
      return;

    console.log("initialized");

    const headers = {
      Authorization: `Bearer ${jwtToken}`
    };

    try {
      this.stompClient!.connect(headers, this.onConnect.bind(this), this.onError.bind(this));
    } catch (error) {
      this.onError('An error occurred when trying to connect to websocket: ' + error);
    }
  };

  public disconnect(): void {
    try {
      if (!this.stompClient) {
        return;
      }
      this.stompClient!.unsubscribe('/user/specific');

      this.stompClient!.disconnect(() => {
        console.log('Client is now disconnected');
        this.stompClient = null;
      });
    } catch (error) {
      console.error(error);
    }
  };

  protected abstract onConnect(frame: Frame | undefined): void;
  protected abstract onError(error: string | Frame): void;
}
