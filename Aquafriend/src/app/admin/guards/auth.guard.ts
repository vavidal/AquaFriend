import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);

  if (isPlatformBrowser(platformId)) {
    if (auth.isLoggedIn()) {
      return true;
    }

    auth.logout();
    const tree: UrlTree = router.createUrlTree(['/admin/login'], {
      queryParams: state.url && state.url !== '/' ? { returnUrl: state.url } : undefined
    });
    return tree;
  }

  // En el servidor delegamos esta validacion al cliente
  return true;
};
