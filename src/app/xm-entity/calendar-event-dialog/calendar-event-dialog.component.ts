import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { XmToasterService } from '@xm-ngx/toaster';
import { JhiDateUtils } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { CalendarSpec } from '../shared/calendar-spec.model';
import { Calendar } from '../shared/calendar.model';
import { CalendarService } from '../shared/calendar.service';
import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';
import { XmEntity } from '../shared/xm-entity.model';


@Component({
    selector: 'xm-calendar-event-dialog',
    templateUrl: './calendar-event-dialog.component.html',
})
export class CalendarEventDialogComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public calendar: Calendar;
    @Input() public calendarSpec: CalendarSpec;
    @Input() public startDate: any;
    @Input() public endDate: any;
    @Input() public onAddEvent: (arg: Event) => void;

    public event: Event = {};
    public showLoader: boolean;

    constructor(private activeModal: MatDialogRef<CalendarEventDialogComponent>,
                private eventService: EventService,
                private calendarService: CalendarService,
                private dateUtils: JhiDateUtils,
                private toasterService: XmToasterService) {
    }

    public ngOnInit(): void {
        setTimeout(() => {
            this.event.startDate = this.startDate;
            this.event.endDate = this.endDate;
        });
    }

    public onConfirmSave(): void {
        this.showLoader = true;
        if (this.calendar.id) {
            this.processCalendarEvent(this.calendar, this.event);
        } else {
            const copy: Event = Object.assign({}, this.event);
            copy.startDate = this.dateUtils.toDate(this.event.startDate);
            copy.endDate = this.dateUtils.toDate(this.event.endDate);
            this.calendarService.create(this.calendar).pipe(finalize(() => this.showLoader = false))
                .subscribe(
                    (calendarResp: HttpResponse<Calendar>) => {
                        const newCalendar = calendarResp.body;
                        this.processCalendarEvent(newCalendar, this.event);
                    },
                    (err) => console.info(err),
                    () => this.showLoader = false);
        }
    }

    private processCalendarEvent(calendar: Calendar, event: Event): void {
        if (calendar && event) {
            const calendarId = calendar.id;
            event.calendar = calendarId;
            this.eventService.create(event).pipe(finalize(() => this.showLoader = false))
                .subscribe(
                    (eventResp: HttpResponse<Event>) => this.onSaveSuccess(calendarId, eventResp.body),
                    (err) => console.info(err),
                    () => this.showLoader = false);
        }
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    private onSaveSuccess(calendarId: number, event: Event): void {
        this.activeModal.close(true);
        this.toasterService.success('xm-entity.calendar-event-dialog.add.success');
        this.calendar.id = calendarId;
        this.onAddEvent(event);
    }

}
