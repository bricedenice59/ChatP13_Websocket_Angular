import {Component, inject, OnDestroy} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {AuthService} from "../../core/services/auth/auth.service";
import {LoginRequest} from "../../core/payloads/auth/loginRequest.interface";
import {SessionInformation} from "../../core/interfaces/SessionInformation";
import {AppStorageService} from "../../core/services/app-storage";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButton,
    MatInput,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  public readonly appStorage: AppStorageService = inject(AppStorageService);
  public loginSubscription$: Subscription | undefined;
  public onError = false;
  public form: FormGroup<{ name: FormControl<string | null>; password: FormControl<string | null>; }>

  constructor(private router: Router,
              private authService: AuthService,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required
        ]
      ],
      password: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription$?.unsubscribe();
  }

  public submit(): void {
    const loginRequest = this.form.value as LoginRequest;
    this.loginSubscription$ = this.authService.login(loginRequest).subscribe({
      next: (response: SessionInformation): void => {
        if(response){
          this.appStorage.setToken(response.token)
          this.appStorage.setMe(loginRequest.name)
          this.router.navigate(['/chat']);
          return;
        }
        this.onError = true;
      },
      error: err => {
        this.onError = true;
        console.log(err);
      }
    });
  }
}
