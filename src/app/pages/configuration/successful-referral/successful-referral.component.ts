import { Crypt } from 'src/app/services/crypto-serve';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

import Fuse from 'fuse.js';

import { environment } from 'src/environments/environment';
import { ToastService } from '../../dashboards/dashboard/toast-service';
import { PentestService } from 'src/app/services/pentest';
import { TranslateService } from '@ngx-translate/core';
import { accessService } from 'src/app/services/permissions';

@Component({
  selector: 'app-successful-referral',
  templateUrl: './successful-referral.component.html',
  styleUrls: ['./successful-referral.component.scss']
})
export class SuccessfulReferralComponent implements OnInit {

  breadCrumbItems: any = [];

  feeList : any = [];
  filtered_feeList : any = [];

  pager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }

  filter_keyword : any = '';
  filter_column: any = [];
  selectValue: any = [];

  active: any = {
    id: '',
    amount: '',
    description: '',
  }

  constructor(
    private modalService: NgbModal,
    private pentestService: PentestService,
    public toastService: ToastService,
    private crypto: Crypt,
    private translate: TranslateService,
    public access: accessService,
  ) { }

  ngOnInit(): void {
    this.loadBreadCrumbs();
    this.loadFilter();
    this.load_fees();
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { this.breadCrumbItems.push({ label: text }) });
    this.translate.get('REFERRAL_CONFIGURATION.text1').subscribe((text:string) => { this.breadCrumbItems.push({ label: text, active: true }) });
  }

  loadFilter(){
    this.selectValue = [];
    this.translate.get('REFERRAL_CONFIGURATION.text2').subscribe((text:string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('REFERRAL_CONFIGURATION.text3').subscribe((text:string) => { this.selectValue.push({ id: '2', name: text }) });
    this.translate.get('REFERRAL_CONFIGURATION.text4').subscribe((text:string) => { this.selectValue.push({ id: '3', name: text }) });
  }

  load_fees() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralCondition",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.feeList = res['Data']
        this.filter_fees();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_fees() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "missionConditionId",
        "missionConditionDescription",
        "missionConditionAmount",
        "missionConditionCreateDate",
      ]
    };
    const lists = this.feeList;
    const fuse = new Fuse(lists, options)
    this.filtered_feeList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_feeList = this.filtered_feeList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_feeList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page);
  }

  process_fee() {
    this.modalService.dismissAll();
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"UpdateReferralCondition",
      "id": this.active.id,
      "description": this.active.description,
      "amount": this.active.amount
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_fees();
          this.active = {
            id: '',
            amount: '',
            description: '',
          }
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  openModal(content: any, data: any) {
    this.active = {
      id: data.missionConditionId,
      amount: data.missionConditionAmount,
      description: data.missionConditionDescription,
    }
    this.modalService.open(content, { size: 'sm', centered: true });
  }

  setPage(page:any, e?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_feeList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_feeList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_feeList.length ? this.filtered_feeList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  getColEquiv(colList:any) {
    let res: any = [];
    colList.map((data:any)=>{
      let item = '';
      switch (data.id) {
        case '1': item = 'missionConditionId'; break;
        case '2': item = 'missionConditionDescription'; break;
        case '3': item = 'missionConditionAmount'; break;
      }
      res.push(item)
    });
    return res;
  }

  numbersOnly(e:any){
    let val = e.target.value;
    let count = val.split('.').length - 1;
    let allowed = ['Backspace','Enter','Delete','Tab','0','.'];
    // handle dot
    if( e.key == '.' ) {
      if( count == 1 ) return false; // one dot only
      if( val.length == '6' ) return false; // maxlength is 7, so dot is not allowed to be in last
      if( val == '' ) this.active.amount = '0'; // add zero if dot click first
    }
    return allowed.indexOf(e.key) >= 0 || !!Number(e.key);
  }

}