import { Component, OnInit } from '@angular/core';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { accessService } from 'src/app/services/permissions';

import Fuse from 'fuse.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../dashboards/dashboard/toast-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: any = [];

  partnerList : any = [];
  filtered_partnerList : any = [];

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

  partnerDetailsToUpdate: any = {
    id: '',
    name: '',
    email: '',
    limit: '',
  };

  constructor(
    private crypto: Crypt,
    private pentestService: PentestService,
    private translate: TranslateService,
    private modalService:NgbModal,
    public access: accessService,
    public toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBreadCrumbs();
    this.loadFilter();
    this.load_partners();

    if( localStorage.getItem('selectedPartnerName') ) localStorage.removeItem('selectedPartnerName');
  }

  loadBreadCrumbs() {
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { this.breadCrumbItems.push({ label: text }) });
    this.translate.get('SIDEBAR.text10').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  loadFilter(){
    this.selectValue = [];
    this.translate.get('PARTNER_LIST.FILTER.text1').subscribe((text:string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('PARTNER_LIST.FILTER.text2').subscribe((text:string) => { this.selectValue.push({ id: '2', name: text }) });
    this.translate.get('PARTNER_LIST.FILTER.text3').subscribe((text:string) => { this.selectValue.push({ id: '3', name: text }) });
  }

  load_partners(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetPartnerUserList",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.partnerList = res['Data'];
        this.filter_partner();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_partner(){
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "customer_fname",
        "customer_lname",
        "email",
        "phone",
        "CardStatus"
      ]
    };
    const lists = this.partnerList;
    const fuse = new Fuse(lists, options)
    this.filtered_partnerList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_partnerList = this.filtered_partnerList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_partnerList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page);
  }

  updatePartner(centerDataModal:any, data:any) {
    this.reset();
    this.modalService.open(centerDataModal, { centered: true });
    this.partnerDetailsToUpdate.id = data.userId;
    this.partnerDetailsToUpdate.name = `${data.firstName} ${data.lastName}`;
    this.partnerDetailsToUpdate.email = data.email;
    this.partnerDetailsToUpdate.limit = '';
  }

  confirmUpdate() {
      let postParams = {
        "Service":"xp-ash-uad",
        "Method":"AdminSetIsCreationLimit",
        "PartnerId": this.partnerDetailsToUpdate.id,
        "SetLimit": this.partnerDetailsToUpdate.limit,
        "isCreationNoLimit": "0" // 0 inactive or default 10 ### 1 unlimited will interfere with set limit
      };
      // console.log(postParams)
      let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
      this.pentestService.request(encrypted_data).subscribe(
        async (data: any) => {
          let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
          // console.log(res)
          if( res['isSuccess'] == true ) {
            this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-success text-center text-white', delay: 5000 });
            this.load_partners();
            this.modalService.dismissAll();
          } else {
            this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
            this.modalService.dismissAll();
          }
        },
        (err: any) => {
          console.log(err)
        }
      )
  }

  viewPartner(data:any) {
    localStorage.setItem('selectedPartnerName', `${data['firstName']} ${data['lastName']}`);
    this.router.navigate(['referral-list', data.userId])
  }

  reset() {
    this.partnerDetailsToUpdate = {
      id: '',
      name: '',
      email: '',
      limit: '',
    };
  }

  getColEquiv(colList:any) {
    let res: any = [];
    colList.map((data:any)=>{
      let item = '';
      switch (data.id) {
        case '1': item = 'firstName'; break;
        case '2': item = 'lastName'; break;
        case '3': item = 'email'; break;
      }
      res.push(item)
    });
    return res;
  }

  setPage(page:any, e?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_partnerList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_partnerList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_partnerList.length ? this.filtered_partnerList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  numbersOnly(e:any, setMax?:any){
    let val = e.target.value;
    if( setMax ) {
      if( val > 50 ) e.target.value = 50;
    } else {
      let allowed = ['Backspace','Enter','Delete','Tab','0','.'];
      return allowed.indexOf(e.key) >= 0 || !!Number(e.key);
    }
    return;
  }

}
