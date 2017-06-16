import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ETAComponent } from './eta.component';

const routes: Routes = [
    {
        path: '', component: ETAComponent,
        children: [
            { path: ':id', component: ETAComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ETARoutingModule { }
