import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { NotfoundComponent } from './notfound/notfound.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'bridge',
        component: CreateComponent,
    },
    {
        path: 'lightshow',
        component: CreateComponent,
    },
    {
        path: '**',
        component: NotfoundComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
