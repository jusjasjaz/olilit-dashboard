import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-step-two',
  templateUrl: './sign-up-step-two.component.html',
  styleUrls: ['./sign-up-step-two.component.scss']
})
export class SignUpStepTwoComponent implements OnInit {
  months:  any = [];
  dates:  any = [];
  years:  any = [];
  selectedMonth: any = null;
  selectedDate: any = null;
  selectedYear: any = null;
  selectedState: any = null;
  
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadMonths();
    this.loadDates();
    this.loadYears();
  }

  states = [
    { id: '1', name: 'Amount 1' },
    { id: '2', name: 'Amount 2' },
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
    this.router.navigate(['/auth/sign-up-completion-step-three']);
  }

  previous() {
    this.router.navigate(['/auth/sign-up-completion-step-one']);
  }

}
