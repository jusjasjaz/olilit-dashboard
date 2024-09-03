import { Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import { DecimalPipe} from '@angular/common';

import { OrdersService } from './listjs.service';
import { ToastService } from '../dashboards/dashboard/toast-service';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-um-add-roles',
  templateUrl: './um-add-roles.component.html',
  styleUrls: ['./um-add-roles.component.scss'],
  providers: [OrdersService, DecimalPipe]
})
export class UmAddRolesComponent{

  breadCrumbItems!: Array<{}>;

  @Input() selected_role:any;

  @Output() close = new EventEmitter<string>();
  @Output() reload = new EventEmitter<string>();

  groupList: any = [];
  moduleList: any = [];
  role_details: any = {
    id: '',
    name: '',
    group: '',
    description: '',
    perm: '',
  }

  addPermCheck: any = [];

  constructor(
    public service: OrdersService, 
    public toastService: ToastService,
    private pentestService: PentestService,
    private crypto: Crypt,
    ) {
   }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Dashboard'},
      { label: 'User Management' , active: true },
    ];

    this.load_modules();
    this.load_group();

    if( this.selected_role ) {
      this.role_details.id = this.selected_role.rolesId;
      this.role_details.name = this.selected_role.rolesName;
      this.role_details.group = this.selected_role.rolesGroupId;
      this.role_details.description = this.selected_role.rolesDesc;
      if( this.selected_role.modulePermissions ) {
        this.selected_role.modulePermissions.map((data:any)=>{
          if( data.rolePermissions.includes('~') ) {
            data.rolePermissions.split('~').map((type:any)=>{
              let c = `${data.moduleId}|${type}`;
              this.addPermCheck.push(c);
            });
          } else {
            let c = `${data.moduleId}|${data.rolePermissions}`;
            this.addPermCheck.push(c);
          }
        });
      }
    }
  }

  load_modules(){
    let postParams = {
      "Service":"module",
      "Method":"GetModulesPerProgram",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        res['data'].map((val:any)=>{
          if( val.programId == '3' ) {
            this.moduleList = val.modules;
          }
        });
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  load_group(){
    let postParams = {
      "Service":"group",
      "Method":"GetGroupList",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.groupList = res['data'];
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  process_role(){

    let a:any = [];
    let sortedPerm:any = []

    /* sort checked permission */
    this.addPermCheck.map((data:any) => {
      let v = data.toString().split('|')
      if (!a[v[0]]) a[v[0]] = []
      a[v[0]].push(v[1])
    })

    a.map((data:any, key:any) => {
      sortedPerm.push(key + '|' + data.join('~'))
    })

    this.role_details.perm = sortedPerm.join('*');

    let postParams = {
      "Service":"role",
      "Method":"SaveRole",
      "rolesId": ( this.role_details.id ? this.role_details.id : "" ),
      "rolesProgramId": "3",
      "rolesGroupId": this.role_details.group,
      "rolesName": this.role_details.name,
      "rolesDesc": this.role_details.description,
      "rolesPermission": this.role_details.perm
    };
    console.log(postParams)
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        if( res['isSuccess'] == true ) {
          this.toastService.show(res['message'], { classname: 'bg-success text-center text-white', delay: 5000 });
          this.backToRoles();
          this.reload.emit();
        } else {
          this.toastService.show(( res.message ? res.message : res.Message ), { classname: 'bg-danger text-center text-white', delay: 5000 });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  backToRoles(){
    this.close.emit();
  }

  permClicked(e?:any, id?:any, type?:any, parentData?:any) {
    let c = `${id}|${type}`;
    let perms = ['R', 'E', 'A', 'D', 'P'];

    if( type == 'ALL' ) { /* clicked all chkbox */
      perms.map((p_type:any)=>{
        let c = `${id}|${p_type}`;
        if( e.target.checked ) {
          this.addPermCheck.push(c);
        } else {
          this.addPermCheck = this.addPermCheck.map((data:any) => {
            if (data !== c) return data
          })
        }
        /* if parent module checked */
        if( parentData ) {
          if( parentData.subModules ) {
            /* first child */
            parentData.subModules.map((firstLevel:any)=>{
              let c = `${firstLevel.moduleId}|${p_type}`;
              if( e.target.checked ) {
                this.addPermCheck.push(c);
              } else {
                this.addPermCheck = this.addPermCheck.map((first:any) => {
                  if (first !== c) return first
                })
              }
              /* second child */
              if( firstLevel.subModules ) {
                firstLevel.subModules.map((secondLevel:any)=>{
                  let c = `${secondLevel.moduleId}|${p_type}`;
                  if( e.target.checked ) {
                    this.addPermCheck.push(c);
                  } else {
                    this.addPermCheck = this.addPermCheck.map((sec:any) => {
                      if (sec !== c) return sec
                    })
                  }
                  /* third child */
                  if( secondLevel.subModules ) {
                    secondLevel.subModules.map((thirdLevel:any)=>{
                      let c = `${thirdLevel.moduleId}|${p_type}`;
                      if( e.target.checked ) {
                        this.addPermCheck.push(c);
                      } else {
                        this.addPermCheck = this.addPermCheck.map((third:any) => {
                          if (third !== c) return third
                        })
                      }
                    })                    
                  }
                })
              }
            })
          }
        }
      });
    } else { /* clicked normal chkbox */
      if( e.target.checked ) {
        this.addPermCheck.push(c);
      } else {
        this.addPermCheck = this.addPermCheck.map((data:any) => {
          if (data !== c) return data
        })
      }
      /* if parent module checked */
      if( parentData ) {
        if( parentData.subModules ) {
          /* first child */
          parentData.subModules.map((firstLevel:any)=>{
            let c = `${firstLevel.moduleId}|${type}`;
            if( e.target.checked ) {
              this.addPermCheck.push(c);
            } else {
              this.addPermCheck = this.addPermCheck.map((first:any) => {
                if (first !== c) return first
              })
            }
            /* second child */
            if(firstLevel.subModules) {
              firstLevel.subModules.map((secondLevel:any)=>{
                let c = `${secondLevel.moduleId}|${type}`;
                if( e.target.checked ) {
                  this.addPermCheck.push(c);
                } else {
                  this.addPermCheck = this.addPermCheck.map((sec:any) => {
                    if (sec !== c) return sec
                  })
                }
                /* third child */
                if( secondLevel.subModules ) {
                  secondLevel.subModules.map((thirdLevel:any)=>{
                    let c = `${thirdLevel.moduleId}|${type}`;
                    if( e.target.checked ) {
                      this.addPermCheck.push(c);
                    } else {
                      this.addPermCheck = this.addPermCheck.map((third:any) => {
                        if (third !== c) return third
                      })
                    }
                  })                    
                }
              })
            }
          })
        }
      }
    }
    /* remove undefined */
    this.addPermCheck = this.addPermCheck.filter(function(x:any) {
      return x !== undefined
    })
  }

}