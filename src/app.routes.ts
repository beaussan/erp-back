import { Routes } from 'nest-router';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { MasterModule } from './modules/master/master.module';
import { MaquetteModule } from './modules/maquette/maquette.module';
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
  {
    path: '/master',
    module: MasterModule,
  },
  {
    path: '/maquette',
    module: MaquetteModule,
  },
  // needle-modules-routes
];
