import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../payloads/auth/loginRequest.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private pathService: string = '/auth';

  constructor(private httpClient: HttpClient) { }

  public login(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.pathService}/login`, loginRequest);
  }
}
