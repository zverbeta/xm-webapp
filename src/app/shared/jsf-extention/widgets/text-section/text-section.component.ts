import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { I18nNamePipe } from '@xm-ngx/components/language';

import { Principal } from '@xm-ngx/core/auth';
import { JsonSchemaFormService } from '@xm-ngx/json-schema-form/core';
import { startWith } from 'rxjs/operators';
import * as formatString from 'string-template';

@Component({
    selector: 'xm-text-section',
    templateUrl: './text-section.component.html',
})
export class TextSectionComponent implements OnInit {

    public options: any;
    public calculatedContent: string;
    @Input() public layoutNode: any;

    constructor(private jsf: JsonSchemaFormService,
                private i18nNamePipe: I18nNamePipe,
                private principal: Principal) {}

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        if (this.options.dynamicContent) {this.registerFieldsChanges(); }
    }

    private registerFieldsChanges(): void {
        const fg: FormGroup = this.jsf.formGroup;
        fg.valueChanges
            .pipe(startWith(''))
            .subscribe((data) => {
                this.processTemplateString(data);
            });
        fg.updateValueAndValidity();
    }
    private processTemplateString(data: any): void {
        const text =
            this.options.dynamicContent.value ?
                this.i18nNamePipe.transform(this.options.dynamicContent.value, this.principal) : '';
        if (this.options.dynamicContent.trackKeys) {
            const keys = this.options.dynamicContent.trackKeys.keys || [];
            const opposite = !!this.options.dynamicContent.trackKeys.hasValues;
            if (opposite) {
                const hasValues = [];
                keys.forEach((key) => {
                    if (data[key] && data[key] != null && data[key] !== 'undefined') {hasValues.push(data[key]); }
                });
                this.calculatedContent = hasValues.length === keys.length ? formatString(text, data) : null;
            } else {
                const noValues = [];
                keys.forEach((key) => {
                    if (!data[key] || data[key] == null || data[key] === 'undefined') {noValues.push(data[key]); }
                });
                this.calculatedContent = noValues.length > 0 ? formatString(text, data) : null;
            }
        } else {
            this.calculatedContent = formatString(text, data);
        }
    }
}
