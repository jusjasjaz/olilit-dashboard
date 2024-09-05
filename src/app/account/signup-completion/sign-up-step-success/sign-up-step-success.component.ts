import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-step-success',
  templateUrl: './sign-up-step-success.component.html',
  styleUrls: ['./sign-up-step-success.component.scss']
})
export class SignUpStepSuccessComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  signIn() {
    this.router.navigate(['/auth/login']);
  }

  next() {
    this.router.navigate(['/auth/login']);
  }

}
