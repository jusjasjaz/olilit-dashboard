import { Component} from '@angular/core';
import { DecimalPipe} from '@angular/common';

import { OrdersService } from './listjs.service';
import { ActivatedRoute, Router } from '@angular/router';
import Fuse from 'fuse.js';;
import { accessService } from 'src/app/services/permissions';
import { ToastService } from '../dashboards/dashboard/toast-service';
import moment from 'moment';
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchant-details',
  templateUrl: './merchant-details.component.html',
  styleUrls: ['./merchant-details.component.scss'],
  providers: [OrdersService, DecimalPipe]
})
export class MerchantDetailsComponent{

  breadCrumbItems: any = [];
 
  merchant_id: any;
  merchant_details: any = [];

  transaction_list : any = [];
  filtered_transaction_list : any = [];
  transaction_filter_keyword : any = '';
  transaction_filter_column: any = [];
  transaction_selectValue: any = [];

  pager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }

  col: any = 'col-1';

  constructor(
    public service: OrdersService, 
    private activatedRoute: ActivatedRoute,
    public access: accessService,
    public toastService: ToastService,
    public autologout : AutoLogOutService,
    private translate: TranslateService,
    private pentestService: PentestService,
    private crypto: Crypt,
    private router: Router,
    ) { 
    this.activatedRoute.params.subscribe(params => {
      this.merchant_id = params['id'];
    })
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
    
    this.load_merchant_details();
  }

  loadFilter(){
    this.transaction_selectValue = [];
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text1').subscribe((text:string) => { this.transaction_selectValue.push({ id: '1', name: text }) });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text2').subscribe((text:string) => { this.transaction_selectValue.push({ id: '2', name: text }) });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text3').subscribe((text:string) => { this.transaction_selectValue.push({ id: '3', name: text }) });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text4').subscribe((text:string) => { this.transaction_selectValue.push({ id: '4', name: text }) });
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('MERCHANTS.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  backToMerchantList() {
    this.router.navigate(['merchants-page'])
  }

  load_merchant_details(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetMerchant",
      "MerchantId": this.merchant_id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.merchant_details = res['Data'][0];
        this.load_merchant_transactions(); // load transaction
        if( this.merchant_details.Status.toLowerCase() == 'pending' ) this.col = 'col-1';
        if( !this.access.permissions['Merchant Details'] && !this.access.permissions['Merchant Details'].includes('P') ) this.col = 'col-3';
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  load_merchant_transactions(isSearch?:any){
    let type = (this.transaction_filter_column ? this.convertValue(this.transaction_filter_column) : '');
    let value = (this.transaction_filter_keyword ? this.transaction_filter_keyword : '');

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllMerchantTransactions",
      "MerchantId": this.merchant_id,
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
          let amt = dt['TransactionAmount'].Amount;
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
    this.load_merchant_transactions();
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
      this.load_merchant_transactions();
    }
  }

  convertValue(value:any) {
    let item = ''
    value = [value];
    if( !value ) return '';
    else {
      value.map((data:any)=>{
        switch(data.id) {
          case '1': item = 'transdate'; break;
          case '2': item = 'TransactionId'; break;
          case '3': item = 'TranTypeCode'; break;
          case '4': item = 'TransDescription'; break;
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
        case '1': item = 'tran_created'; break;
        case '2': item = 'tran_ref_id'; break;
        case '3': item = 'transaction_type'; break;
        case '4': item = 'transaction_desc'; break;
      }
      res.push(item)
    });
    return res;
  }

  getColor(status:any) {
    let result = 'text-danger';
    if( status ) {
      switch (status.toLowerCase()) {
        case 'pending':
            result = 'text-warning';
          break;
        case 'approved': case 'approve':
            result = 'text-success';
          break;
      }
    }
    return result;
  }

  approveMerchant(){ 
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"ProcessMerchantRegistration",
      "MerchantId": this.merchant_id,
      "Status": "1"
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.merchant_details.Status = 'Approved';
          this.load_merchant_details();
          this.toastService.show(res.Message, { classname: 'bg-success text-center text-white', delay: 5000 });
        } else {
          this.toastService.show(res.Message, { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filteredTable: any
  JsonFields: any = []
  JsonData: any

  export_csv(title:any) {
    this.setJson()
    let cDate = new Date().toLocaleString()
    cDate = 'Export Date : ' + moment(cDate).format('MM/DD/YYYY')
    let header = `${this.merchant_details.FirstName} ${this.merchant_details.LastName} (${this.merchant_id})` + '\n\n' + cDate + '\n'

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
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text1').subscribe((text:string) => { header.th1 = text; });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text2').subscribe((text:string) => { header.th2 = text; });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text3').subscribe((text:string) => { header.th3 = text; });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text4').subscribe((text:string) => { header.th4 = text; });
    this.translate.get('MERCHANTS.MERCHANT_DETAILS.TRANSACTION_HISTORY.text5').subscribe((text:string) => { header.th5 = text; });
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

}