import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-step-four',
  templateUrl: './sign-up-step-four.component.html',
  styleUrls: ['./sign-up-step-four.component.scss']
})
export class SignUpStepFourComponent implements OnInit {

  personLimit:  any = [];
  accidentLimit:  any = [];
  months:  any = [];
  dates:  any = [];
  years:  any = [];
  claimants: any = [];
  selectedMonth: string = '';
  selectedDate: string = '';
  selectedYear: string = '';
  selectedPersonLimit: string = '';
  selectedAccidentLimit: string = '';
  selectClaimants: string = '';
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadPersonLimit();
    this.loadAccidentLimit();
    this.loadMonths();
    this.loadDates();
    this.loadYears();
    this.loadClaimants();
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

  loadPersonLimit() {
    this.personLimit = [
      { id: '1', name: 'Choice 1' },
      { id: '2', name: 'Choice 2' },
    ];
  }

  loadAccidentLimit() {
    this.accidentLimit = [
      { id: '1', name: 'Choice 1' },
      { id: '2', name: 'Choice 2' },
    ];
  }

  loadClaimants() {
    this.claimants = [
      { id: '1', name: 'Choice 1' },
      { id: '2', name: 'Choice 2' },
    ];
  }



  signIn() {
    this.router.navigate(['/auth/login']);
  }

  next() {
    this.router.navigate(['/auth/sign-up-completion-step-five']);
  }

  previous() {
    this.router.navigate(['/auth/sign-up-completion-step-three']);
  }

}
