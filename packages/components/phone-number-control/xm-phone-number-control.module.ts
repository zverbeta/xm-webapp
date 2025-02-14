import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgxMaskModule } from 'ngx-mask';
import { XmPhoneNumberControlComponent } from './xm-phone-number-control.component';


@NgModule({
    declarations: [XmPhoneNumberControlComponent],
    exports: [XmPhoneNumberControlComponent],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        NgxMaskModule,
        NgxMaskModule.forRoot(),
        ControlErrorModule,
        XmTranslationModule,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class XmPhoneNumberControlModule {
}
