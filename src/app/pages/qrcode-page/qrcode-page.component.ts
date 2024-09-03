import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { Crypt } from 'src/app/services/crypto-serve';
import { Device } from '@capacitor/device';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Geolocation } from '@capacitor/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { AutoLogOutService } from 'src/app/services/auto-logout';

import { PentestService } from 'src/app/services/pentest';
import { accessService } from 'src/app/services/permissions';
import { environment } from 'src/environments/environment';
import { ToastService } from '../dashboards/dashboard/toast-service';

import Fuse from 'fuse.js';;
import moment from 'moment';

import Chart from 'chart.js/auto'

@Component({
  selector: 'app-qrcode-page',
  templateUrl: './qrcode-page.component.html',
  styleUrls: ['./qrcode-page.component.scss']
})
export class QrcodePageComponent implements OnInit {
  @Input() partnerID: any;
  @Input() selectedReferral: any;
  @Output("loadReferrals") loadReferrals: EventEmitter<any> = new EventEmitter();

  @ViewChild('pieCanvasQRCode1', { static: false }) pieCanvasQRCode1!: ElementRef
  @ViewChild('pieCanvasQRCode2', { static: false }) pieCanvasQRCode2!: ElementRef
  @ViewChild('pieCanvasQRCode3', { static: false }) pieCanvasQRCode3!: ElementRef

  pieChartQRCode1!: any;
  pieChartQRCode2!: any;
  pieChartQRCode3!: any;

  breadCrumbItems: any = [];
  userInfo:any=[];

  currentSection : any = 'Reports'
  currentLowerSection : any = 'Overview'

  activeId: any = 1;
  popDetails: boolean = false;
  
  totalScanText: any = '';
  noDataText: any = '';

  deviceScans: any = [];
  filtered_deviceScans: any = [];
  locationScans: any = [];
  filtered_locationScans: any = [];

  showStatusUpdate: any = false;

  qrCodeList: any = [];
  qrCodeListFiltered: any = [];
  qrCodeListSelectValue: any = [];
  qrCodeListFilterColumn: any = [];
  qrCodeFilterKeyword: any = '';

  usersByRefCodeFiltered: any = [];
  usersByRefCodeFilterKeyword: any = '';
  usersByRefCodeFilterColumn: any = [];
  usersByRefCodeSelectValue: any = [];

  usersByQRCodeFiltered: any = [];
  usersByQRCodeFilterKeyword: any = '';
  usersByQRCodeFilterColumn: any = [];
  usersByQRCodeSelectValue: any = [];

  manualEntryStatus: any = '';
  activeQRCount: any = 1;

  barChart: any;
  barGraphColum: any;
  barGraphData: any = {
    xAxis: [],
    yAxis: [],
  };

  device: any = {
    os: '',
    platform: '',
  }

  position: any = {
    latitude: '',
    longitude: ''
  }

  qrcodeData: any = {
    id: '',
    code: '',
    name: '',
    source: '',
    sourceOthers: '',
    expiryDate: '',
    noValidDate: false,
    usageCount: '',
    unrestricted: false,
    optIn: '',
    successRate: '',
    dateGenerated: '',
    statusToggle: '',
    link: '',
  }

  qrPieData: any = {
    entries: '0',
    scans: '0',
    entries_scans: 0,
    android: '0',
    ios: '0',
  }

  referralData: any = {
    entries: '0',
    scans: '0',
    entries_scans: 0,
    successfulReferrals: '0',
    android: '0',
    ios: '0',
    manualEntry: '0'
  }

