import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Data } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, filter, map, tap } from 'rxjs/operators';
import { EventModel } from '../../main-calendar/event.model';
import { WorkPopupComponentComponent } from '../work-popup-component/work-popup-component.component';
import { WorkModel } from '../work.model';
import { WorkService } from '../work.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {
  dateFormat = 'YYYY-M-D H:m:s';
  events: EventModel<WorkModel>[];
  date: {startDate: Date, endDate: Date};
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isUpdating$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private workService: WorkService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.date = {
      startDate: moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}).toDate(),
      endDate: moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}).add(7, 'days').toDate(),
    };
    this.getEvents();
  }

  getEvents() {
    this.isLoading$.next(true);
    this.workService.getWorks(this.date.startDate, this.date.endDate).pipe(
      map(works => works.items.map(work => this.mapWorkToEvent(work))),
      tap(() => this.isLoading$.next(false)),
    ).subscribe(res => this.events = res);
  }

  addWorkOnDate(startDate: Data) {
    const ref = this.dialog.open(WorkPopupComponentComponent, { data: {startDate} });
    ref.afterClosed().pipe(
      filter(data => !!data),
    ).subscribe(() => this.getEvents());
  }

  workClicked(event: EventModel<WorkModel>) {
    const work: WorkModel = event.data;
    const ref = this.dialog.open(WorkPopupComponentComponent, { data: {work} });
    ref.afterClosed().pipe(
      tap(() => this.getEvents()),
      filter(data => !!data),
      tap(edittedWork => this.replaceElement(edittedWork)),
    ).subscribe();
  }

  changeTimeOfWork(event: {
    start: Date,
    end: Date,
    data: WorkModel,
  }) {
    this.isUpdating$.next(true);
    const { data } = event;
    const startDate = moment(event.start).format(this.dateFormat);
    const endDate = moment(event.end).format(this.dateFormat);
    this.replaceElement({...data, start: startDate, stop: endDate});
    this.workService.editWork({...data, start: startDate, stop: endDate}).pipe(
      tap(() => this.isUpdating$.next(false)),
      tap(edittedWork => this.replaceElement(edittedWork)),
    ).subscribe(() => this.getEvents());
  }

  changeDate(data: {startDate: Date, endDate: Date}) {
    this.date = data;
    this.getEvents();
  }

  private replaceElement(newWork: WorkModel) {
    const index = this.events.map(e => e.data.id).indexOf(newWork.id);

    if (index !== -1) {
      this.events[index] = this.mapWorkToEvent(newWork);
      this.events = [...this.events];
    }
  }

  private removeElement(workToRemove: WorkModel) {
    const index = this.events.map(e => e.data.id).indexOf(workToRemove.id);

    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  private mapWorkToEvent(work: WorkModel): EventModel<WorkModel> {
    const event: EventModel<WorkModel> = {
      start: work.start,
      stop: work.stop,
      title: `${work.customer.name} ${work.customer.surname} <br> ${moment(work.start, this.dateFormat).format('H:mm')}-${moment(work.stop, this.dateFormat).format('H:mm')}`,
      state: this.workService.clientState,
      data: work,
    };

    return event;
  }
}
