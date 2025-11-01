import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Solo verificar localStorage en el navegador
  if (isPlatformBrowser(platformId)) {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === '1';

    if (!isLoggedIn) {
      // Redirigir al login si no está autenticado
      router.navigate(['/admin/login']);
      return false;
    }

    return true;
  }

  // En el servidor, permitir la navegación (será verificado en el cliente)
  return true;
};
