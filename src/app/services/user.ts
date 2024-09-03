import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}


  login(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/auth/login`,
      {
        username: data.username, // "ralph.lopez.xentra@gmail.com"
        password: data.password, // "Pass@123"
      },
      {
        headers: {
          'Content-Type': `application/json`,
        },
        responseType: 'text' as 'json',
      },
    )
  }
  
  forgot_password(email:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/auth/forgotPassword`,
      {
        username: email, 
      },
      {
        headers: {
          'Content-Type': `application/json`,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  create_user(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/user/CreateUser`,
      {
        username: data.username,
        password: data.password,
        userRoleId: data.role,
        firstName: data.fname,
        middleName: data.mname,
        lastName: data.lname,
        mobile: data.mobile,
        email: data.username,
        address: data.address,
        title: data.title
      },
      {
        headers: {
          'Content-Type': `application/json`,
          SessionId: localStorage.getItem('token')!,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  update_user(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/user/UpdateUserDetailsById`,
      {
        userId: data.id,
        userRoleId: data.role,
        firstName: data.fname,
        middleName: data.mname,
        lastName: data.lname,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        title: data.title
      },
      {
        headers: {
          'Content-Type': `application/json`,
          SessionId: localStorage.getItem('token')!,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  delete_user(id:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/user/DeleteUser`,
      {
        userId: id,
      },
      {
        headers: {
          'Content-Type': `application/json`,
          SessionId: localStorage.getItem('token')!,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  user_list(): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/user/GetUserList`,
      {
      },
      {
        headers: {
          'Content-Type': `application/json`,
          'SessionId': localStorage.getItem('token')!
        },
        responseType: 'text' as 'json',
      },
    )
  }

  group_list(): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/group/GetGroupList`,
      {
      },
      {
        headers: {
          'Content-Type': `application/json`,
          'SessionId': localStorage.getItem('token')!
        },
        responseType: 'text' as 'json',
      },
    )
  }
  
  process_group(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/group/SaveGroup`,
      {
        groupsId: (data.id ? data.id : ''),
        groupsProgramId: "3",
        groupsCode: data.code,
        groupsName: data.name,
        groupsDescription: data.description
      },
      {
        headers: {
          'Content-Type': `application/json`,
          SessionId: localStorage.getItem('token')!,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  delete_group(id:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/group/DeleteGroup`,
      {
        groupsId: id,
      },
      {
        headers: {
          'Content-Type': `application/json`,
          SessionId: localStorage.getItem('token')!,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  role_list(): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/role/GetRoleList`,
      {
      },
      {
        headers: {
          'Content-Type': `application/json`,
          'SessionId': localStorage.getItem('token')!
        },
        responseType: 'text' as 'json',
      },
    )
  }

  process_role(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/role/SaveRole`,
      {
        rolesId: ( data.id ? data.id : "" ),
        rolesProgramId: "3",
        rolesGroupId: data.group,
        rolesName: data.name,
        rolesDesc: data.description,
        rolesPermission: data.perm
      },
      {
        headers: {
          'Content-Type': `application/json`,
          'SessionId': localStorage.getItem('token')!
        },
        responseType: 'text' as 'json',
      },
    )
  }

  delete_role(id:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/role/DeleteRoles`,
      {
        rolesId: id,
      },
      {
        headers: {
          'Content-Type': `application/json`,
          SessionId: localStorage.getItem('token')!,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  module_list(): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/module/GetModulesPerProgram`,
      {
      },
      {
        headers: {
          'Content-Type': `application/json`,
          'SessionId': localStorage.getItem('token')!
        },
        responseType: 'text' as 'json',
      },
    )
  }

}
