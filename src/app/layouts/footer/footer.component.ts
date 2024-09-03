import { Component, OnInit } from '@angular/core';

const { version: portalVersion } = require('../../../../package.json')

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();

  version: any = '';

  constructor() { 
    this.version = portalVersion;
  }

  ngOnInit(): void {
  }

}
