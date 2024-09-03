import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { Crypt } from 'src/app/services/crypto-serve';
import { Device } from '@capacitor/device';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { ToastService } from '../dashboards/dashboard/toast-service';
import { PentestService } from 'src/app/services/pentest';
import { TranslateService } from '@ngx-translate/core';
import { accessService } from 'src/app/services/permissions';

import Fuse from 'fuse.js';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-referrals-page',
  templateUrl: './referrals-page.component.html',
  styleUrls: ['./referrals-page.component.scss']
})
export class ReferralsPageComponent implements OnInit {
  partnerID: any;
  partnerName: any;

  breadCrumbItems: any = [];

  loader: boolean = true;

  referralList : any = [];
  filteredReferralList : any = [];

  pager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }

  filterKeyword : any = '';
  filterColumn: any = [];
  selectValue: any = [];

  selectedReferral: any = {
    id: '',
    code: '',
    name: ''
  };

  referralData: any = {
    id: '',
    code: '',
    name: '',
    expiryDate: '',
    noValidDate: false,
    usageCount: '',
    unrestricted: false,
    optIn: '',
    source: '1',
    sourceOthers: '',
    scans: '0',
  }

  device: any = {
    os: '',
    platform: '',
  }

  position: any = {
    latitude: '',
    longitude: ''
  }

  partnerData: any = {
    entries: '0',
    scans: '0',
    successfulReferrals: '0',
  }

  constructor(
    private crypto: Crypt,
    private pentestService: PentestService,
    private translate: TranslateService,
    private modalService:NgbModal,
    public toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    public access: accessService,
    private router: Router
  ) { 
    this.activatedRoute.params.subscribe(params => {
      this.partnerID = params['id'];
    })

    if( isNaN(this.partnerID) ) this.router.navigate(['partner-list'])
  }

  ngOnInit(): void {
    this.partnerName = localStorage.getItem("selectedPartnerName");
    
    this.loadBreadCrumbs(); 
    this.loadFilter();

    this.loadPartnerData();

    this.load_referral();

    this.getDeviceInfo();
    this.getCurrentPosition();
  }

  loadBreadCrumbs( isReferralSelected?:any ){
    this.breadCrumbItems = [];
    this.translate.get('SIDEBAR.text10').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: false })
    });
    this.translate.get('REFERRAL_TS.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: ( isReferralSelected ? false : true ) })
    });
    if( isReferralSelected ) {
      this.translate.get('REFERRAL_TS.text5').subscribe((text:string) => { 
        this.breadCrumbItems.push({ label: text, active: true })
      });
    }
  }

  loadFilter(){
    this.selectValue = [];
    this.translate.get('REFERRAL_TS.text2').subscribe((text:string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('REFERRAL_TS.text3').subscribe((text:string) => { this.selectValue.push({ id: '2', name: text }) });
  }

  async getCurrentPosition(){
    const coordinates = await Geolocation.getCurrentPosition();
    this.position['latitude'] = coordinates['coords']['latitude'];
    this.position['longitude'] = coordinates['coords']['longitude'];
  };

  async getDeviceInfo(){
    const info = await Device.getInfo();
    this.device['os'] = info['operatingSystem'];
    this.device['platform'] = info['platform'];
  }

  loadPartnerData() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralsByPartnerIdV2",
      "PartnerId": this.partnerID
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['Data'][0] ) {
          this.partnerData.entries = res['Data'][0].TotalReferralEntries;
          this.partnerData.scans = res['Data'][0].TotalReferralScans;
          this.partnerData.successfulReferrals = res['Data'][0].SuccessfulReferralScans;
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  load_referral(){
    this.referralList = this.filteredReferralList = [];
    this.loader = true;
    
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralEntryByPartnerIDV2",
      "PartnerId": this.partnerID
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.referralList = res['Data'] ? res['Data'] : [];
        this.referralList.sort(function(a:any, b:any) {
          return moment(new Date(b.DateTimeGenerated)).format('YYYYMMDD Hm').localeCompare(moment(new Date(a.DateTimeGenerated)).format('YYYYMMDD Hm'))
        });
        this.filter_referral();
        this.loader = false;
      },
      (err: any) => {
        console.log(err)
        this.loader = false;
      }
    )
  }

  filter_referral() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filterColumn.length > 0 ? this.getColEquiv(this.filterColumn) : [
        "ReferralCode",
        "ReferralName",
      ]
    };
    const lists = this.referralList;
    const fuse = new Fuse(lists, options)
    this.filteredReferralList = this.filterKeyword ? fuse.search(this.filterKeyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filteredReferralList = this.filteredReferralList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filteredReferralList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page);
  }

  createReferral(createModal:any) {
    this.referralData = {
      name: '',
      qrcodeName: '',
      expiryDate: '',
      noValidDate: false,
      usageCount: '',
      unrestricted: false,
      optIn: '',
      source: '1',
      sourceOthers: '',
    }
    if( !this.position['latitude'] ) {
      let notif = '';
      this.translate.get('REFERRAL_TS.text4').subscribe((text:string) => { notif = text; })
      this.toastService.show(notif, { classname: 'bg-danger text-center text-white', delay: 5000 });
      this.getCurrentPosition();
    } else {
      this.modalService.open(createModal, { centered: true });
    }
  }

  confirmCreateReferral() {
    this.modalService.dismissAll();
    let createPostParams = {
      "Service":"xp-ash-uad",
      "Method":"CreateCustomReferralV2",
      "PartnerId": this.partnerID,
      "IsUsageNoLimit": (this.referralData.unrestricted == true ? '1' : '0'),
      "ReferralAvailableCount": this.referralData.usageCount,
      "ReferralCodeName": this.referralData.name,
      "ReferralOptInMarketing": (this.referralData.optIn == true ? '1' : '0'),
      "ReferralExpiryDate": this.referralData.expiryDate,
      "IsUsageNoExpire": (this.referralData.noValidDate == true ? '1' : '0'),
      "LocationLatitude": this.position['latitude'],
      "LocationLongitude": this.position['longitude'],
      "Location": "",
      "DeviceType": this.device['platform'],
      "DeviceOS": this.device['os'],
      "SOId": "1",
    };
    let create_encrypted_data = this.crypto.encryptJson(createPostParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(create_encrypted_data).subscribe(
      async (data: any) => {
        let create_res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( create_res['isSuccess'] == true ){
          this.toastService.show((create_res['Message'] ? create_res['Message'] : create_res['message']), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_referral(); /* reload data list of referral */
        } else {
          this.toastService.show((create_res['Message'] ? create_res['Message'] : create_res['message']), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  updateReferral(updateModal:any, data:any) {
    let noValidDate = moment(new Date(data.ValidUntil)).format('YYYY') > '4000' ? true : false;
    let unrestricted = data.RestrictedNoOfUsage == 'Unlimited' ? true : false;
    let optIn = ((data.OptInToMarketing == '1' || data.OptInToMarketing.toLowerCase() == 'true') ? true : false);

    this.referralData = {
      id: data.RefId,
      code: data.ReferralCode,
      name: data.ReferralName,
      expiryDate: noValidDate ? '' : moment(new Date(data.ValidUntil)).format('YYYY-MM-DD'),
      noValidDate: noValidDate,
      usageCount: unrestricted ? '' : data.RestrictedNoOfUsage,
      unrestricted: unrestricted,
      optIn: optIn,
      scans: data.NumberOfScans,
    }
    this.modalService.open(updateModal, { centered: true });
  }

  confirmUpdateReferral() {
    if( !this.referralData.unrestricted ) {
      if( Number(this.referralData.usageCount) < Number(this.referralData.scans) ) {
        let phrase: any = { 1: "", 2: "" };
        this.translate.get('REFERRAL_TS.text7').subscribe((text:string) => { phrase[1] = text; });
        this.translate.get('REFERRAL_TS.text8').subscribe((text:string) => { phrase[2] = text; });
        this.toastService.show(`${phrase[1]} ${this.referralData.scans} ${phrase[2]} ${this.referralData.scans}`, { classname: 'bg-danger text-center text-white', delay: 5000 });
        return;
      }
    }

    let updatePostParams = {
      "Service":"xp-ash-uad",
      "Method":"UpdateCustomReferralV2",
      "PartnerId": this.partnerID,
      "RefId": this.referralData.id,
      "ReferralCodeName": this.referralData.name,
      "IsUsageNoLimit": (this.referralData.unrestricted == true ? '1' : '0'),
      "ReferralAvailableCount": this.referralData.usageCount,
      "ReferralOptInMarketing": (this.referralData.optIn == true ? '1' : '0'),
      "ReferralExpiryDate": this.referralData.expiryDate,
      "IsUsageNoExpire": (this.referralData.noValidDate == true ? '1' : '0')
    };
    let update_encrypted_data = this.crypto.encryptJson(updatePostParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(update_encrypted_data).subscribe(
      async (data: any) => {
        let update_res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( update_res['isSuccess'] == true ){
          this.toastService.show((update_res['Message'] ? update_res['Message'] : update_res['message']), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_referral(); /* reload data list of referral */
        } else {
          this.toastService.show((update_res['Message'] ? update_res['Message'] : update_res['message']), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
        this.modalService.dismissAll();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  deleteReferral(deleteModal:any, data:any) {
    if( data.TotalQRCodeUsed > 0 ) return;
    this.referralData = {
      id: data.RefId,
      code: data.ReferralCode,
      name: data.ReferralName,
    }
    this.modalService.open(deleteModal, { centered: true });
  }

  confirmDeleteReferral() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"DeleteAllRefAndQRV2",
      "PartnerId": this.partnerID,
      "ReferralCode": this.referralData.code,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ){
          this.toastService.show((res['Message'] ? res['Message'] : res['message']), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_referral(); /* reload data list of referral */
        } else {
          this.toastService.show((res['Message'] ? res['Message'] : res['message']), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
        this.modalService.dismissAll();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  viewReferral(data:any) {
    this.loadBreadCrumbs(true);
    this.selectedReferral.id = data.RefId;
    this.selectedReferral.code = data.ReferralCode;
    this.selectedReferral.name = data.ReferralName
    this.selectedReferral.expiry = data.ValidUntil;
    this.selectedReferral.usage = data.RestrictedNoOfUsage;
    this.selectedReferral.usageRemaining = data.ScansRemaining;
  }

  loadReferrals() {
    this.loadBreadCrumbs();
    this.load_referral();
    this.loadPartnerData();
    this.selectedReferral = {
      id: '',
      code: '',
      name: '',
      expiry: '',
      usage: '',
      usageRemaining: ''
    };
  }

  backToPartnerList() {
    this.router.navigate(['partner-list']);
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

  getColEquiv(colList:any) {
    let res: any = [];
    colList.map((data:any)=>{
      let item = '';
      switch (data.id) {
        case '1': item = 'ReferralCode'; break;
        case '2': item = 'ReferralName'; break;
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
    this.pager.start = this.filteredReferralList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filteredReferralList.length ? ((end = this.pager.limit * this.pager.page) > this.filteredReferralList.length ? this.filteredReferralList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  statusInfo(status:any, type:any) {
    let color = ''; let state = true; let value = '';
    switch(status) {
      case 'Active':
          color = 'text-active';
          value = '1';
        break;
      case 'Pending':
          color = 'text-warning';
          value = '2';
        break;
      case 'Claimed':
          color = 'text-active';
          value = '3';
        break;
      case 'Expired':
          color = 'text-danger';
          value = '4';
        break;
      case 'Inactive':
          color = 'text-danger';
          state = false;
          value = '5';
        break;
      case 'Deactivated':
          color = 'text-gray';
          value = '7'
        break;
    }

    let result;
    switch (type) {
      case 'color': result = color;  break;
      case 'state': result = state;  break;
      case 'value': result = value;  break;
    }
    return result;
  }
  
  openPicker() {
    const inputElement = document.querySelector('.flatpickr input') as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  }
}
