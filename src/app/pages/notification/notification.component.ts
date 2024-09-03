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
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: []
})
export class NotificationComponent{
  // @ViewChild('editor_field', { read: ElementRef }) editor_field!: ElementRef<HTMLInputElement>
  // @ViewChild('content_field', { read: ElementRef }) content_field!: ElementRef<HTMLInputElement>

  @ViewChild('editor_field', { static: true }) editor_field: any = ElementRef;
  @ViewChild('content_field', { static: true }) content_field: any = ElementRef;
  
  breadCrumbItems: any = [];

  notif_list : any = [];
  filtered_notif_list : any = [];

  tag_list: any = [];

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
    subject: '',
    description: '',
    content: '',
    code: '',
    name: '',
    name_display: '',
    header: '',
    footer: '',
    tagIds: '',
    category_id: '',
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
      this.loadFilter();
    });
    setTimeout(() => { this.loadBreadCrumbs(); }, 1000);
    this.loadFilter();

    this.access.getPermission();
    // this.autologout.AutoLogout();

    this.load_notif();
    this.load_tags();
  }

  loadFilter(){
    this.selectValue = [];
    this.translate.get('NOTIFICATION.text2').subscribe((text:string) => { this.selectValue.push({ id: '1', name: text }) });
    this.translate.get('NOTIFICATION.text3').subscribe((text:string) => { this.selectValue.push({ id: '2', name: text }) });
    this.translate.get('NOTIFICATION.text4').subscribe((text:string) => { this.selectValue.push({ id: '3', name: text }) });
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('NOTIFICATION.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  load_notif(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllTemplate",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.notif_list = res['Data']
        this.filter_notif();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_notif() {
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "TemplateName",
        "TemplateCategoryName",
        "TemplateDescription",
      ]
    };
    const lists = this.notif_list;
    const fuse = new Fuse(lists, options)
    this.filtered_notif_list = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_notif_list = this.filtered_notif_list.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_notif_list.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.setPage(this.pager.page);
  }

  update_notif(){
    this.active.content = this.email_editor.wwEditor.editor.body.textContent
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"UpdateTemplateById",
          "Id": this.active.id,
          "Code": this.active.code,
          "Name": this.active.name,
          "Description": this.active.description,
          "Content": this.active.content,
          "Subject": this.active.subject,
          "Header": this.active.header,
          "Footer": this.active.footer,
          "TagIds": this.active.tagIds,
          "TransType": "",
          "IsPrimary":"",
          "NotificationId":"",
          "TemplateCategoryId": this.active.category_id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['Message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_notif();
          this.modalService.dismissAll();
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
    if( data.TemplateCategoryId == 1 ) this.load_editor();
    this.active = {
      id: data.TemplateId,
      subject: data.Subject,
      description: data.TemplateDescription,
      content: data.Content,
      code: data.TemplateCode,
      name : data.TemplateName,
      name_display: data.TemplateName,
      header: data.Header,
      footer: data.Footer,
      tagIds: data.TagIds,
      category_id: data.TemplateCategoryId
    }
    this.modalService.open(content, { size: 'md', centered: true });
  }

  setPage(page:any, e?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_notif_list.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_notif_list.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_notif_list.length ? this.filtered_notif_list.length : end) : 0;
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
        case '1': item = 'TemplateName'; break;
        case '2': item = 'TemplateCategoryName'; break;
        case '3': item = 'TemplateDescription'; break;
      }
      res.push(item)
    });
    return res;
  }


  // notif

  load_tags(){
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetTag",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.tag_list = res['Data']
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  email_editor: any
  caretPos: any
  lastFocused: any
  currentTab: any = '1'

  clickTab(tab:any): void {
    this.currentTab = tab
  }

  load_editor(){
    setTimeout(() => {
      this.email_editor = new Editor({
        el: document.querySelector('#email_editor')!,
        initialEditType: 'wysiwyg',
        hideModeSwitch: true,
        usageStatistics: false,
        initialValue: this.active.content,
        toolbarItems: [
          'show/hide',
          'bold',
          'italic',
          'underline',
          'strike',
          'ul',
          'ol',
          'indent',
          'outdent',
          'link',
          'hr'
        ],
      })
    }, 500)
  }

  getCaretPos(type:any, oField:any) {
    this.lastFocused = type
    if (type == 'textarea') {
      this.caretPos = oField.selectionEnd
    } else {
      this.caretPos = oField.wwEditor.getRange().startOffset
    }
  }

  selectTag(selected:any) {
    let tagCode = selected.ContentTagCode//.split('~').join('')
    // tagCode = `[${tagCode}]`
    if (this.currentTab != '1') {
      this.content_field.nativeElement.focus()
      this.active.content = `${this.content_field.nativeElement.value} ${tagCode}`
    } else if (this.email_editor) {
      this.email_editor.wwEditor.focus()
      this.email_editor.insertText(tagCode)
      this.active.content = this.email_editor.wwEditor.editor.body.textContent
    }
  }

}
