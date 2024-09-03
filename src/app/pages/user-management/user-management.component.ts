import { Component} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from 'src/app/services/user';
import Fuse from 'fuse.js';;
import { ToastService } from '../dashboards/dashboard/toast-service';
import { accessService } from 'src/app/services/permissions';
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent{

  breadCrumbItems: any = [];

  pager: any = {
    limited_page: [],
    pages: [],
    page: 1,
    start: 1,
    end: 10,
    limit: 10
  }
  userList: any = [];
  filtered_userList: any = [];

  groupList: any = [];
  filtered_groupList: any = [];

  roleList: any = [];
  filtered_roleList: any = [];

  filter_keyword : any = '';
  filter_column: any = [];
  user_selectValue: any = [];
  group_selectValue: any = [];
  role_selectValue: any = [];

  user_details: any = {
    id: '',
    username: '',
    password: '',
    role: '',
    fname: '',
    mname: '',
    lname: '',
    mobile: '',
    address: '',
    title: '',
  };

  group_details: any = {
    id: '',
    code: '',
    name: '',
    description: '',
  }

  role_details: any = [];

  delete_selected: any = {
    user: false,
    group: false,
    role: false,
    value: '',
  }

  change_pass: any = {
    old: '',
    new: '',
    confirm: '',
  }

  togglePass: any = {
    old: false,
    new: false,
    confirm: false,
    add: false,
  }

  popPermission: boolean = false;

  activeId: any = '1';

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    public toastService: ToastService,
    public access: accessService,
    public autologout : AutoLogOutService,
    private translate: TranslateService,
    private pentestService: PentestService,
    private crypto: Crypt,
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

    if( this.access.permissions['User'].includes('R') ) {
      this.activeId = '1';
      this.load_users();
      this.load_roles(true); // no filter
    } else if( this.access.permissions['Group'].includes('R') ) {
      this.activeId = '2';
      this.load_group();
    } else if( this.access.permissions['Roles'].includes('R') ) { 
      this.activeId = '3';
      this.load_roles();
    }
  }

  loadFilter(){
    this.user_selectValue = [];
    this.translate.get('USER_MANAGEMENT.USERS.text2').subscribe((text:string) => { this.user_selectValue.push({ id: 'u1', name: text }) });
    this.translate.get('USER_MANAGEMENT.USERS.text3').subscribe((text:string) => { this.user_selectValue.push({ id: 'u2', name: text }) });
    this.translate.get('USER_MANAGEMENT.USERS.text4').subscribe((text:string) => { this.user_selectValue.push({ id: 'u3', name: text }) });
    this.translate.get('USER_MANAGEMENT.USERS.text5').subscribe((text:string) => { this.user_selectValue.push({ id: 'u4', name: text }) });
    this.translate.get('USER_MANAGEMENT.USERS.text6').subscribe((text:string) => { this.user_selectValue.push({ id: 'u5', name: text }) });
    this.translate.get('USER_MANAGEMENT.USERS.text9').subscribe((text:string) => { this.user_selectValue.push({ id: 'u6', name: text }) });
    this.group_selectValue = [];
    this.translate.get('USER_MANAGEMENT.GROUPS.text2').subscribe((text:string) => { this.group_selectValue.push({ id: 'g1', name: text }) });
    this.translate.get('USER_MANAGEMENT.GROUPS.text3').subscribe((text:string) => { this.group_selectValue.push({ id: 'g2', name: text }) });
    this.translate.get('USER_MANAGEMENT.GROUPS.text4').subscribe((text:string) => { this.group_selectValue.push({ id: 'g3', name: text }) });
    this.translate.get('USER_MANAGEMENT.GROUPS.text5').subscribe((text:string) => { this.group_selectValue.push({ id: 'g4', name: text }) });
    this.role_selectValue = [];
    this.translate.get('USER_MANAGEMENT.ROLES.text2').subscribe((text:string) => { this.role_selectValue.push({ id: 'r1', name: text }) });
    this.translate.get('USER_MANAGEMENT.ROLES.text3').subscribe((text:string) => { this.role_selectValue.push({ id: 'r2', name: text }) });
    this.translate.get('USER_MANAGEMENT.ROLES.text4').subscribe((text:string) => { this.role_selectValue.push({ id: 'r3', name: text }) });
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text })
    });
    this.translate.get('USER_MANAGEMENT.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true })
    });
  }

  /******************** USER ********************/

  load_users(){
    this.reset();
    this.popPermission = false;
    let postParams = {
      "Service":"user",
      "Method":"GetUserList",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.userList = res['data'];
        this.filter_users();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_users(){
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "firstName",
        "lastName",
        "email",
        "roleName",
        "groupName",
        "lastLogin",
        "createdDate",
        "status"
      ]
    };
    const lists = this.userList;
    const fuse = new Fuse(lists, options)
    this.filtered_userList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_userList = this.filtered_userList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_userList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.userSetPage(this.pager.page);
  }

  userSetPage(page:any, e?:any, list?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_userList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_userList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_userList.length ? this.filtered_userList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  /******************** GROUP ********************/

  load_group(){
    this.reset();
    this.popPermission = false;
    let postParams = {
      "Service":"group",
      "Method":"GetGroupList",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.groupList = res['data'];
        this.filter_group();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_group(){
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "groupsCode",
        "groupsName",
        "groupsDescription",
        "groupsUpdateDate",
      ]
    };
    const lists = this.groupList;
    const fuse = new Fuse(lists, options)
    this.filtered_groupList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_groupList = this.filtered_groupList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_groupList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.groupSetPage(this.pager.page);
  }

  groupSetPage(page:any, e?:any, list?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_groupList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_groupList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_groupList.length ? this.filtered_groupList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  /******************** ROLES ********************/

  load_roles(noFilter?:any){
    this.reset();
    this.popPermission = false;
    let postParams = {
      "Service":"role",
      "Method":"GetRoleList",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.roleList = res['data'];
        if( !noFilter ) this.filter_roles();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filter_roles(){
    const options = {
      tokenize: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.filter_column.length > 0 ? this.getColEquiv(this.filter_column) : [
        "rolesName",
        "rolesDesc",
        "updatedDate",
      ]
    };
    const lists = this.roleList;
    const fuse = new Fuse(lists, options)
    this.filtered_roleList = this.filter_keyword ? fuse.search(this.filter_keyword).map((item:any) => {
      return item
    }) : lists

    let nc = 0;
    this.filtered_roleList = this.filtered_roleList.map((data:any)=>{
      nc+=1;
      data.key = nc;
      return data;
    });

    this.pager.pages = [];
    for (let i = 0; i < Math.ceil(this.filtered_roleList.length / this.pager.limit); i++) {
      this.pager.pages.push(i + 1)
    }
    this.roleSetPage(this.pager.page);
  }

  roleSetPage(page:any, e?:any, list?:any) {
    let end
    if (e) {
      e.preventDefault()
    }
    this.pager.page = page > this.pager.pages.length ? this.pager.pages.length : (page < 1 ? 1 : page)
    this.pager.start = this.filtered_roleList.length ? (1 + (this.pager.limit * (this.pager.page - 1))) : 0
    this.pager.end = this.filtered_roleList.length ? ((end = this.pager.limit * this.pager.page) > this.filtered_roleList.length ? this.filtered_roleList.length : end) : 0;
    let a = this.pager.page - 10
    if (a < 0) {
      a = 0
    }
    this.pager.limited_page = this.pager.pages.slice(a, 10 + a)
  }

  processUser(type?:any){
    if( type == 'update' ) {
      this.update_user();
    } else {
      if( this.user_details.password.match(/[a-z]/) == null ){
        let msg = '';
        this.translate.get('USER_MANAGEMENT.USERS.VALIDATIONS.text1').subscribe((text:string) => { msg = text; });
        this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      }else if( this.user_details.password.match(/[A-Z]/) == null ){
        let msg = '';
        this.translate.get('USER_MANAGEMENT.USERS.VALIDATIONS.text2').subscribe((text:string) => { msg = text; });
        this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      }else if( this.user_details.password.match(/\d+/g) == null ){
        let msg = '';
        this.translate.get('USER_MANAGEMENT.USERS.VALIDATIONS.text3').subscribe((text:string) => { msg = text; });
        this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      }else if( this.user_details.password.match(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) == null ){
        let msg = '';
        this.translate.get('USER_MANAGEMENT.USERS.VALIDATIONS.text4').subscribe((text:string) => { msg = text; });
        this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      }else if( this.user_details.password.length < 8 ){
        let msg = '';
        this.translate.get('USER_MANAGEMENT.USERS.VALIDATIONS.text1').subscribe((text:string) => { msg = text; });
        this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      } else if( !this.isEmail(this.user_details.username) ) {
        let msg = '';
        this.translate.get('USER_MANAGEMENT.USERS.VALIDATIONS.text6').subscribe((text:string) => { msg = text; });
        this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      } else if( this.existing('user') ) {
        let msg = '';
        this.translate.get('USER_MANAGEMENT.USERS.VALIDATIONS.text7').subscribe((text:string) => { msg = text; });
        this.toastService.show(msg, { classname: 'bg-danger text-center text-white', delay: 5000 });
      } else {
        this.create_user();
      }
    }

  }

  create_user() {
    let postParams = {
      "Service":"user",
      "Method":"CreateUser",
      "username": this.user_details.username,
      "password": this.user_details.password,
      "userRoleId": this.user_details.role,
      "firstName": this.user_details.fname,
      "middleName": this.user_details.mname,
      "lastName": this.user_details.lname,
      "mobile": this.user_details.mobile,
      "email": this.user_details.username,
      "address": this.user_details.address,
      "title": this.user_details.title
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_users();
          this.modalService.dismissAll();
          this.reset_details();
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
          this.reset_details();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  update_user() {
    let postParams = {
      "Service":"user",
      "Method":"UpdateUserDetailsById",
      "userId": this.user_details.id,
      "userRoleId": this.user_details.role,
      "firstName": this.user_details.fname,
      "middleName": this.user_details.mname,
      "lastName": this.user_details.lname,
      "mobile": this.user_details.mobile,
      "email": this.user_details.email,
      "address": this.user_details.address,
      "title": this.user_details.title
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_users();
          this.modalService.dismissAll();
          this.reset_details();
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
          this.reset_details();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  delete_user(id:any) {
    let postParams = {
      "Service":"user",
      "Method":"DeleteUser",
      "userId": id,
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_users();
          this.modalService.dismissAll();
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
          this.modalService.dismissAll();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  process_group(){ // save & update one API only
    let postParams = {
      "Service":"group",
      "Method":"SaveGroup",
      "groupsId": (this.group_details.id ? this.group_details.id : ''),
      "groupsProgramId": "3",
      "groupsCode": this.group_details.code,
      "groupsName": this.group_details.name,
      "groupsDescription": this.group_details.description
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_group();
          this.modalService.dismissAll();
          this.reset_details();
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
          this.reset_details();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  delete_group(id:any) {
    let postParams = {
      "Service":"group",
      "Method":"DeleteGroup",
      "groupsId": id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_group();
          this.modalService.dismissAll();
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
          this.modalService.dismissAll();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  delete_role(id:any) {
    let postParams = {
      "Service":"role",
      "Method":"DeleteRoles",
      "rolesId": id
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.load_roles();
          this.modalService.dismissAll();
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
          this.modalService.dismissAll();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  delete_confirm(){
    if( this.delete_selected.user ) {
      this.delete_user(this.delete_selected.value);
    } else if( this.delete_selected.group ) {
      this.delete_group(this.delete_selected.value);
    } else if( this.delete_selected.role ) {
      this.delete_role(this.delete_selected.value);
    }
  }

  getColEquiv(colList:any) {
    let res: any = [];
    colList.map((data:any)=>{
      let item = '';
      switch (data.id) {
        case 'u1': item = 'firstName'; break;
        case 'u2': item = 'lastName'; break;
        case 'u3': item = 'email'; break;
        case 'u4': item = 'roleName'; break;
        case 'u5': item = 'groupName'; break;
        case 'u6': item = 'status'; break;

        case 'g1': item = 'groupsCode'; break;
        case 'g2': item = 'groupsName'; break;
        case 'g3': item = 'groupsDescription'; break;
        case 'g4': item = 'groupsUpdateDate'; break;

        case 'r1': item = 'rolesName'; break;
        case 'r2': item = 'rolesDesc'; break;
        case 'r3 ': item = 'updatedDate'; break;
      }
      res.push(item)
    });
    return res;
  }

  reset(){
    this.pager = {
      limited_page: [],
      pages: [],
      page: 1,
      start: 1,
      end: 10,
      limit: 10
    }
    this.filter_keyword = '';
    this.filter_column = [];
  }

  reset_details(){
    this.user_details = {
      id: '',
      username: '',
      password: '',
      role_id: '',
      fname: '',
      mname: '',
      lname: '',
      mobile: '',
      address: '',
      title: '',
    };

    this.group_details = {
      id: '',
      code: '',
      name: '',
      description: '',
    }
  }

  isEmail(search:string):boolean {
    var  serchfind:boolean;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    serchfind = regexp.test(search);
    return serchfind
  }

  existing(type:any) {
    let res = false;
    switch (type) {
      case 'user':
          this.userList.map((data:any)=>{
            if( data.username == this.user_details.username ) res = true;
          });
        break;
    }
    return res;
  }

  toggleEye(type:any) {
    switch (type) {
      case 'add': this.togglePass.add = !this.togglePass.add; break;
      case 'old': this.togglePass.old = !this.togglePass.old; break;
      case 'new': this.togglePass.new = !this.togglePass.add; break;
      case 'confirm': this.togglePass.confirm = !this.togglePass.add; break;
    }
  }

  openModal(content: any, data?:any, type?:any, display?:any) {
    this.reset_details();
    this.modalService.open(content, { size: 'md', centered: true });

    // for update & delete
    switch (type) {
      case 'user':
          this.user_details.id = data.userId;
          this.user_details.role = data.userRoleId;
          this.user_details.fname = data.firstName;
          this.user_details.mname = ( data.middleName ? data.middleName : '' );
          this.user_details.lname = data.lastName;
          this.user_details.mobile = data.mobile;
          this.user_details.address = data.address;
          this.user_details.title = ( data.title ? data.title : '' );
          this.user_details.email = data.email;
        break;
      case 'group':
            this.group_details.id = data.groupsId;
            this.group_details.code = data.groupsCode;
            this.group_details.name = data.groupsName;
            this.group_details.description = data.groupsDescription;
        break;
      case 'del_user':
          this.delete_selected = {
            user: true,
            group: false,
            role: false,
            value: data,
            display: display,
          }
        break;
      case 'del_group':
          this.delete_selected = {
            user: false,
            group: true,
            role: false,
            value: data,
            display: display,
          }
        break;
      case 'del_role':
          this.delete_selected = {
            user: false,
            group: false,
            role: true,
            value: data,
            display: display,
          }
        break;
    }
  }

  togglePermission(data?:any){
    this.role_details = data ? data : [];
    this.popPermission = !this.popPermission;
  }

}

