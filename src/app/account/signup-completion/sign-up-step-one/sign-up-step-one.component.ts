import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-step-one',
  templateUrl: './sign-up-step-one.component.html',
  styleUrls: ['./sign-up-step-one.component.scss']
})
export class SignUpStepOneComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  signIn() {
    this.router.navigate(['/auth/login']);
  }

}
