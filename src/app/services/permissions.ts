import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

@Injectable()
export class accessService {
  constructor(private http: HttpClient, private router: Router) {}

  permissions: any = []

  getPermission() {
    this.permissions = []
    let modPerm = JSON.parse(localStorage.getItem('permission')!);
    modPerm.map((parent:any)=>{
      let mod = this.convert(parent.moduleDescription);
      this.permissions[mod] = parent.rolePermissions;
      if( parent.subModules.length != 0 ) {
        parent.subModules.map((first:any)=>{
            this.permissions[first.moduleDescription] = first.rolePermissions;
            first.subModules.map((second:any)=>{
              this.permissions[second.moduleDescription] = second.rolePermissions;
              second.subModules.map((third:any)=>{
                this.permissions[third.moduleDescription] = third.rolePermissions;
            })
          })
        })
      }
    });
  }

  convert( module:any ){
    let result = '';
    switch( module.toLowerCase() ){
      case 'panel de control': result = 'dashboard'; break;
      case 'clientes': result = 'customers'; break;
      case 'establecimientos': result = 'merchants'; break;
      case 'manejo del usuario': result = 'user management'; break;
      case 'limitar configuración': result = 'limit configuration'; break;
      case 'configuración de recargo': result = 'fee configuration'; break;
      case 'solicitudes de asistencia': result = 'help ticket'; break;
      default: result = module; break;
    }
    return result;
  }
}
