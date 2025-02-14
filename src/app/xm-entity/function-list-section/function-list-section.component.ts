import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';

import { Observable, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Principal } from '@xm-ngx/core/auth';
import { ContextService } from '../../shared/context/context.service';
import { FunctionCallDialogComponent } from '../function-call-dialog/function-call-dialog.component';
import { AreaComponent } from '../functions/area/area.component';
import { FunctionContext } from '../shared/function-context.model';
import { FunctionSpec } from '../shared/function-spec.model';
import { NextSpec, StateSpec } from '../shared/state-spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';
import { StateChangeDialogComponent } from '../state-change-dialog/state-change-dialog.component';
import { XM_EVENT_LIST } from '../../xm.constants';

@Component({
    selector: 'xm-function-list-section',
    templateUrl: './function-list-section.component.html',
    styleUrls: ['./function-list-section.component.scss'],
})
export class FunctionListSectionComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public xmEntityId: number;
    @Input() public functionSpecs: FunctionSpec[];
    @Input() public listView: boolean;
    @Input() public nextStates: StateSpec[];
    @Input() public stateSpec: StateSpec;
    @Input() public xmEntitySpec: XmEntitySpec;
    @Input() public xmEntity: XmEntity;
    public initMap: boolean;
    public functionContexts: FunctionContext[];
    public defaultFunctions$: Observable<FunctionSpec[]>;
    public customFunctions$: Observable<FunctionSpec[]>;
    public customFunctions: any = {
        'AREA': AreaComponent,
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(protected xmEntityService: XmEntityService,
                protected modalService: MatDialog,
                protected eventManager: XmEventManager,
                protected translateService: TranslateService,
                protected contextService: ContextService,
                protected principal: Principal) {
    }

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.functions && changes.functions.currentValue) {
            this.load();
        }
    }

    public onChangeState(stateKey: string): void {
        const nextSpec: NextSpec = this.stateSpec.next.filter((it) => it.stateKey === stateKey)[0];
        if (!nextSpec) {
            // exceptional case: user should never be able to change state outside the state tree
            throw new Error(`XM error: trying to change entity state from "${this.stateSpec.name}" to "${stateKey}", not allowed`);
        }

        let title = this.translateService.instant('xm-entity.function-list-card.change-state.title');
        title = nextSpec.actionName || nextSpec.name || title;

        const modalRef = this.modalService.open(StateChangeDialogComponent, {width: '500px'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        modalRef.componentInstance.nextSpec = nextSpec;
        modalRef.componentInstance.dialogTitle = title;
        modalRef.componentInstance.buttonTitle = title;
        modalRef
            .afterClosed()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((result) => {
                if (result === 'OK') {
                    this.pushUpdateEvent();
                }
            }, (reason) => {
                if (reason === 'OK') {
                    this.pushUpdateEvent();
                }
            });

    }

    public getCurrentStateSpec(): StateSpec {
        return this.xmEntitySpec.states &&
            this.xmEntitySpec.states.filter((s) => s.key === this.xmEntity.stateKey).shift();
    }

    public onCallFunction(functionSpec: FunctionSpec): void {
        const title = functionSpec.actionName ? functionSpec.actionName : functionSpec.name;
        const modalRef = this.modalService.open(FunctionCallDialogComponent, {width: '500px'});
        modalRef.componentInstance.xmEntity = this.xmEntity || {id: this.xmEntityId || undefined};
        modalRef.componentInstance.functionSpec = functionSpec;
        modalRef.componentInstance.dialogTitle = title;
        modalRef.componentInstance.buttonTitle = title;
        console.info('onCallFunction');
    }

    public getFunctionContext(functionSpec: FunctionSpec): FunctionContext {
        return this.functionContexts && this.functionContexts.filter((fc) => fc.typeKey === functionSpec.key).shift();
    }

    public reinitMap(tabChangeEvent: MatTabChangeEvent): void {
        if (tabChangeEvent.tab.textLabel === 'Area') {
            this.initMap = true;
        }
    }

    private load(): void {
        this.functionContexts = [];
        this.functionSpecs = this.functionSpecs ? this.functionSpecs : [];
        if (!this.xmEntityId) {
            this.functionSpecs = this.functionSpecs
                .filter((f) => f.hasOwnProperty('withEntityId') && f.withEntityId === false);
        } else {
            // TODO: workaround not to call xmEntityService for no reason
            if (this.functionSpecs &&
                ((this.functionSpecs.length === 1 && this.functionSpecs[0].saveFunctionContext)
                    || (this.functionSpecs.length > 1))) {
                this.getContext();
            }
        }

        this.defaultFunctions$ = of(this.getDefaultFunctions()).pipe(
            takeUntil(this.destroyed$),
        );

        this.customFunctions$ = of(this.getCustomFunctions()).pipe(
            takeUntil(this.destroyed$),
        );

    }

    private getContext(): void {
        this.xmEntityService.find(this.xmEntityId, {embed: 'functionContexts'})
            .subscribe((xmEntity: HttpResponse<XmEntity>) => {
                this.functionSpecs = this.functionSpecs.filter(
                    (f) => !f.allowedStateKeys || f.allowedStateKeys.includes(xmEntity.body.stateKey));
                this.xmEntity = xmEntity.body;
                if (xmEntity.body.functionContexts) {
                    this.functionContexts = [...xmEntity.body.functionContexts];
                }
            });
    }

    private getCustomFunctions(): FunctionSpec[] {
        return this.functionSpecs && this.functionSpecs.filter((fs) => !!this.customFunctions[fs.key]);
    }

    private allowedByState(functionSpec: FunctionSpec, stateKey: string): boolean {
        const keys = functionSpec.allowedStateKeys;
        if (keys && keys.length && keys.includes('NEVER')) {
            return false;
        }
        if (!keys || !keys.length || !stateKey) {
            return true;
        }
        return keys.includes(stateKey);
    }

    private getDefaultFunctions(): FunctionSpec[] {
        const stateKey = this.xmEntity ? this.xmEntity.stateKey : null;
        return this.functionSpecs && this.functionSpecs
            .filter((fs) => !this.customFunctions[fs.key])
            .filter((fs) => this.allowedByState(fs, stateKey))
            .filter((fs) => this.hasPrivilege(fs));
    }

    private hasPrivilege(spec: FunctionSpec): boolean {
        const priv = spec.withEntityId ? 'XMENTITY.FUNCTION.EXECUTE' : 'FUNCTION.CALL';
        return this.principal.hasPrivilegesInline([priv, `${priv}.${spec.key}`]);
    }

    private pushUpdateEvent(): void {
        this.eventManager.broadcast({
            name: XM_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION,
        });
    }
}
