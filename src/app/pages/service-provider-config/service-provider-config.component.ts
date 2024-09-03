import { Component, ElementRef, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Fuse from 'fuse.js';;
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { ToastService } from '../dashboards/dashboard/toast-service';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';
import { accessService } from 'src/app/services/permissions';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import Editor from '@toast-ui/editor';

@Component({
  selector: 'app-service-provider-config',
  templateUrl: './service-provider-config.component.html',
  styleUrls: ['./service-provider-config.component.scss'],
  providers: []
})
export class ServiceProviderConfigComponent{
  breadCrumbItems: any = [];

  service_list : any = [];
  filtered_service_list : any = [];

  merchantList: any = [];

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
    p1: null,
    p2: null,
    p3: null,
    p4: null,
    edit: false,
  }

  constructor(
    private modalService: NgbModal,
    public toastService: ToastService,
    public autologout : AutoLogOutService,
    private pentestService: PentestService,
    private crypto: Crypt,
    public access: accessService,
    private translate: TranslateService,
    ) { 
   }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadBreadCrumbs();
    });
    setTimeout(() => { this.loadBreadCrumbs(); }, 1000);
    this.load_merchants();

    this.access.getPermission();
    // this.autologout.AutoLogout();
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
        res['Data'].reverse().map((ml:any)=>{
          this.merchantList.push({ id: ml.Id, name: `${ml.MerchantName} (${ml.Id})` })
        })
        this.load_provider_details();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  toggle_edit(value:any, action?:any) {
    this.active.edit = value;
    if( value == false ) {
      if( action == 'save' ) {
        this.update_config();
      } else {
        this.load_provider_details();
      }
    }
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('VENDOR_SETTINGS.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  load_provider_details(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllMerchantVendorID",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.merchantList.map((ml:any)=>{
          if( res['Data'] ) {
            if( ml.id == res['Data'].TopUpMerchant ) this.active.p1 = ml;
            if( ml.id == res['Data'].BillsMerchant ) this.active.p2 = ml;
            if( ml.id == res['Data'].ConveraMerchant ) this.active.p3 = ml;
            if( ml.id == res['Data'].AtlasMerchant ) this.active.p4 = ml;
          }
        });
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  update_config(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"ModifyMerchantAccountNumberById",
          "dtoneMerchantId": this.active.p1.id,
          "puntoPagoMerchantId": this.active.p2.id,
          "converaMerchantId": this.active.p3.id,
          "moneyTransferMerchantId": this.active.p4.id,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_provider_details();
          this.active.edit = false;
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }


}
