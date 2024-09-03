import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Injectable()
export class CustomerService {
  constructor(private http: HttpClient, private router: Router) {}

  customer_approve_card(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/ProcessCustomerCardApplication`,
      {
        CustomerId: data.id,
        "Status": "1"
      },
      {
        headers: {
          'Content-Type': `application/json`,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  get_customers_logs(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/GetActivityLogs`,
      {
        CustomerId: data.id,
        FilterType: "",
        FilterValue: "",
        PageNumber: "1",
        NumberOfRecord: "1000000"
      },
      {
        headers: {
          'Content-Type': `application/json`,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  get_customers_transactions(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/GetAllTransactions`,
      {
        CustomerId: data.id,
        FilterType: "",
        FilterValue: "",
        PageNumber: "1",
        NumberOfRecord: "1000000"
      },
      {
        headers: {
          'Content-Type': `application/json`,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  get_customers_details(id:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/GetCustomer`,
      {
        CustomerId: id,
      },
      {
        headers: {
          'Content-Type': `application/json`,
        },
        responseType: 'text' as 'json',
      },
    )
  }

  get_customers(data:any): Observable<any> {
    return this.http.post(
      `${environment.endPoint}/xp-ash-uad/GetAllCustomers`,
      {
        FilterType: "",
        FilterValue: "",
        PageNumber: "1",
        NumberOfRecord: "1000000"
      },
      {
        headers: {
          'Content-Type': `application/json`,
        },
        responseType: 'text' as 'json',
      },
    )
  }



}
