import { Routes } from 'nest-router';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/core/auth/auth.module';
// needle-module-import

export const appRoutes: Routes = [
  {
    path: '/users',
    module: UserModule,
  },
  {
    path: '/auth',
    module: AuthModule,
  },
  // needle-modules-routes
];
