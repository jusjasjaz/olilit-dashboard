import { Component} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Fuse from 'fuse.js';;
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { HelpTicketsService } from 'src/app/services/help-tickets';
import { ToastService } from '../dashboards/dashboard/toast-service';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';
import { accessService } from 'src/app/services/permissions';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-help-tickets',
  templateUrl: './help-tickets.component.html',
  styleUrls: ['./help-tickets.component.scss'],
  providers: []
})
export class HelpTicketsComponent{
  
  breadCrumbItems: any = [];

  ticketList : any = [];
  filtered_ticketList : any = [];

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
    description: '',
    status: '',
  }

  constructor(
    private helpTicketService: HelpTicketsService,
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
      this.loadFilter();
    });
    setTimeout(() => { this.loadBreadCrumbs(); }, 1000);
    this.loadFilter();

    this.access.getPermission();
    // this.autologout.AutoLogout();

    this.load_tickets();
  }

  loadFilter(){
    this.selectValue = [];
    this.translate.get('HELP_TICKET.text2').subscribe((text:string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('HELP_TICKET.text3').subscribe((text:string) => { this.selectValue.push({ id: '2', name: text }) });
    this.translate.get('HELP_TICKET.text4').subscribe((text:string) => { this.selectValue.push({ id: '3', name: text }) });
    this.translate.get('HELP_TICKET.text5').subscribe((text:string) => { this.selectValue.push({ id: '4', name: text }) });
    this.translate.get('HELP_TICKET.text6').subscribe((text:string) => { this.selectValue.push({ id: '5', name: text }) });
    this.translate.get('HELP_TICKET.text7').subscribe((text:string) => { this.selectValue.push({ id: '6', name: text }) });
    this.translate.get('HELP_TICKET.text8').subscribe((text:string) => { this.selectValue.push({ id: '7', name: text }) });
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('HELP_TICKET.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  load_tickets(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetCustomerHelpList",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.ticketList = res['Data']
        this.filter_tickets();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_tickets() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "CustomerName",
        "CustomerEmail",
        "CustomerMobile",
        "HelpTypeName",
        "HelpTicketCreateDate",
        "HelpTicketStatus",
        "HelpTicketIssue",
      ]
    };
    const lists = this.ticketList;
    const fuse = new Fuse(lists, options)
    this.filtered_ticketList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_ticketList = this.filtered_ticketList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_ticketList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page);
  }

  reopen_ticket(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"ReOpenHelpTicket",
      "HelpTicketId": this.active.id,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_tickets();
          this.modalService.dismissAll();
          this.active = {
            id: '',
            description: '',
            status: '',
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

  close_ticket(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"CloseHelpTicket",
      "HelpTicketId": this.active.id,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_tickets();
          this.modalService.dismissAll();
          this.active = {
            id: '',
            description: '',
            status: '',
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
      id: data.HelpTicketId,
      description: data.HelpTicketIssue,
      status: data.HelpTicketStatus.toLowerCase()
    }
    this.modalService.open(content, { size: 'md', centered: true });
  }

  setPage(page:any, e?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_ticketList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_ticketList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_ticketList.length ? this.filtered_ticketList.length : end) : 0;
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
        case '1': item = 'HelpTicketCreateDate'; break;
        case '2': item = 'CustomerName'; break;
        case '3': item = 'CustomerEmail'; break;
        case '4': item = 'CustomerMobile'; break;
        case '5': item = 'HelpTypeName'; break;
        case '6': item = 'HelpTicketStatus'; break;
        case '7': item = 'HelpTicketIssue'; break;
      }
      res.push(item)
    });
    return res;
  }

}