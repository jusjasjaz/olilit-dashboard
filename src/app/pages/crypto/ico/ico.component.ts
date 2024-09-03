import { Component, OnInit } from '@angular/core';

import { ChatMessage } from './ico.model';
import { chatMessagesData } from './data';

@Component({
  selector: 'app-ico',
  templateUrl: './ico.component.html',
  styleUrls: ['./ico.component.scss']
})

/**
 * Ico Component
 */
export class IcoComponent implements OnInit {

   // bread crumb items
   breadCrumbItems!: Array<{}>;
   chatMessagesData!: ChatMessage[];

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Crypto' },
      { label: 'ICO List', active: true }
    ];

    // Chat Data Get Function
    this._fetchData();
  }

  // Chat Data Fetch
  private _fetchData() {
    this.chatMessagesData = chatMessagesData;
  }

}
