import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AppStorageService {

  private TOKEN_NAME: string = 'token';
  private ME_NAME: string = 'me';
  private RECIPIENT_NAME: string = 'recipient';

  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_NAME);
  }

  public setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_NAME, token);
  }

  public deleteToken(): void {
    sessionStorage.removeItem(this.TOKEN_NAME);
  }

  public getMe(): string | null {
    return sessionStorage.getItem(this.ME_NAME);
  }

  public setMe(me: string): void {
    sessionStorage.setItem(this.ME_NAME, me);
  }

  public deleteMe(): void {
    sessionStorage.removeItem(this.ME_NAME);
  }

  public getRecipient(): string | null {
    return sessionStorage.getItem(this.RECIPIENT_NAME);
  }

  public setRecipient(recipient: string): void {
    sessionStorage.setItem(this.RECIPIENT_NAME, recipient);
  }

  public deleteRecipient(): void {
    sessionStorage.removeItem(this.RECIPIENT_NAME);
  }
}
