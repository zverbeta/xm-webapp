import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { UnblockLockUserModule } from '@xm-ngx/administration/user-management/unblock-lock-user/unblock-lock-user.module';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgJhipsterModule } from 'ng-jhipster';
import { XmSharedModule } from '../../../../src/app/shared/shared.module';
import { UserLoginMgmtDialogComponent } from './user-login-management-dialog.component';
import { UserMgmtDeleteDialogComponent } from './user-management-delete-dialog.component';
import { UserMgmtDialogComponent } from './user-management-dialog/user-management-dialog.component';
import { UserMgmtComponent } from './user-management.component';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';

@NgModule({
    imports: [
        UnblockLockUserModule,
        LoaderModule,
        XmTranslationModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        NgJhipsterModule,
        RouterModule,
        XmSharedModule,
        ModalCloseModule,
    ],
    exports: [UserMgmtComponent],
    declarations: [
        UserMgmtComponent,
        UserMgmtDialogComponent,
        UserLoginMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
    ],
    providers: [],
})
export class UserManagementModule {
    public entry: Type<UserMgmtComponent> = UserMgmtComponent;
}
