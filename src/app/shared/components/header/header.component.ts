import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    username: string;
    navCollapse = true;

    constructor(private translate: TranslateService, public auth: AuthService) { }

    ngOnInit() {
        this.updateUserName();
    }

    onLogIn() {
        this.auth.login();
        this.updateUserName();
    }

    onLogOut() {
        this.auth.logout();
        this.username = '';
    }

    updateUserName() {
        if (this.auth.userProfile) {
            this.username = this.auth.userProfile.username;
        } else if (this.auth.isAuthenticated()) {
            this.auth.getProfile((err, profile) => {
                this.username = profile.name;
            });
        } else {
            this.username = '';
        }
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
