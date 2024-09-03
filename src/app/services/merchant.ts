import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Injectable()
export class MerchantService {
  constructor(private http: HttpClient, private router: Router) {}

    get_transaction(data:any): Observable<any> {
        return this.http.post(
        `${environment.endPoint}/xp-ash-uad/GetAllMerchantTransactions`,
        {
            MerchantId: data.id,
            FilterType: "",
            FilterValue: "",
            PageNumber: "",
            NumberOfRecord: ""
        },
        {
            headers: {
            'Content-Type': `application/json`,
            },
            responseType: 'text' as 'json',
        },
        )
    }

    get_details(id:any): Observable<any> {
        return this.http.post(
        `${environment.endPoint}/xp-ash-uad/GetMerchant`,
        {
            MerchantId: id
        },
        {
            headers: {
            'Content-Type': `application/json`,
            },
            responseType: 'text' as 'json',
        },
        )
    }

    get_merchants(data:any): Observable<any> {
        return this.http.post(
        `${environment.endPoint}/xp-ash-uad/GetAllMerchants`,
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

    add_merchant(data:any): Observable<any> {
        return this.http.post(
        `${environment.endPoint}/xp-ash-uad/RegisterMerchant`,
        {
            Username: data.username,
            Password: data.password,
            Email: data.email,
            MobileNumber: data.mobile,
            MerchantName: data.merchant_name,
            FirstName: data.fname,
            LastName: data.lname,
            MiddleName: data.mname,
            Gender: data.gender,
            Birthday: data.bdate,
            Address1: data.address1,
            Address2: data.address2,
            City: data.city,
            State: data.state,
            Zip: data.zip,
            Country: data.country,
            IdNumber: data.id_number
        },
        {
            headers: {
            'Content-Type': `application/json`,
            },
            responseType: 'text' as 'json',
        },
        )
    }

    merchant_approve(data:any): Observable<any> {
        return this.http.post(
          `${environment.endPoint}/xp-ash-uad/ProcessMerchantRegistration`,
          {
            MerchantId: data.id,
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

}
