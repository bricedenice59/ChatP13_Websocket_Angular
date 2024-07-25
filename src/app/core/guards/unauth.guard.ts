import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AppStorageService} from "../services/app-storage";

export const unAuthGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const appStorageService = inject(AppStorageService);

  const token: string | null = appStorageService.getToken();

  if (!token) {
    return true;
  }

  router.navigate(['/chat']);
  return false;
};
