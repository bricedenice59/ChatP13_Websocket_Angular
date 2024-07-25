import {CanActivateFn, Router} from "@angular/router";

import {inject} from "@angular/core";
import {AppStorageService} from "../services/app-storage";

export const authGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const appStorageService = inject(AppStorageService);

  const token: string | null = appStorageService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
