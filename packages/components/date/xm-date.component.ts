import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { defaults } from 'lodash';

export interface XmDateOptions {
    format?: string;
    timezone?: string;
    locale?: string;
}

export type XmDateValue = string | Date;

@Component({
    selector: 'xm-date',
    template: '{{ value | date:options.format:options.timezone:options.locale }}',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateComponent implements XmDynamicPresentation<XmDateValue, XmDateOptions> {
    @Input() public value: XmDateValue;

    protected _options: XmDateOptions = {};

    public get options(): XmDateOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmDateOptions) {
        this._options = defaults(value, {});
    }
}

@NgModule({
    exports: [XmDateComponent],
    declarations: [XmDateComponent],
    imports: [CommonModule],
})
export class XmDateModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmDateComponent;
}
