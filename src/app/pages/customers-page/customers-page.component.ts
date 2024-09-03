import { Component} from '@angular/core';
import { DecimalPipe} from '@angular/common';

import { OrdersService } from './listjs.service';
import { Router } from '@angular/router';
import Fuse from 'fuse.js';;
import { accessService } from 'src/app/services/permissions';
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../dashboards/dashboard/toast-service';

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss'],
  providers: [OrdersService, DecimalPipe]
})
export class CustomersPageComponent{

  // bread crumb items
  breadCrumbItems: any = [];
  
  customerList : any = [];
  filtered_customerList : any = [];

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

  cancelAccountDetails: any = {
    id: '',
    name: ''
  };

  lockUnlockCardDetails: any = {
    id: '',
    name: '',
    status: '',
    token: '',
  }

  loader: boolean = false;
  
  constructor(
    public service: OrdersService, 
    private router: Router,
    public access: accessService,
    public autologout : AutoLogOutService,
    private translate: TranslateService,
    private pentestService: PentestService,
    private crypto: Crypt,
    private modalService: NgbModal,
    public toastService: ToastService,
    ) { 
   }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadBreadCrumbs();
      this.loadFilter();
    });
    setTimeout(() => { this.loadBreadCrumbs(); }, 1000);
    this.loadFilter();

    this.access.getPermission()
    // this.autologout.AutoLogout();
    
    this.load_customers();
  }

  loadFilter(){
    this.selectValue = [];
    this.translate.get('CUSTOMERS.text2').subscribe((text:string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('CUSTOMERS.text3').subscribe((text:string) => { this.selectValue.push({ id: '2', name: text }) });
    this.translate.get('CUSTOMERS.text4').subscribe((text:string) => { this.selectValue.push({ id: '3', name: text }) });
    this.translate.get('CUSTOMERS.text5').subscribe((text:string) => { this.selectValue.push({ id: '4', name: text }) });
    this.translate.get('CUSTOMERS.text6').subscribe((text:string) => { this.selectValue.push({ id: '5', name: text }) });
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('CUSTOMERS.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  load_customers(){
    this.filtered_customerList = [];
    this.loader = true;
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllCustomers",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.customerList = res['Data'].reverse().map((dt:any)=>{
          let statColor = '';
          if( dt.CardStatus ) {
            switch (dt.CardStatus.toLowerCase()) {
              case 'approved': statColor = 'success'; break;
              case 'pending': statColor = 'warning'; break;
              default: statColor = 'danger'; break;
            }
          }
          return {
            id: dt.Id,
            customer_fname: dt.FirstName,
            customer_lname: dt.LastName,
            email: dt.Email,
            phone: dt.MobileNumber,
            CardStatus: dt.CardStatus,
            status_color: statColor,
            isSelected: false,
            IsCardBlock: dt.IsCardBlock,
            CardToken: dt.CardToken,
            CardState: dt.CardState,
            canBlockUnblock: (['Active', 'Temporary Blocked'].indexOf(dt.CardState) > -1)
          }
        });
        this.filter_customer();
        this.loader = false;
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_customer(){
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
    const lists = this.customerList;
    const fuse = new Fuse(lists, options)
    this.filtered_customerList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_customerList = this.filtered_customerList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_customerList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page);
  }

  setPage(page:any, e?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_customerList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_customerList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_customerList.length ? this.filtered_customerList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  customer_details(id:any){
    this.router.navigate(['customers-details-page', id])
  }

  cancel_account(data:any, content:any){
    this.cancelAccountDetails.id = data.id;
    this.cancelAccountDetails.name = `${data.customer_fname} ${data.customer_lname}`;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  cancel_confirm() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":( environment.tag == 'dev' ? "DeleteAccount" : "CancelMyAccount" ),
      "CustomerId": this.cancelAccountDetails.id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.load_customers();
        this.modalService.dismissAll();
        this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-success text-center text-white', delay: 5000 });
      },
      (err: any) => {
        this.toastService.show(( err.message ? err.message : err.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
        this.modalService.dismissAll();
      }
    )
  }

  lock_unlock_card(data:any, content:any) {
    if( !data.canBlockUnblock ) {
      this.toastService.show( 'Card State is not Active', { classname: 'bg-success text-center text-white', delay: 5000 });
      return
    }
    this.lockUnlockCardDetails.id = data.id;
    this.lockUnlockCardDetails.name = `${data.customer_fname} ${data.customer_lname}`;
    this.lockUnlockCardDetails.status = data.IsCardBlock;
    this.lockUnlockCardDetails.token = data.CardToken;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  lock_unlock_card_confirm() {
    let postParams = {
      "Service": "xp-ash-uad",
      "Method": "SetCardBlock",
      "customerId": this.lockUnlockCardDetails.id,
      "CardNumber": this.lockUnlockCardDetails.token,
      "BlockOption": ( this.lockUnlockCardDetails.status == '0' ? 'B' : 'U' )
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.load_customers();
        this.modalService.dismissAll();
        this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-success text-center text-white', delay: 5000 });
      },
      (err: any) => {
        this.toastService.show(( err.message ? err.message : err.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
        this.modalService.dismissAll();
      }
    )
  }

  getColEquiv(colList:any) {
    let res: any = [];
    colList.map((data:any)=>{
      let item = '';
      switch (data.id) {
        case '1': item = 'customer_fname'; break;
        case '2': item = 'customer_lname'; break;
        case '3': item = 'email'; break;
        case '4': item = 'phone'; break;
        case '5': item = 'CardStatus'; break;
      }
      res.push(item)
    });
    return res;
  }

}