import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class HelpTicketsService {
  constructor(private http: HttpClient, private router: Router) {}


  ticket_list(): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/GetCustomerHelpList`,
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

  close_ticket(id:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/CloseHelpTicket`,
      {
        "HelpTicketId": id,
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

  reopen_ticket(id:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/ReOpenHelpTicket`,
      {
        "HelpTicketId": id,
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
