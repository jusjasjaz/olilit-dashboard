import { Component} from '@angular/core';
import { DecimalPipe} from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrdersService } from './listjs.service';
import { MerchantService } from 'src/app/services/merchant';
import Fuse from 'fuse.js';;
import { ToastService } from '../dashboards/dashboard/toast-service';
import { Router } from '@angular/router';
import { accessService } from 'src/app/services/permissions';
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchants-page',
  templateUrl: './merchants-page.component.html',
  styleUrls: ['./merchants-page.component.scss'],
  providers: [OrdersService, DecimalPipe]
})
export class MerchantsPageComponent{

  breadCrumbItems: any = [];

  merchantList: any = [];
  filtered_merchantList: any = [];

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

  register_details: any = {
    username: '',
    password: '',
    email: '',
    mobile: '',
    merchant_name: '',
    fname: '',
    mname: '',
    lname: '',
    gender: '',
    bdate: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    agree: '',
    id_number: '',
  }

  fieldTextType!: boolean;
  maxDate: string | undefined;

  constructor(
    private merchantService: MerchantService,
    private modalService: NgbModal,
    public service: OrdersService, 
    public toastService: ToastService,
    private router: Router,
    public access: accessService,
    public autologout : AutoLogOutService,
    private translate: TranslateService,
    private pentestService: PentestService,
    private crypto: Crypt,
    ) {
   }

  ngOnInit(): void {
    this.maxDate = new Date().toISOString().split('T')[0]; 
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadBreadCrumbs();
      this.loadFilter();
    });
    setTimeout(() => { this.loadBreadCrumbs(); }, 1000);
    this.loadFilter();

    this.access.getPermission();
    // this.autologout.AutoLogout();
    
    this.load_merchants();
  }

  loadFilter(){
    this.selectValue = [];
    this.translate.get('MERCHANTS.text3').subscribe((text:string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('MERCHANTS.text4').subscribe((text:string) => { this.selectValue.push({ id: '2', name: text }) });
    this.translate.get('MERCHANTS.text5').subscribe((text:string) => { this.selectValue.push({ id: '3', name: text }) });
    this.translate.get('MERCHANTS.text6').subscribe((text:string) => { this.selectValue.push({ id: '4', name: text }) });
    this.translate.get('MERCHANTS.text7').subscribe((text:string) => { this.selectValue.push({ id: '5', name: text }) });
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('MERCHANTS.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  setAgree(e:any){
    this.register_details.agree = e.target.checked;
  }

  load_merchants(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllMerchants",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.merchantList = res['Data'].reverse();
        this.filter_merchant();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_merchant(){
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "MerchantName",
        "FirstName",
        "LastName",
        "Email",
        "MobileNumber",
      ]
    };
    const lists = this.merchantList;
    const fuse = new Fuse(lists, options)
    this.filtered_merchantList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_merchantList = this.filtered_merchantList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_merchantList.length / this.pager.limit); i++) {
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
    this.pager.start = this.filtered_merchantList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_merchantList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_merchantList.length ? this.filtered_merchantList.length : end) : 0;
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
        case '1': item = 'MerchantName'; break;
        case '2': item = 'FirstName'; break;
        case '3': item = 'LastName'; break;
        case '4': item = 'Email'; break;
        case '5': item = 'MobileNumber'; break;
      }
      res.push(item)
    });
    return res;
  }

  getColor(status:any) {
    let result = 'danger';
    switch (status.toLowerCase()) {
      case 'pending':
          result = 'warning';
        break;
      case 'approved': case 'approve':
          result = 'success';
        break;
    }
    return result;
  }

  registerMerchant() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"RegisterMerchant",
      "Username": this.register_details.username,
      "Password": this.register_details.password,
      "Email": this.register_details.email,
      "MobileNumber": this.register_details.mobile,
      "MerchantName": this.register_details.merchant_name,
      "FirstName": this.register_details.fname,
      "LastName": this.register_details.lname,
      "MiddleName": this.register_details.mname,
      "Gender": this.register_details.gender,
      "Birthday": this.register_details.bdate,
      "Address1": this.register_details.address1,
      "Address2": this.register_details.address2,
      "City": this.register_details.city,
      "State": this.register_details.state,
      "Zip": this.register_details.zip,
      "Country": this.register_details.country,
      "IdNumber": this.register_details.id_number
    };
    console.log(postParams)
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        console.log(res)
        if( res['isSuccess'] == true ) {
          this.toastService.show('Registration has been processed.', { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_merchants();
          this.modalService.dismissAll();
        } else {
          this.toastService.show(( res.Message ? res.Message : res.message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
          // this.modalService.dismissAll();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  process_registration(){
    if( this.register_details.password.match(/[a-z]/) == null ){
      let msg = '';
      this.translate.get('MERCHANTS.REGISTER_MERCHANT.VALIDATIONS.text1').subscribe((text:string) => { msg = text; });
      this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
    }else if( this.register_details.password.match(/[A-Z]/) == null ){
      let msg = '';
      this.translate.get('MERCHANTS.REGISTER_MERCHANT.VALIDATIONS.text2').subscribe((text:string) => { msg = text; });
      this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
    }else if( this.register_details.password.match(/\d+/g) == null ){
      let msg = '';
      this.translate.get('MERCHANTS.REGISTER_MERCHANT.VALIDATIONS.text3').subscribe((text:string) => { msg = text; });
      this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
    }else if( this.register_details.password.match(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) == null ){
      let msg = '';
      this.translate.get('MERCHANTS.REGISTER_MERCHANT.VALIDATIONS.text4').subscribe((text:string) => { msg = text; });
      this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
    }else if( this.register_details.password.length < 8 ){
      let msg = '';
      this.translate.get('MERCHANTS.REGISTER_MERCHANT.VALIDATIONS.text5').subscribe((text:string) => { msg = text; });
      this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
    } else if( !this.isEmail(this.register_details.email) ) {
      let msg = '';
      this.translate.get('MERCHANTS.REGISTER_MERCHANT.VALIDATIONS.text6').subscribe((text:string) => { msg = text; });
      this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
    } else {
      this.registerMerchant();
    }
  }

  openModal(content: any) {
    this.reset();
    this.modalService.open(content, { size: 'md', centered: true });
  }

  merchant_details(id:any){
    this.router.navigate(['merchant-details', id])
  }

  isEmail(search:string):boolean {
    var  serchfind:boolean;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    serchfind = regexp.test(search);
    return serchfind
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  reset(){
    this.register_details = {
      username: '',
      password: '',
      email: '',
      mobile: '',
      merchant_name: '',
      fname: '',
      mname: '',
      lname: '',
      gender: '',
      bdate: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      agree: '',
      id: '',
    }
  }

  checkAge(field: any) {
    let birthdate = field.target.value;
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      // return age > 18;
    }
    if( age < 18 ) {
      let msg = '';
      this.translate.get('MERCHANTS.REGISTER_MERCHANT.VALIDATIONS.text7').subscribe((text:string) => { msg = text; });
      this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      this.register_details.bdate = ''
    }
  }
}
