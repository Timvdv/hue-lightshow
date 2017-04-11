import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TimelineComponent } from './timeline/timeline.component';
import { NotfoundComponent } from './notfound/notfound.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'bridge',
        component: TimelineComponent,
    },
    {
        path: 'lightshow',
        component: TimelineComponent,
    },
    {
        path: '**',
        component: NotfoundComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
