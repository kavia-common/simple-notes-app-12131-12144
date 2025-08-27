import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

// PUBLIC_INTERFACE
export const authGuard: CanActivateFn = async () => {
  /** This is a public function. Route guard that ensures the user is authenticated. */
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = await firstValueFrom(auth.user$);
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
