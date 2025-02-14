import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { XmAceEditorControlOptions } from '@xm-ngx/components/ace-editor';
import { StatesManagementDialogComponent } from '@xm-ngx/entity/states-management-dialog';
import { XmConfigService } from '../../../../../src/app/shared/spec/config.service';

import { ConfigValidatorUtil } from '../config-validator/config-validator.util';
import { ConfigVisualizerDialogComponent } from '../config-visualizer-dialog/config-visualizer-dialog.component';

@Component({
    selector: 'xm-entity-spec-mng',
    templateUrl: './entity-spec-management.component.html',
})
export class EntitySpecManagementComponent implements OnInit {

    @Input() public disabled: boolean;

    public entityValidation: any;
    public isXmEntitySpecValid: boolean;
    public entitySpecificationIn: string;
    public entitySpecificationOut: string;
    public line: number;
    public aceEditorOptions: XmAceEditorControlOptions = {
        mode: 'yaml',
        options: {
            highlightActiveLine: true,
            maxLines: 50,
        },
    };

    constructor(
        private modalService: MatDialog,
        private service: XmConfigService,
    ) {
    }

    public ngOnInit(): void {
        this.service.getConfig('/entity/xmentityspec.yml').subscribe((result) => {
            this.entitySpecificationIn = result;
            this.entitySpecificationOut = result;
        });
    }

    public onApplyChanges(event: string): void {
        this.entitySpecificationIn = event;
        this.onEntitySpecificationChange(event);
    }

    public onEntitySpecificationChange(textChanged: string): void {
        this.isXmEntitySpecValid = false;
        this.entityValidation = null;
        this.entitySpecificationOut = textChanged;
    }

    public validateXmEntitySpec(): void {
        const errors = ConfigValidatorUtil.validate(this.entitySpecificationOut);
        if (errors && errors.length) {
            this.entityValidation = { errorMessage: '' };
            for (const err of errors) {
                this.entityValidation.errorMessage += err.message + (err.path ? ` path: ${err.path}` : '') + '<br/>';
                if (err.line) {
                    this.line = err.line;
                }
            }
        } else {
            this.isXmEntitySpecValid = true;
        }
    }

    public onShowConfigVisualizerDialog(): void {
        const modalRef = this.modalService
            .open(ConfigVisualizerDialogComponent,
                { width: '80vw' });
        modalRef.componentInstance.entitySpecification = this.entitySpecificationOut;
    }

    public onShowConfigStatesManagementDialog(): void {
        this.modalService.open(StatesManagementDialogComponent, { width: '500px' });
    }


    public updateEntityConfig(): void {
        this.service.updateXmEntitySpec(this.entitySpecificationOut).subscribe(() => {
            window.location.reload();
        });
    }

}
