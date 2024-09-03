import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class FeeConfigService {
  constructor(private http: HttpClient, private router: Router) {}


  fee_list(): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/GetTransactionFee`,
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

  update_fee(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/UpdateTransactionFee`,
      {
        "FeeId": data.id,
        "FeeAmount": data.amount
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
