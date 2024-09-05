import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-step-three',
  templateUrl: './sign-up-step-three.component.html',
  styleUrls: ['./sign-up-step-three.component.scss']
})
export class SignUpStepThreeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
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
