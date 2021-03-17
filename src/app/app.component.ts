import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { timeInterval } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  startDate: any
  msPerSec = 1000;
  hourPerDay = 24;
  minPerHr = 60;
  secPerMin  = 60;
  total = 0;
  fd_count = 0;
  private subscription: Subscription;
  timeDiff: number;
  isRunning = null
  Display: Display = {
    seconds: null,
    minutes: null,
    hours: null
  }

  ngOnInit() {
    this.checkTimer()
  }

  inialStatus() {
    this.timeDiff = 0;
    this.Display.hours = 0;
    this.Display.minutes = 0;
    this.Display.seconds = 0;
    this.isRunning = null;
    this.total = 0;
    this.fd_count = 0;
    window.localStorage.removeItem('end_time')
    window.localStorage.removeItem('total_amount')
    this.subscription.unsubscribe();
  }

  private gettimeDiff() {
    this.timeDiff = this.startDate + 86400000 - new Date().getTime();
    if (this.timeDiff <= 0) return this.inialStatus()
    this.allocateTimeUnits(this.timeDiff);
  }

  private allocateTimeUnits(timeDiff) {
    this.total = (this.total += 1 + ((this.fd_count*0.25)))
    const total_string = this.total.toString()
    window.localStorage.setItem("total_amount", total_string)
    this.Display.seconds = Math.floor((timeDiff) / (this.msPerSec) % this.secPerMin);
    this.Display.minutes = Math.floor((timeDiff) / (this.msPerSec * this.minPerHr) % this.secPerMin);
    this.Display.hours = Math.floor((timeDiff) / (this.msPerSec * this.minPerHr * this.secPerMin) % this.hourPerDay);
  }

  startTimer() {
    this.startDate = new Date().getTime();
    window.localStorage.setItem("end_time", this.startDate)
    this.runTimer()
  }

  checkTimer() {
    const hasTime = window.localStorage.getItem('end_time') 
    const hasMoney = window.localStorage.getItem('total_amount')
    this.total = Number(hasMoney)
    const recordtime = new Date(Number(hasTime)).getTime() + 86400000
    const currentTime = new Date().getTime()
    if ( recordtime - currentTime > 0) {
      this.startDate = new Date(recordtime).getTime();
      this.isRunning = 'disabled'
      this.runTimer()
    }
  }

  runTimer() {
    this.isRunning = 'disabled'
    this.subscription = interval(1000).pipe(timeInterval())
    .subscribe(x => { this.gettimeDiff() });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  add() {
    this.fd_count += 1;
  }

  remove() {
    if (this.fd_count == 0) return
    this.fd_count -= 1;
  }
}

export interface Display {
  seconds: number,
  minutes: number
  hours: number
}