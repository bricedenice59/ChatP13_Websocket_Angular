import {Injectable} from "@angular/core";
import Stomp, {Frame} from "stompjs";
import SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export abstract class WebsocketService {
  protected stompClient!: Stomp.Client | null;
  protected readonly headers: {Authorization: string};

  protected constructor(token: string|null) {
    this.headers = {
      Authorization: `Bearer ${token}`
    };
  }

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

  public connect(): void {
    if(!this.initialize())
      return;

    console.log("initialized");

    try {
      this.stompClient!.connect(this.headers, this.onConnect.bind(this), this.onError.bind(this));
    } catch (error) {
      this.onError('An error occurred when trying to connect to websocket: ' + error);
    }
  };

  public disconnect(): void {
    try {
      if (!this.stompClient) {
        return;
      }
      this.onDisconnecting();

      this.stompClient!.disconnect(this.onDisconnect.bind(this));
    } catch (error) {
      this.onError('An error occurred when trying to disconnect from websocket: ' + error);
    }
  };

  protected abstract onConnect(frame: Frame | undefined): void;
  protected abstract onDisconnect(): void;
  protected abstract onError(error: string | Frame): void;
  protected onDisconnecting: () => void = () => {};

  protected setOnDisconnecting = (callback: () => any): void => {
    this.onDisconnecting = callback;
  };
}
