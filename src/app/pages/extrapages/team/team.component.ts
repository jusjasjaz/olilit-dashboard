import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GroupUser } from './team.model';
import { Team } from './data';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})

/**
 * Team Component
 */
export class TeamComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  Team!: GroupUser[];
  submitted = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Team', active: true }
    ];

     // Chat Data Get Function
     this._fetchData();
  }

  // Chat Data Fetch
  private _fetchData() {
    this.Team = Team;
  }

  /**
   * on settings button clicked from topbar
   */
     onTeamButtonClicked() {
      document.body.classList.toggle('right-bar-enabled');
      const overlay = document.querySelector('.team-overlay');
      if(overlay != null){
        overlay.classList.add('show');
      }
      const rightBar = document.getElementById('offcanvasExample');
      if(rightBar != null){
        rightBar.classList.toggle('show');
        rightBar.setAttribute('style',"visibility: visible;");
      }
    }

  /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
   SidebarHide() {
    const overlay = document.querySelector('.team-overlay');
    if(overlay != null){
      overlay.classList.remove('show');
    }
    const rightBar = document.getElementById('offcanvasExample');
    if(rightBar != null){
      rightBar.classList.remove('show');
    }
  }

}
