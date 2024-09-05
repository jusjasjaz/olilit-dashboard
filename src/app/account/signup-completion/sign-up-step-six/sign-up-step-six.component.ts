import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-step-six',
  templateUrl: './sign-up-step-six.component.html',
  styleUrls: ['./sign-up-step-six.component.scss']
})
export class SignUpStepSixComponent implements OnInit {

  months:  any = [];
  dates:  any = [];
  years:  any = [];
  selectedMonth: any = null;
  selectedDate: any = null;
  selectedYear: any = null;
  selectedState: any = null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMonths();
    this.loadDates();
    this.loadYears();
  }

  states = [
    { id: '1', name: 'State 1' },
    { id: '2', name: 'State 2' },
  ];

  loadMonths() {
    this.months = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: (i + 1).toString() }));
  }

  loadDates() {
    this.dates = Array.from({ length: 31 }, (_, i) => ({ id: i + 1, name: (i + 1).toString() }));
  }

  loadYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => ({ id: currentYear - i, name: (currentYear - i).toString() }));
  }

  signIn() {
    this.router.navigate(['/auth/login']);
  }

  next() {
    this.router.navigate(['/auth/sign-up-completion-success']);
  }

  previous() {
    this.router.navigate(['/auth/sign-up-completion-step-five']);
  }

}
