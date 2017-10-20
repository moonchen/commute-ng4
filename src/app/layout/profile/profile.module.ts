import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        NgbModule.forRoot()
    ],
    declarations: [ProfileComponent]
})
export class ProfileModule { }
