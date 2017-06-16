import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { ETARoutingModule } from './eta-routing.module';
import { ETAComponent } from './eta.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        ETARoutingModule,
        PageHeaderModule,
        NgbModule.forRoot()
    ],
    declarations: [ETAComponent]
})
export class ETAModule { }
