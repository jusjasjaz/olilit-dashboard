import { Component} from '@angular/core';
import { DecimalPipe} from '@angular/common';
import moment from 'moment';

import { OrdersService } from './listjs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../dashboards/dashboard/toast-service';
import Fuse from 'fuse.js';;
import { accessService } from 'src/app/services/permissions';
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-customers-details-page',
  templateUrl: './customers-details-page.component.html',
  styleUrls: ['./customers-details-page.component.scss'],
  providers: [OrdersService, DecimalPipe]
})
export class CustomersDetailsPageComponent{

  // bread crumb items
  breadCrumbItems: any = [];

  customer_activity: any =[];
  customer_details: any = [];
  customer_id: any;

  document: any = [];

  pager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }

  activity_list: any = [];
  filtered_activity_list : any = [];
  activity_filter_keyword : any = '';
  activity_filter_column: any = [];
  activity_selectValue: any = [];

  transaction_list : any = [];
  filtered_transaction_list : any = [];
  transaction_filter_keyword : any = '';
  transaction_filter_column: any = [];
  transaction_selectValue: any = [];

  activeId: any = '1';
  previewURL: any = '';

  constructor(
    public service: OrdersService, 
    private activatedRoute: ActivatedRoute,
    public toastService: ToastService,
    public access: accessService,
    public autologout : AutoLogOutService,
    private translate: TranslateService,
    private pentestService: PentestService,
    private crypto: Crypt,
    private modalService: NgbModal,
    private router: Router,
    ) { 
    this.activatedRoute.params.subscribe(params => {
      this.customer_id = params['id'];
    })
   }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadBreadCrumbs();
      this.loadFilter();
    });
    setTimeout(() => { this.loadBreadCrumbs(); }, 1000);
    this.loadFilter();

    this.access.getPermission();
    // this.autologout.AutoLogout();

    if( this.access.permissions['Account Information'] && this.access.permissions['Account Information'].includes('R') ) {
      this.activeId = '1';
    } else if( this.access.permissions['Transaction History'] && this.access.permissions['Transaction History'].includes('R') ) {
      this.activeId = '2';
      this.load_customer_transactions();
    } else if( this.access.permissions['Activity Logs'] && this.access.permissions['Activity Logs'].includes('R') ) { 
      this.activeId = '3';
      this.load_customer_activity();
    }
    this.load_customer_details();
  }

  loadFilter(){
    this.transaction_selectValue = [];
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text4').subscribe((text:string) => { this.transaction_selectValue.push({ id: 't1', name: text }) });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text5').subscribe((text:string) => { this.transaction_selectValue.push({ id: 't2', name: text }) });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text6').subscribe((text:string) => { this.transaction_selectValue.push({ id: 't3', name: text }) });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text7').subscribe((text:string) => { this.transaction_selectValue.push({ id: 't4', name: text }) });
    this.activity_selectValue = [];
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.ACTIVITY_LOGS.text1').subscribe((text:string) => { this.activity_selectValue.push({ id: 'a1', name: text }) });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.ACTIVITY_LOGS.text2').subscribe((text:string) => { this.activity_selectValue.push({ id: 'a2', name: text }) });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.ACTIVITY_LOGS.text3').subscribe((text:string) => { this.activity_selectValue.push({ id: 'a3', name: text }) });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.ACTIVITY_LOGS.text4').subscribe((text:string) => { this.activity_selectValue.push({ id: 'a4', name: text }) });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.ACTIVITY_LOGS.text5').subscribe((text:string) => { this.activity_selectValue.push({ id: 'a5', name: text }) });
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('CUSTOMERS.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.ACCOUNT_INFORMATION.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  backToCustomerList() {
    this.router.navigate(['customers-page'])
  }

  load_customer_details(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetCustomer",
      "CustomerId": this.customer_id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.customer_details = res['Data'][0];
        this.document = [{
          DocumentName: this.customer_details['CardType'],
          AccountNumber: this.customer_details['AccountNumber'],
          CardNumber: this.customer_details['CardNumber'],
          ExpiryDate: this.customer_details['ExpiryDate'],
          ValidDate: this.customer_details['ValidFromDate']
        }]; // this.customer_details['Document'];
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  /******************** TRANSACTION ********************/
  load_customer_transactions(isSearch?:any){
    let type = (this.transaction_filter_column ? this.convertValue(this.transaction_filter_column) : '');
    let value = (this.transaction_filter_keyword ? this.transaction_filter_keyword : '');

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllTransactions",
      "CustomerId": this.customer_id,
      "FilterType": (type ? type : ''),
      "FilterValue": (value ? value : ''),
      "PageNumber": (isSearch ? "" : this.pager.page),
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.filtered_transaction_list = [];
        this.filtered_transaction_list = res['Data'] ? res['Data'].map((dt:any)=>{
          let prefix = dt.Type == 'Debit' ? '-' : '+';
          let color = dt.Type == 'Debit' ? 'text-danger' : 'text-success';
          let amt = dt.Type == 'Debit' ? dt.TranDebit : dt.TranCredit; // dt['TransactionAmount'].Amount;
          if( Number(amt) < 0 ) amt = 0;
          if( Number(dt.TransactionFeeAmount) > 0 ) amt = Number(amt) + Number(dt.TransactionFeeAmount);
          let amt_dec = (Math.round(amt * 100) / 100).toFixed(2);
          let date = moment(dt.TransactionDate).format('DD/MM/YYYY') != 'Invalid date' ? moment(dt.TransactionDate).format('DD/MM/YYYY') : '';
          return {
            tran_created: `${date} ${dt.PostingTime}`,
            tran_ref_id: dt.TransactionId,
            transaction_type: dt.TranTypeCode,
            transaction_desc: dt.TransDescription,
            amount: amt_dec,
            prefix: prefix,
            color: color,
          }
        }) : [];

        this.pager.pages = [];
        for (let i = 0; i < (res['TotalNoOfPage'] ? Number(res['TotalNoOfPage']) : 0); i++) {
          this.pager.pages.push(i + 1)
        }
        this.setPage_transaction(this.pager.page);
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  resetTransction() {
    this.pager = {
      limited_page: [],
      pages: [],
      page: 1,
      start: 1,
      end: 10,
      limit: 10
    }
    this.transaction_filter_column = [];
    this.transaction_filter_keyword = '';
    this.load_customer_transactions();
  }

  setPage_transaction(page:any, e?:any, loadAPI?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_transaction_list.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_transaction_list.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_transaction_list.length ? this.filtered_transaction_list.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)

    if( loadAPI ) {
      this.load_customer_transactions();
    }
  }

  /******************** ACTIVITY ********************/

  load_customer_activity(){
    // reset pager
    this.pager = {
      limited_page: [],
      pages: [],
      page: 1,
      start: 1,
      end: 10,
      limit: 10
    }

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetActivityLogs",
      "CustomerId": this.customer_id,
      "FilterType": "",
      "FilterValue": "",
      "PageNumber": "1",
      "NumberOfRecord": "1000000"
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.activity_list = res['Data'].map((dt:any)=>{
          let date = moment(dt.DateTime).format('DD/MM/YYYY') != 'Invalid date' ? moment(dt.DateTime).format('DD/MM/YYYY HH:mm:ss') : '';
          return {
            DateTime: date,
            ActorFullName: dt.ActorFullName,
            ActivityType: dt.ActivityType,
            ActivityDescription: dt.ActivityDescription,
            ParamValue: dt.ParamValue,
            Status: ( dt.IsSuccess == '1' ? 'Success' : 'Failed' )
          }
        });
        this.filter_activity();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_activity(){
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.activity_filter_column.length > 0 ? this.getColEquiv(this.activity_filter_column) : [
        "DateTime",
        "ActorFullName",
        "ActivityType",
        "ActivityDescription",
        "Status",
      ]
    };
    const lists = this.activity_list;
    const fuse = new Fuse(lists, options)
    this.filtered_activity_list = this.activity_filter_keyword ? fuse.search(this.activity_filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_activity_list = this.filtered_activity_list.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_activity_list.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage_activity(this.pager.page);
  }

  setPage_activity(page:any, e?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_activity_list.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_activity_list.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_activity_list.length ? this.filtered_activity_list.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  /******************** OTHERS ********************/

  confirmCardApprove(modal:any) {
    this.modalService.open(modal, { size: 'md', centered: true });
  }

  approveCard() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"ActivateMyCardV2",
      "CustomerId": this.customer_id,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.load_customer_details();
          this.toastService.show((res.message ? res.message : res.Message), { classname: 'bg-success text-center text-white', delay: 5000 });
        } else {
          this.toastService.show((res.message ? res.message : res.Message), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
        this.modalService.dismissAll();
      },
      (err: any) => {
        this.toastService.show((err.message ? err.message : err.Message), { classname: 'bg-danger text-center text-white', delay: 5000 });
      }
    )
    /*
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"ProcessCustomerCardApplication",
      "CustomerId": this.customer_id,
      "Status": "1"
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.customer_details.CardStatus = 'Approved';
          this.postCardApproveApplication();
          this.load_customer_details();
          this.toastService.show('Card application successfully approved.', { classname: 'bg-success text-center text-white', delay: 5000 });
        } else {
          this.toastService.show(res.Message, { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
    */
  }

  postCardApproveApplication() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"PostCardApproveApplication",
      "CustomerId": this.customer_id,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  convertValue(value:any) {
    let item = ''
    value = [value];
    if( !value ) return '';
    else {
      value.map((data:any)=>{
        switch(data.id) {
          case 't1': item = 'transdate'; break;
          case 't2': item = 'TransactionId'; break;
          case 't3': item = 'TranTypeCode'; break;
          case 't4': item = 'TransDescription'; break;
        }
      })
    }
    return item;
  }

  getColEquiv(colList:any) {
    let res: any = [];
    colList.map((data:any)=>{
      let item = '';
      switch (data.id) {
        case 't1': item = 'tran_created'; break;
        case 't2': item = 'TransactionId'; break;
        case 't3': item = 'TranTypeCode'; break;
        case 't4': item = 'TransDescription'; break;

        case 'a1': item = 'DateTime'; break;
        case 'a2': item = 'ActorFullName'; break;
        case 'a3': item = 'ActivityType'; break;
        case 'a4': item = 'ActivityDescription'; break;
        case 'a5': item = 'Status'; break;
      }
      res.push(item)
    });
    return res;
  }

  getColor(status:any) {
    let result = '';
    if( status ) {
      switch (status.toLowerCase()) {
        case 'blocked': case 'failed': 
            result = 'text-danger';
          break;
        case 'pending':
            result = 'text-warning';
          break;
        case 'approved': case 'approve': case 'success':
            result = 'text-success';
          break;
      }
    }
    return result;
  }
  
  filteredTable: any
  JsonFields: any = []
  JsonData: any

  export_csv(title:any) {
    this.setJson()
    let cDate = new Date().toLocaleString()
    cDate = 'Export Date : ' + moment(cDate).format('MM/DD/YYYY')
    let header = `${this.customer_details.FirstName} ${this.customer_details.LastName} (${this.customer_id})` + '\n\n' + cDate + '\n'

    var csvStr = header + this.JsonFields.join(',') + '\n'
    csvStr += this.JsonData
    if (csvStr != '') {
      csvStr = csvStr.substring(0, csvStr.length - 1)
    }
    var hiddenElement = document.createElement('a')
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvStr)
    hiddenElement.target = '_blank'
    hiddenElement.download = title + '.csv'
    hiddenElement.click()
  }

  setJson() {
    let header = {
      th1: '',
      th2: '',
      th3: '',
      th4: '',
      th5: ''
    }
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text4').subscribe((text:string) => { header.th1 = text; });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text5').subscribe((text:string) => { header.th2 = text; });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text6').subscribe((text:string) => { header.th3 = text; });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text7').subscribe((text:string) => { header.th4 = text; });
    this.translate.get('CUSTOMERS.CUSTOMER_DETAILS.TRANSACTION_HISTORY.text8').subscribe((text:string) => { header.th5 = text; });
    this.JsonData = ''
    this.JsonFields = [header.th1, header.th2, header.th3, header.th4, header.th5]
    this.filteredTable = this.filtered_transaction_list;
    this.filteredTable.forEach((element:any) => {
      this.JsonData +=
        element.tran_created + ',' +
        element.tran_ref_id + ',' +
        element.transaction_type + ',' +
        element.transaction_desc.split("#").join(' ') + ',' +
        `${element.prefix}$${element.amount}` + '\n';
    })
  }

  previewImage(url:any, imageModal:any) {
    this.previewURL = '';
    if( url ) {
      this.modalService.open(imageModal, { size: 'md', centered: true });
      this.previewURL = url;
    }
  }

}