  devicePager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }

  pager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }

  loader: any = {
    barGraph: true,
    scansByDevice: true,
    scansByLocation: true,
    codeUseHistory: true,
    referralList: true,
    referralListByCode: true
  }

  constructor(
    public access: accessService,
    public autologout : AutoLogOutService,
    private translate: TranslateService,
    private pentestService: PentestService,
    private crypto: Crypt,
    private modalService:NgbModal,
    public toastService: ToastService,
    ) {}

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
    this.loadFilter();

    this.loadBarGraphData();

    this.loadReferralData();
    this.loadDeviceScans();
    this.loadLocationScans();

    this.getDeviceInfo();
    this.getCurrentPosition();
  }

  loadFilter() {
    this.qrCodeListSelectValue = [];
    this.translate.get('QRCODE_TS.text1').subscribe((text:string) => { this.qrCodeListSelectValue.push({ id: 'r1', name: text }) });
    this.translate.get('QRCODE_TS.text2').subscribe((text:string) => { this.qrCodeListSelectValue.push({ id: 'r2', name: text }) });

    this.usersByRefCodeSelectValue = [];
    this.usersByQRCodeSelectValue = [];

    this.translate.get('QRCODE_TS.text3').subscribe((text:string) => { 
      this.usersByQRCodeSelectValue.push({ id: 'r3', name: text });
      this.usersByRefCodeSelectValue.push({ id: 'r3', name: text });
    }); // source of referral

    this.translate.get('QRCODE_TS.text2').subscribe((text:string) => { 
      this.usersByQRCodeSelectValue.push({ id: 'r4', name: text });
      this.usersByRefCodeSelectValue.push({ id: 'r4', name: text });
    }); // status

    this.translate.get('QRCODE_TS.text4').subscribe((text:string) => { 
      this.usersByQRCodeSelectValue.push({ id: 'r5', name: text });
      this.usersByRefCodeSelectValue.push({ id: 'r5', name: text });
    }); // date

    this.translate.get('QRCODE_TS.text5').subscribe((text:string) => { 
      this.usersByQRCodeSelectValue.push({ id: 'r6', name: text });
      this.usersByRefCodeSelectValue.push({ id: 'r6', name: text });
    }); // location

    this.translate.get('QRCODE_TS.text6').subscribe((text:string) => { 
      this.usersByQRCodeSelectValue.push({ id: 'r7', name: text });
      this.usersByRefCodeSelectValue.push({ id: 'r7', name: text });
    }); // device
  }

  backToReferralList() {
    this.loadReferrals.emit();
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

  loadReferralData() {
    /* pie chart 1 */
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralsByPartnerIdV2",
      "PartnerId": this.partnerID,
      "ReferralCode": this.selectedReferral.code
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['Data'] && res['Data'][0] ) {
          this.referralData.successfulReferrals = res['Data'][0].SuccessfulReferralScans;
          this.referralData.entries = ( isNaN(res['Data'][0].TotalReferralEntries) ? '0' : res['Data'][0].TotalReferralEntries );
          this.referralData.scans = ( isNaN(res['Data'][0].TotalReferralScans) ? '0' : res['Data'][0].TotalReferralScans );
          this.referralData.entries_scans = Number(this.referralData.entries) + Number(this.referralData.scans);
        }

        /* load pie graph */
        let label: any = { 1: "", 2: "" };
        this.translate.get('QRCODE_TS.text15').subscribe((text:string) => { label[1] = text });
        this.translate.get('QRCODE_TS.text11').subscribe((text:string) => { label[2] = text });
        this.loadPieChartQRCode("1", [label[1],label[2]], [this.referralData.entries_scans, this.referralData.successfulReferrals], ["#70C6FF", "#88cc57"]);
      },
      (err: any) => {
        console.log(err)
      }
    )

    /* pie chart 2 */
    let postParams1 = {
      "Service":"xp-ash-uad",
      "Method":"GetDeviceOsAndManualEntryV2",
      "PartnerId": this.partnerID,
      "ReferralCode": this.selectedReferral.code
    };
    let encrypted_data1 = this.crypto.encryptJson(postParams1, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data1).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['Data'] ) {
          res['Data'].map((d:any)=>{
            if( d['DeviceOS'] ) {
              switch (d['DeviceOS'].toLowerCase()) {
                case 'ios': this.referralData.ios = d['DeviceCount']; break;
                case 'android': this.referralData.android = d['DeviceCount']; break;
                case 'manual entry': this.referralData.manualEntry = d['DeviceCount']; break;
              }
            }
          })
        }

        /* load pie graph */
        let label: any = { 1: "", 2: "", 3: "" };
        this.translate.get('QRCODE_TS.text12').subscribe((text:string) => { label[1] = text });
        this.translate.get('QRCODE_TS.text13').subscribe((text:string) => { label[2] = text });
        this.translate.get('QRCODE_TS.text14').subscribe((text:string) => { label[3] = text });
        this.loadPieChartQRCode("2", [label[1],label[2],label[3]], [this.referralData.android, this.referralData.ios, this.referralData.manualEntry], ["#70C6FF", "#88cc57", "#fce071"]);
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  loadQRPieData() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetTotalInputsAndScansByQRIdV2",
      "PartnerId": this.partnerID,
      "QRId": this.qrcodeData.id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['Data'] && res['Data'][0] ) {
          this.qrPieData.entries = ( isNaN(res['Data'][0].TotalInputs) ? '0' : res['Data'][0].TotalInputs );
          this.qrPieData.scans = ( isNaN(res['Data'][0].TotalScans) ? '0' : res['Data'][0].TotalScans );
          this.qrPieData.entries_scans = Number(this.qrPieData.entries) + Number(this.qrPieData.scans);
        }
      },
      (err: any) => {
        console.log(err)
      }
    )

    /* pie chart 3 */
    let postParams1 = {
      "Service":"xp-ash-uad",
      "Method":"GetDeviceOSByQRIdV2",
      "PartnerId": this.partnerID,
      "QRId": this.qrcodeData.id
    };
    let encrypted_data1 = this.crypto.encryptJson(postParams1, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data1).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['Data'] ) {
          res['Data'].map((d:any)=>{
            if( d['DeviceOS'] ) {
              switch (d['DeviceOS'].toLowerCase()) {
                case 'ios': this.qrPieData.ios = d['DeviceCount']; break;
                case 'android': this.qrPieData.android = d['DeviceCount']; break;
              }
            }
          })
        }
        /* load pie graph */
        let label: any = { 1: "", 2: "" };
        this.translate.get('QRCODE_TS.text12').subscribe((text:string) => { label[1] = text });
        this.translate.get('QRCODE_TS.text13').subscribe((text:string) => { label[2] = text });
        this.loadPieChartQRCode("3", [label[1],label[2]], [this.qrPieData.android, this.referralData.ios], ["#70C6FF", "#88cc57"]);
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  private loadPieChartQRCode(number?:any, text?:any ,value?:any, color?:any) {
    let ctx = '';
    switch (number) {
      case "1":
          if (this.pieChartQRCode1) this.pieChartQRCode1.destroy()
          ctx = this.pieCanvasQRCode1.nativeElement.getContext('2d')
        break;
      case "2":
          if (this.pieChartQRCode2) this.pieChartQRCode2.destroy()
          ctx = this.pieCanvasQRCode2.nativeElement.getContext('2d')
        break;
      case "3":
          if (this.pieChartQRCode3) this.pieChartQRCode3.destroy()
          ctx = this.pieCanvasQRCode3.nativeElement.getContext('2d')
        break;
    }

    let chart = new Chart(ctx,{
      "type": 'doughnut',
      "data": {
        labels: text,
        datasets: [
          {
            data: value,
            backgroundColor: color,
            hoverBackgroundColor: color,
            hoverBorderColor: "#fff"
          }],

      },
      options: {
        maintainAspectRatio:true,
        plugins: {
          legend: {
            position: "center",
            align: "center"
          },
        },
      },
    })

    switch (number) {
      case "1": this.pieChartQRCode1 = chart; break;
      case "2": this.pieChartQRCode2 = chart; break;
      case "3": this.pieChartQRCode3 = chart; break;
    }
  }

  loadBarGraphData(dateRangeFrom?:any, dateRangeTo?:any){
    /* reset */
    this.loader.barGraph = true;
    /* end of reset */

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralEntryByReferralCodeV2",
      "PartnerId": this.partnerID,
      "ReferralCode": this.selectedReferral.code
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        /* reset graph data */
        this.barGraphData = {
          xAxis: [],
          yAxis: [],
        }

        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        let result = res['Data'] ? res['Data'] : [];

        result.map((ent:any, key:any)=>{
          this.barGraphData['yAxis'].push(ent['ScanCount']);
          this.barGraphData['xAxis'].push(ent['QRCodeName']);
        });
        
        this.loadBarGraph() /* load bar graph display */
        this.loader.barGraph = false;
      },
      (err: any) => {
        console.log(err)
        this.loader.barGraph = false;
      }
    )
  }

  private loadBarGraph() {
    /* bar graph no data caption */
    this.translate.get('QRCODE_TS.text7').subscribe((text:string) => { this.noDataText = text; });
    this.translate.get('QRCODE_TS.text16').subscribe((text:string) => { this.totalScanText = text; });
    let that = this;

    this.barGraphColum = {
      series: [
        {
          name: "Scan count",
          data: this.barGraphData['yAxis']
        }
      ], 
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function(event:any, chartContext:any, config:any) {
       
          }
        },
      },
      noData: {
        text: this.noDataText,
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: '#878A99',
          fontSize: '30px',
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          dataLabels: {
            total: { enabled: true },
          },
          horizontal: false,
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: this.barGraphData['xAxis'],
        labels: {
          style: {
            colors: ["#77cf3e"],
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (value:any) => {
            return value.toFixed(0)
          },
        },
        title:{
          text: this.totalScanText
        },
      },
      colors: ['#88cc57']
    };
  }

  loadDeviceScans(){
    this.loader.scansByDevice = true;
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralEntryByDeviceOSV2",
      "PartnerId": this.partnerID,
      "ReferralCode":this.selectedReferral.code
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.deviceScans = res['Data'] ? res['Data'] : [];
        this.deviceScans.map((data:any)=>{
          switch (data['DeviceOS']) {
            case 'ios': data['DeviceOS'] = 'IOS'; break;
            default: 
                data['DeviceOS'] = data['DeviceOS'].toLowerCase().replace(/\b[a-z]/g, function(letter:any) {
                  return letter.toUpperCase();
                }); 
              break;
          }
          return data;
        })
        this.loader.scansByDevice = false;
        this.filter_device_scans();
      },
      (err: any) => {
        console.log(err)
        this.loader.scansByDevice = false;
      }
    )
  }

  filter_device_scans() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: []
    };
    const lists = this.deviceScans;
    this.filtered_deviceScans = lists;
    let nc = 0;
    this.filtered_deviceScans = this.filtered_deviceScans.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.devicePager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_deviceScans.length / this.devicePager.limit); i++) {
      this.devicePager.pages.push(i + 1)
    }
    this.setPageDeviceScans(this.devicePager.page, '', this.filtered_deviceScans);
  }

  loadLocationScans(){
    this.filter_location_scans(); // reset
    this.loader.scansByLocation = true;
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralEntryByLocationV2",
      "PartnerId": this.partnerID,
      "ReferralCode":this.selectedReferral.code
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.locationScans = res['Data'] ? res['Data'] : [];
        this.loader.scansByLocation = false;
        this.filter_location_scans();
      },
      (err: any) => {
        console.log(err)
        this.loader.scansByLocation = false;
      }
    )
  }

  filter_location_scans() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: []
    };
    const lists = this.locationScans;
    this.filtered_locationScans = lists;
    let nc = 0;
    this.filtered_locationScans = this.filtered_locationScans.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_locationScans.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }

    this.setPage(this.pager.page, '', this.filtered_locationScans);
  }

  loadQRCodeReport(){
    /* reset */
    this.qrCodeList = [];
    this.filterQRCodeList();
    this.loader.codeUseHistory = true;
    this.activeQRCount = 0;
    this.manualEntryStatus = '';
    /* end of reset */

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetQRListByReferralCodeV2",
      "PartnerId": this.partnerID,
      "ReferralCode": this.selectedReferral.code
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.qrCodeList = res['Data'] ? res['Data'] : [];
        if( this.qrCodeList ) {
          this.qrCodeList.sort(function(a:any, b:any) {
            return b.QRid - a.QRid;
          });
        }

        this.qrCodeList.map((a:any)=>{
          if( a.QRStatus && a.QRStatus.toLowerCase() == 'active' ) this.activeQRCount += 1;
          if( a.QRSourceEntry == '1' ) this.manualEntryStatus = a.QRStatus;
        })

        this.qrCodeList.map((data:any)=>{
          data.QRSuccessRate = parseFloat(data.QRSuccessRate).toFixed(2);
          return data;
        })
        this.filterQRCodeList();

        this.loader.codeUseHistory = false;
      },
      (err: any) => {
        console.log(err)
        this.loader.codeUseHistory = false;
      }
    )
  }

  filterQRCodeList() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.qrCodeListFilterColumn.length > 0 ? this.getColEquiv(this.qrCodeListFilterColumn) :[
        "ReferralCode",
        "ReferralName",
        "Statuses"
      ]
    };
    const lists = this.qrCodeList;
    const fuse = new Fuse(lists, options)
    this.qrCodeListFiltered = this.qrCodeFilterKeyword ? fuse.search(this.qrCodeFilterKeyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.qrCodeListFiltered = this.qrCodeListFiltered.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.qrCodeListFiltered.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page, '', this.qrCodeListFiltered);
  }

  deleteQRCode(deleteConfirmModal: any, ds: any) {
    this.qrcodeData.id = ds.QRid;
    this.qrcodeData.name = ds.QRCodeName;
    this.qrcodeData.source = ds.QRSourceEntry;
    this.modalService.open(deleteConfirmModal, { centered: true });
  }

  confirmDeleteQRCode() {
    /* if manual entry is selected */
    if( this.qrcodeData.source == '1' ) {
      this.confirmDeleteReferral();
      return;
    }

    let deletePostParam = {
      "Service":"xp-ash-uad",
      "Method":"DeleteQRCodeV2",
      "PartnerId": this.partnerID,
      "QRId": this.qrcodeData.id,
    };
    this.modalService.dismissAll();
    let encrypted_data = this.crypto.encryptJson(deletePostParam, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.toastService.show(res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
        this.loadQRCodeReport();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  confirmDeleteReferral() {
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"DeleteAllRefAndQRV2",
      "PartnerId": this.partnerID,
      "ReferralCode": this.selectedReferral.code,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ){
          this.toastService.show((res['Message'] ? res['Message'] : res['message']), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.loadReferrals.emit();
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

  createQRCode(centerDataModal: any) {
    this.reset();
    this.modalService.open(centerDataModal, { centered: true });
  }

  confirmCreateQRCode() {
    this.modalService.dismissAll();
    let createPostParams = {
      "Service":"xp-ash-uad",
      "Method":"GenerateQRCodeV2",
      "PartnerId": this.partnerID,
      "ReferralCode":this.selectedReferral.code,
      "SOId": (this.qrcodeData.source == '0' ? this.qrcodeData.sourceOthers : this.qrcodeData.source),
      "QRName": this.qrcodeData.name
    };
    let create_encrypted_data = this.crypto.encryptJson(createPostParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(create_encrypted_data).subscribe(
      async (data: any) => {
        let create_res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( create_res['isSuccess'] == true ){
          this.toastService.show((create_res['Message'] ? create_res['Message'] : create_res['message']), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.loadQRCodeReport(); /* reload data list of referral */
          this.loadBarGraphData();
        } else {
          this.toastService.show((create_res['Message'] ? create_res['Message'] : create_res['message']), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  viewQRCode(centerDataModal?: any, ds?:any, dontOpenModal?:any){
    this.qrcodeData.noValidDate = moment(new Date(ds.QRExpiryCode)).format('YYYY') > '4000' ? true : false;
    this.qrcodeData.unrestricted = ds.QRAvailableCount >= '9999999' ? true : false;

    this.qrcodeData.id = ds.QRid;
    this.qrcodeData.name = ds.QRCodeName;
    this.qrcodeData.status = ds.QRStatus;
    this.qrcodeData.expiryDate = this.qrcodeData.noValidDate ? '' : moment(new Date(ds.QRExpiryCode)).format('YYYY-MM-DD');
    this.qrcodeData.usageCount = this.qrcodeData.unrestricted ? '' : ds.QRAvailableCount;
    this.qrcodeData.successRate = ds.QRSuccessRate;
    this.qrcodeData.dateGenerated = moment(new Date(ds.QRCreateDate)).format('MM/DD/YYYY');
    this.qrcodeData.optIn = ds.QROptInMarketing.toLowerCase() == 'true' ? true : false;
    this.qrcodeData.statusToggle = this.statusInfo(this.qrcodeData.status,'value'); 
    this.showStatusUpdate = ['Active','Inactive','Expired','Deactivated'].includes('Active') ? true : false; // ds.Statuses

    if( isNaN(ds.QRSourceEntry) ) {
      this.qrcodeData.source = '0';
      this.qrcodeData.sourceOthers = ds.QRSourceEntry;
    } else {
      this.qrcodeData.source = ds.QRSourceEntry;
    }

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetQRBase64ByQrIdV2",
      "PartnerId": this.partnerID,
      "QRId": this.qrcodeData.id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        let data_res = res['Data'][0] ? res['Data'][0] : []
        this.qrcodeData.link = data_res['QRImage'];

        if( !dontOpenModal ) this.modalService.open(centerDataModal, { centered: true });
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  updateStatusNotif(updateStatusModal?: any) {
    this.modalService.dismissAll();
    this.modalService.open(updateStatusModal, { centered: true });
  }

  updateQRCode(updateStatusModal?:any) {
    /* Auto activate & deactivate condition for Manual Entry */
    /* if not manual entry */
    if( this.qrcodeData.source != '1' ) {
      /* if user selected activate or deactivate */
      if( ['1','7'].includes(this.qrcodeData.statusToggle) ) { 
        /* if selected is activate & manual entry is not active */
        if( this.qrcodeData.statusToggle == '1' && this.manualEntryStatus.toLowerCase() != 'active' ) { 
          this.updateStatusNotif(updateStatusModal);
          return;
        }
        /* if selected is deactivate & manual entry is active */ 
        if( this.qrcodeData.statusToggle == '7' && this.manualEntryStatus.toLowerCase() == 'active' ) { 
          if( this.activeQRCount == 2 ) {
            this.updateStatusNotif(updateStatusModal);
            return;
          }
        }
      }
    } else {
      /* manual entry */
      if( this.qrcodeData.statusToggle == '7' ) {
        this.updateStatusNotif(updateStatusModal);
        return;
      }
    }
    this.updateConfirm();
  }

  updateConfirm() {
    let updatePostParams = {
      "Service":"xp-ash-uad",
      "Method":"UpdateQRCodeV2",
      "PartnerId": this.partnerID,
      "QRId": this.qrcodeData.id,
      "SOId": (this.qrcodeData.source == '0' ? this.qrcodeData.sourceOthers : this.qrcodeData.source),
      "QRName": this.qrcodeData.name,
      "QRStatus": this.qrcodeData.statusToggle
    };
    let update_encrypted_data = this.crypto.encryptJson(updatePostParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(update_encrypted_data).subscribe(
      async (data: any) => {
        let update_res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( update_res['isSuccess'] == true ){
          this.toastService.show(update_res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.loadQRCodeReport(); /* reload data list of referral */
        } else {
          this.toastService.show(update_res['Message'], { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
        this.modalService.dismissAll();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }
  
  loadUsersWhoScanByQRCode(isSearch?:any){
    this.loader.referralListByCode = true;
    let type = (this.usersByQRCodeFilterColumn ? this.getColEquiv(this.usersByQRCodeFilterColumn, true) : '');
    let value = (this.usersByQRCodeFilterKeyword ? this.usersByQRCodeFilterKeyword : '');

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralListByQRCodeV2",
      "PartnerId": this.partnerID,
      "QRId": this.qrcodeData.id,
      "FilterType": (type ? type : ''),
      "FilterValue": (value ? value : ''),
      "PageNumber": (isSearch ? "" : this.pager.page),
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.usersByQRCodeFiltered = res['Data'] ? res['Data'] : [];
        this.usersByQRCodeFiltered.sort(function(a:any, b:any) {
          return (b.ScannedDateTime).localeCompare((a.ScannedDateTime));
        });

        this.pager.pages = [];
        for (let i = 0; i < (res['TotalNoOfPage'] ? Number(res['TotalNoOfPage']) : 0); i++) {
          this.pager.pages.push(i + 1)
        }
        this.setPage(this.pager.page, '', this.usersByQRCodeFiltered);
        this.loader.referralListByCode = false;
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  loadUsersWhoScanByRefCode(isSearch?:any){
    this.loader.referralList = true;
    let type = (this.usersByRefCodeFilterColumn ? this.getColEquiv(this.usersByRefCodeFilterColumn, true) : '');
    let value = (this.usersByRefCodeFilterKeyword ? this.usersByRefCodeFilterKeyword : '');

    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetReferralListByReferralCodeV2",
      "PartnerId": this.partnerID,
      "ReferralCode": this.selectedReferral.code,
      "FilterType": (type ? type : ''),
      "FilterValue": (value ? value : ''),
      "PageNumber": (isSearch ? "" : this.pager.page),
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.usersByRefCodeFiltered = res['Data'] ? res['Data'] : [];
        this.usersByRefCodeFiltered.sort(function(a:any, b:any) {
          return (b.ScannedDateTime).localeCompare((a.ScannedDateTime));
        });

        this.pager.pages = [];
        for (let i = 0; i < (res['TotalNoOfPage'] ? Number(res['TotalNoOfPage']) : 0); i++) {
          this.pager.pages.push(i + 1)
        }
        this.setPage(this.pager.page, '', this.usersByRefCodeFiltered);
        this.loader.referralList = false;
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  setPageDeviceScans(page:any, e?:any, list?:any, api?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.devicePager.page = page > this.devicePager.pages.length ? this.devicePager.pages.length : (page < 1 ? 1 : page)
    this.devicePager.start = list.length ? (1 + (this.devicePager.limit * (this.devicePager.page - 1))) : 0
    this.devicePager.end = list.length ? ((end = this.devicePager.limit * this.devicePager.page) > list.length ? list.length : end) : 0;
    let a = this.devicePager.page - 10
    if (a < 0) {
      a = 0
    }
    this.devicePager.limited_page = this.devicePager.pages.slice(a, 10 + a)
  }

  setPage(page:any, e?:any, list?:any, api?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = list.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = list.length ? ((end = this.pager.limit * this.pager.page) > list.length ? list.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)

    if( api ) {
      switch (api) {
        case 'entryByPartnerID':
            this.loadUsersWhoScanByRefCode();
          break;
        case 'entryByRefCode':
            this.loadUsersWhoScanByQRCode();
          break;
      }
    }
  }

  convertSource(value?:any) {
    let res = '';
    switch (value) {
      case '1': res = 'Manual Entry'; break;
      case '2': res = 'Undefined QR Code Scan'; break;
      case '3': res = 'Banner Ads'; break;
      case '4': res = 'Email'; break;
      case '5': res = 'Newspaper'; break;
      case '6': res = 'Website'; break;
      default: res = `${value} (Others)`; break;
    }
    return res;
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

  getColEquiv(colList:any, isString?:any) {
    let res: any = [];
    let list: any = [];
    let converted_string: any = '';
    
    if( isString ) colList = [colList];
    
    colList.map((data:any)=>{
      let item = '';
      switch (data.id) {
        case 'r1': item = 'QRCodeName'; break;
        case 'r2': item = 'QRStatus'; break;

        case 'r3': item = 'SourceofReferral'; break;
        case 'r4': item = 'Status'; break;
        case 'r5': item = 'ScannedDateTime'; break;
        case 'r6': item = 'Location'; break;
        case 'r7': item = 'DeviceType'; break;
      }
      converted_string = item;
      res.push(item)
    });

    if( isString ) return converted_string;
    return res;
  }

  onSectionChange(sectionId: string) {
    switch (sectionId) {
      case 'Reports':
          if(this.activeId == '3') this.loadQRCodeReport();
          this.loadReferralData();
        break;
      case 'Referral List Entry':
          this.loadUsersWhoScanByRefCode();
        break;
    }
    this.currentSection = sectionId;
  }

  onLowerSectionChange(sectionId: string) {
    switch (sectionId) {
      case 'Referral Code Use history': case 'QR Code Report':
          this.loadQRCodeReport();
        break;
      case 'Overview':
          this.filter_location_scans();
          this.activeId = 1;
          this.loadBarGraphData();
        break;
    }
    this.currentLowerSection = sectionId;
  }

  toggleDetails(data:any) {
    this.popDetails = !this.popDetails;
    this.viewQRCode('', data, true);
    this.loadQRPieData();
    this.loadUsersWhoScanByQRCode();
  }

  backToReports() {
    this.popDetails = false;
    this.reset();
    this.activeId = 3;
    this.loadQRCodeReport();
    this.loadReferralData();
  }

  resetPager() {
    this.devicePager = {
      limited_page: [],
      pages: [],
      page: 1,
      start: 1,
      end: 10,
      limit: 10
    }
    this.pager = {
      limited_page: [],
      pages: [],
      page: 1,
      start: 1,
      end: 10,
      limit: 10
    }
  }

  reset(type?:any) {
    switch (type) {
      case 'entryByPartnerID':
          this.resetPager();
          this.usersByRefCodeFilterColumn = [];
          this.usersByRefCodeFilterKeyword = '';
          this.loadUsersWhoScanByRefCode();
        break;
      case 'entryByRefCode':
          this.resetPager();
          this.usersByQRCodeFilterColumn = [];
          this.usersByQRCodeFilterKeyword = '';
          this.loadUsersWhoScanByQRCode();
        break;
      case 'reports':
          this.resetPager();
        break;
      default:
          /* reset */
          this.qrcodeData = {
            id: '',
            code: '',
            name: '',
            source: '',
            sourceOthers: '',
            expiryDate: '',
            noValidDate: false,
            usageCount: '',
            unrestricted: false,
            optIn: '',
            successRate: '',
            dateGenerated: '',
            statusToggle: '',
            link: '',
          }
          /* end of reset */
        break;
    }
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
