import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../payloads/auth/loginRequest.interface';
import {SessionInformation} from "../../interfaces/SessionInformation";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private pathService: string = '/auth';

  constructor(private httpClient: HttpClient) { }

  public login(loginRequest: LoginRequest): Observable<SessionInformation> {
    return this.httpClient.post<SessionInformation>(`${this.pathService}/login`, loginRequest);
  }
}
