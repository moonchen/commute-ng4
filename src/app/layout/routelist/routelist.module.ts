import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { RouteListComponent } from './routelist.component';
import { RouteListRoutingModule } from './routelist-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouteListRoutingModule,
    NgbDropdownModule.forRoot(),
    NgbModalModule.forRoot()
  ],
  declarations: [RouteListComponent]
})
export class RouteListModule { }
