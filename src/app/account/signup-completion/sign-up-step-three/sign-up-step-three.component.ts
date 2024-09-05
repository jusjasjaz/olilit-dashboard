import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-step-three',
  templateUrl: './sign-up-step-three.component.html',
  styleUrls: ['./sign-up-step-three.component.scss']
})
export class SignUpStepThreeComponent implements OnInit {

  months:  any = [];
  dates:  any = [];
  years:  any = [];
  amounts:  any = [];
  selectedMonth: string = '';
  selectedDate: string = '';
  selectedYear: string = '';
  selectedAmounts: string = '';

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadMonths();
    this.loadDates();
    this.loadYears();
    this.loadAmounts();
  }

  loadAmounts() {
    this.amounts = [
      { id: '1', name: 'Amount 1' },
      { id: '2', name: 'Amount 2' },
    ];
  }

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
    this.router.navigate(['']);
  }

  previous() {
    this.router.navigate(['/auth/sign-up-completion-step-two']);
  }

}
