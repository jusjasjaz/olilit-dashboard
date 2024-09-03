import { Injectable } from '@angular/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AutoLogOutService {

  idleState = 'Not started.';
  timedOut = false;
  min:any;
  sec:any;

  constructor(
    public idle: Idle,
    public router: Router,
    private modalService: NgbModal
  ) { }

  async AutoLogout(){
    this.idle.setIdle(10*60);  // after 60mins idle
    this.idle.setTimeout(10);  // 10s countdown
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;

      this.modalService.dismissAll();
      this.router.navigate(["/auth/login"]);
    });
    this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    this.idle.onTimeoutWarning.subscribe((countdown:any) => {
      var data = countdown/60;
      this.min = data.toString().split('.')[0];
      this.sec = parseFloat(0+'.'+data.toString().split('.')[1])*60;
      this.sec = (Math.round(this.sec * 100) / 100);
      // console.log(countdown) // uncomment this if gusto mo makita timer
      this.idleState = 'Youll logout in ' + this.min+' min ' +this.sec+'  seconds!';
    });
    this.reload();
  }

  reload() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

}