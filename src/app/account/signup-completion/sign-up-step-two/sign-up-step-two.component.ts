import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sign-up-step-two',
  templateUrl: './sign-up-step-two.component.html',
  styleUrls: ['./sign-up-step-two.component.scss']
})
export class SignUpStepTwoComponent implements OnInit {
  months: any[] = [];
  dates: any[] = [];
  years: any[] = [];
  selectedMonth: string = '';
  selectedDate: string = '';
  selectedYear: string = '';

  constructor(
    private router: Router,  private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.loadMonths();
    this.loadDates();
    this.loadYears();
  }

  loadMonths() {
    this.months = [
      { id: '1', name: 'January' },
      { id: '2', name: 'February' },
      { id: '3', name: 'March' },
      { id: '4', name: 'April' },
      { id: '5', name: 'May' },
      { id: '6', name: 'June' },
      { id: '7', name: 'July' },
      { id: '8', name: 'August' },
      { id: '9', name: 'September' },
      { id: '10', name: 'October' },
      { id: '11', name: 'November' },
      { id: '12', name: 'December' }
    ];
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
