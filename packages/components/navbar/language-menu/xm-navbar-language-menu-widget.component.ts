import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { LanguageService, Locale } from '@xm-ngx/translation';
import { Observable } from 'rxjs';

@Component({
    selector: 'xm-navbar-language-menu-widget',
    template: `
        <button *ngIf="!(isSessionActive$ | async)"
                mat-button
                [matMenuTriggerFor]="menu"
                [matTooltip]="'xm-navbar-language-menu.choose-language' | translate"
                [attr.aria-label]="'xm-navbar-language-menu.choose-language' | translate">
            {{languageService.locale | findLanguageFromKey}}
            <mat-icon>expand_more</mat-icon>
        </button>

        <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item
                    *ngFor="let language of languages"
                    (click)="changeLanguage(language);">
                <span>{{language | findLanguageFromKey}}</span>
            </button>
        </mat-menu>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmNavbarLanguageMenuWidget implements OnInit {
    public languages: Locale[];
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();

    constructor(
        private xmUiConfigService: XmUiConfigService,
        private xmSessionService: XmSessionService,
        public languageService: LanguageService,
    ) {
    }

    public ngOnInit(): void {
        this.xmUiConfigService.config$().pipe(takeUntilOnDestroy(this)).subscribe((config) => {
            this.languages = (config && config.langs) ? config.langs : this.languageService.languages;
        });
    }

    public changeLanguage(languageKey: string): void {
        this.languageService.locale = languageKey;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
