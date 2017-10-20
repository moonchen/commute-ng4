import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'eta/0', pathMatch: 'full' },
            { path: 'eta', loadChildren: './eta/eta.module#ETAModule' },
            { path: 'routes', loadChildren: './routelist/routelist.module#RouteListModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
