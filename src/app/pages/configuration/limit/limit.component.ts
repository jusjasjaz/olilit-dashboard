import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Fuse from 'fuse.js';;
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { FeeConfigService } from 'src/app/services/fee-config';
import { ToastService } from '../../dashboards/dashboard/toast-service';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';
import { accessService } from 'src/app/services/permissions';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Component({
  selector: 'app-limit',
  templateUrl: './limit.component.html',
  styleUrls: ['./limit.component.scss'],
  providers: []
})
export class LimitConfigComponent {

  breadCrumbItems: any = [];

  limitList: any = [];
  filtered_limitList: any = [];

  pager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }

  filter_keyword: any = '';
  filter_column: any = [];
  selectValue: any = [];

  active: any = {
    id: '',
    name: '',
    amount: '',
    reset_day: '',
    is_currency: '',
  }

  lastDayActive: any;
  isCurrency: boolean = true
  date = new Date();
  lastDay: any;

  constructor(
    private feeService: FeeConfigService,
    private modalService: NgbModal,
    public toastService: ToastService,
    public autologout: AutoLogOutService,
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

    this.load_limits();

    this.lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    this.lastDay = moment(this.lastDay).format('D');
  }

  loadFilter() {
    this.selectValue = [];
    this.translate.get('LIMIT_CONFIGURATION.text2').subscribe((text: string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('LIMIT_CONFIGURATION.text3').subscribe((text: string) => { this.selectValue.push({ id: '2', name: text }) });
    this.translate.get('LIMIT_CONFIGURATION.text4').subscribe((text: string) => { this.selectValue.push({ id: '3', name: text }) });
    this.translate.get('LIMIT_CONFIGURATION.text5').subscribe((text: string) => { this.selectValue.push({ id: '4', name: text }) });
  }

  loadBreadCrumbs() {
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text: string) => {
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('LIMIT_CONFIGURATION.text1').subscribe((text: string) => {
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  load_limits() {
    let postParams = {
      "Service": "xp-ash-uad",
      "Method": "GetNewLimitConfiguration",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if (!res['Data']['limits']) {
          this.limitList = [res['Data']['limits']];
        } else {
          this.limitList = res['Data']['limits']
        }

        this.limitList = this.limitList.map((val: any) => {
          switch (val['ResetDay']) {
            case '0':
              val['ResetDay'] = 'never';
              break;
            case this.lastDay:
              val['ResetDay'] = 'lastDayOfTheMonth';
              break;
          }
          return val;
        })

        this.filter_limit();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_limit() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "Id",
        "BalanceLimit",
        "MonthlyLimit",
        "ResetDay",
        "IsReset",
      ]
    };
    const lists = this.limitList;
    const fuse = new Fuse(lists, options)
    this.filtered_limitList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item: any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_limitList = this.filtered_limitList.map((data: any) => {
      nc += 1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_limitList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page);
  }

  process_fee() {
    if (this.active.reset_day != 'lastDayOfTheMonth' && this.active.reset_day != 'lastDayOfTheMonth') {
      if (this.active.reset_day == '0') {
        this.toastService.show('Specific day cannot be zero.', { classname: 'bg-danger text-center text-white', delay: 5000 });
        return;
      } else if (Number(this.active.reset_day) >= Number(this.lastDay)) {
        this.toastService.show('Specific day cannot be equal or greater than the last day of the month.', { classname: 'bg-danger text-center text-white', delay: 5000 });
        return;
      }
    }

    if (this.active.id) {
      this.updateLimit();
    } else {
      this.addNewLimit();
    }
  }

  addNewLimit() {
    let postParams = {
      "Service": "xp-ash-uad",
      "Method": "AddNewLimitConfiguration",
      "LimitAmount": this.active.amount.replace("$", ""),
      "LimitName": this.active.name,
      "LimitResetDay": this.active.reset_day,
      "IsCurrency": (this.active.is_currency == true ? "1" : "0")

    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if (res['isSuccess'] == true) {
          this.toastService.show(res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_limits();
          this.modalService.dismissAll();
          this.active = {
            id: '',
            name: '',
            amount: '',
            reset_day: '',
            is_currency: '',
          }
        } else {
          this.toastService.show((res.message ? res.message : res.Message), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  updateLimit() {
    let postParams = {
      "Service": "xp-ash-uad",
      "Method": "ModifyNewLimitConfiguration",
      "LimitId": this.active.id,
      "LimitAmount": this.active.amount.replace("$", ""),
      "LimitName": this.active.name,
      "LimitResetDay": this.active.reset_day,
      "IsCurrency": (this.active.is_currency == true ? "1" : "0")
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if (res['isSuccess'] == true) {
          this.toastService.show(res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_limits();
          this.modalService.dismissAll();
          this.active = {
            id: '',
            name: '',
            amount: '',
            reset_day: '',
            is_currency: '',
          }
        } else {
          this.toastService.show((res.message ? res.message : res.Message), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  openModal(content: any, data?: any) {
    if (data) {
      this.lastDayActive = data.ResetDay;

      this.active = {
        id: data.Id,
        name: data.LimitName,
        amount: `$${data.LimitAmount}`,
        reset_day: data.ResetDay,
        is_currency: data.IsCurrency,
      }
      if (this.active.is_currency == "0") {
        this.active.is_currency = false;
      }
      else {
        this.active.is_currency = true;
      }
      if (data.ResetDay == '0') {
        this.active.reset_day = 'never';
      }
    } else {
      this.active = {
        id: '',
        name: '',
        amount: '',
        reset_day: '',
        is_currency: true,
      }
    }
    this.isCur(this.active.is_currency)
    this.modalService.open(content, { size: 'md', centered: true });
  }

  setPage(page: any, e?: any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_limitList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_limitList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_limitList.length ? this.filtered_limitList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  getColEquiv(colList: any) {
    let res: any = [];
    colList.map((data: any) => {
      let item = '';
      switch (data.id) {
        case '1': item = 'Id'; break;
        case '2': item = 'BalanceLimit'; break;
        case '3': item = 'MonthlyLimit'; break;
        case '4': item = 'ResetDay'; break;
      }
      res.push(item)
    });
    return res;
  }

  numbersOnly(e: any) {
    let val = e.target.value;
    let count = val.split('.').length - 1;
    let allowed = ['Backspace', 'Enter', 'Delete', 'Tab', '0', '.'];



    // handle dot
    if (e.key == '.') {
      if (count == 1) return false; // one dot only
      if (val.length == '6') return false; // maxlength is 7, so dot is not allowed to be in last
      if (val == '') e.target.value = '0'; // add zero if dot click first
    }
    return allowed.indexOf(e.key) >= 0 || !!Number(e.key);
  }

  resetDayVal(value: any) {
    if (value) {
      this.active.reset_day = value;
    } else {
      this.active.reset_day = (this.lastDayActive == 'lastDayOfTheMonth' || this.lastDayActive == 'never') ? '' : this.lastDayActive;
    }
  }

  addDolar(e: any) {
    if (e.target.value.indexOf('$') < 0 && e.target.value.length > 0 && this.active.is_currency == '1') {
      e.target.value = `$${e.target.value}`;
    } else if (e.target.value.length == '1' && e.target.value.indexOf('$') == '0') {
      e.target.value = '';
    }
  }
  isCur(cur: any) {
    if (cur == false) {
      this.active.amount = this.active.amount.replace('$', '')
    } else {
      this.active.amount = '$' + this.active.amount.replace('$', '')
    }

  }
}
